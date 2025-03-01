import React, { useEffect, useState } from "react";
import { Typography } from "antd";

interface TypingEffectProps {
  texts: string[];
  typingSpeed?: number;
  erasingSpeed?: number;
  delayBeforeErase?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  texts,
  typingSpeed = 50,
  erasingSpeed = 30,
  delayBeforeErase = 1000,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const fullText = texts[textIndex];

    if (!isErasing && charIndex < fullText.length) {
      const typingTimeout = setTimeout(() => {
        setCurrentText(fullText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(typingTimeout);
    }

    if (!isErasing && charIndex === fullText.length) {
      const eraseTimeout = setTimeout(() => setIsErasing(true), delayBeforeErase);
      return () => clearTimeout(eraseTimeout);
    }

    if (isErasing && charIndex > 0) {
      const erasingTimeout = setTimeout(() => {
        setCurrentText(fullText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, erasingSpeed);
      return () => clearTimeout(erasingTimeout);
    }

    if (isErasing && charIndex === 0) {
      setIsErasing(false);
      setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }
  }, [charIndex, isErasing, textIndex]);

  return (
    <Typography.Text>
      {currentText}
      <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
    </Typography.Text>
  );
};

export default TypingEffect;
