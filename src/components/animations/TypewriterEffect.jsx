import { motion, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

// Staggered character reveal (Safe for wrapping across multiple lines)
export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}) => {
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: false });
  
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
        },
        {
          duration: 0.15,
          delay: (index) => index * 0.05, // Stagger reveal
          ease: "easeInOut",
        }
      );
    } else {
      animate(
        "span",
        {
          display: "none",
          opacity: 0,
        },
        {
          duration: 0,
        }
      );
    }
  }, [isInView, animate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} style={{ display: "inline" }}>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {word.text.map((char, index) => (
                <motion.span
                  initial={{
                    opacity: 0,
                  }}
                  key={`char-${index}`}
                  className={word.className}
                  style={{ display: "none", opacity: 0 }}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={className} style={{ display: "inline" }}>
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cursorClassName}
        style={{
          display: "inline-block",
          width: "4px",
          height: "0.95em",
          backgroundColor: "#38bdf8",
          verticalAlign: "middle",
          marginLeft: "2px"
        }}
      />
    </div>
  );
};

// Width-expansion typing reveal (Perfect for single-line headers)
export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}) => {
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const renderWords = () => {
    return (
      <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} style={{ display: "inline-block" }}>
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={word.className}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", flexWrap: "wrap" }} className={className}>
      <motion.div
        style={{
          overflow: "hidden",
          display: "flex",
        }}
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "100%",
        }}
        viewport={{ once: false }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <div
          style={{
            whiteSpace: "nowrap",
            display: "flex"
          }}
        >
          {renderWords()}
        </div>
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cursorClassName}
        style={{
          display: "inline-block",
          width: "4px",
          height: "1.1em",
          backgroundColor: "#38bdf8",
          marginLeft: "2px"
        }}
      />
    </div>
  );
};

