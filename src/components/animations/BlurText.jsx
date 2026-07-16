import { motion } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = t => t,
  onAnimationComplete,
  stepDuration = 0.35
}) => {
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
    
    const rawSegments = animateBy === 'words' ? plainText.split(' ') : plainText.split('');
    let charOffset = 0;
    const flags = [];
    
    const finalSegments = rawSegments.map((segment) => {
      const segStart = charOffset;
      const segEnd = charOffset + segment.length;
      charOffset += segment.length + (animateBy === 'words' ? 1 : 0);
      
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
  }, [text, animateBy]);

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
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000
        };
        spanTransition.ease = easing;

        const isHighlighted = highlightFlags[index];
        return (
          <motion.span
            className={`inline-block will-change-[transform,filter,opacity] ${isHighlighted ? 'title-highlight' : ''}`}
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;

