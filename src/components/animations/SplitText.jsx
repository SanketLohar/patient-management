import { motion } from 'framer-motion';
import { useEffect, useRef, useState, useMemo } from 'react';

const easeMap = {
  'power3.out': [0.16, 1, 0.3, 1], // Expo-out equivalent
  'power2.out': [0.25, 0.46, 0.45, 0.94],
  'power1.out': [0.55, 0.085, 0.68, 0.53],
  'back.out': [0.175, 0.885, 0.32, 1.275]
};

export default function SplitText({
  text = '',
  className = '',
  style = {},
  delay = 50, // in ms
  duration = 1.25, // in seconds
  ease = 'power3.out',
  splitType = 'chars', // 'words' or 'chars'
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '0px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}) {
  const { processedSegments, highlightFlags } = useMemo(() => {
    const regex = /\{([^{}]+)\}/g;
    const highlightRanges = [];
    let plainText = "";
    let currentIdx = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      plainText += text.substring(currentIdx, match.index);
      const start = plainText.length;
      plainText += match[1];
      const end = plainText.length;
      highlightRanges.push({ start, end });
      currentIdx = regex.lastIndex;
    }
    plainText += text.substring(currentIdx);
    
    const rawSegments = splitType === 'words' ? plainText.split(' ') : plainText.split('');
    let charOffset = 0;
    const flags = [];
    
    const finalSegments = rawSegments.map((segment) => {
      const segStart = charOffset;
      const segEnd = charOffset + segment.length;
      charOffset += segment.length + (splitType === 'words' ? 1 : 0);
      
      const isHighlighted = highlightRanges.some(
        range => segStart >= range.start && segEnd <= range.end
      );
      flags.push(isHighlighted);
      return segment;
    });
    
    return {
      processedSegments: finalSegments,
      highlightFlags: flags
    };
  }, [text, splitType]);

  const elements = processedSegments;
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false); // Reset to allow re-trigger on enter viewport
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const Tag = tag || 'p';
  const resolvedEase = typeof ease === 'string' ? (easeMap[ease] || [0.16, 1, 0.3, 1]) : ease;

  return (
    <Tag
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
        overflow: 'hidden',
        ...style
      }}
    >
      {elements.map((segment, index) => {
        const isHighlighted = highlightFlags[index];
        return (
          <motion.span
            className={`${splitType === 'words' ? 'split-word' : 'split-char'} inline-block ${isHighlighted ? 'title-highlight' : ''}`}
            key={index}
            initial={from}
            animate={inView ? to : from}
            transition={{
              duration,
              ease: resolvedEase,
              delay: (index * delay) / 1000
            }}
            onAnimationComplete={
              index === elements.length - 1 ? onLetterAnimationComplete : undefined
            }
            style={{
              whiteSpace: 'normal',
              display: 'inline-block'
            }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {splitType === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </Tag>
  );
}

