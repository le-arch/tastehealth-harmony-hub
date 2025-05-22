
import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import "./TasteHealthLoader.css";
import { useScreenSize } from "@/utils/mobile";

interface TasteHealthLoaderProps {
  message?: string;
}

const TasteHealthLoader: React.FC<TasteHealthLoaderProps> = ({ message = "TASTEHEALTH" }) => {
  const text = message;
  const { isMobile, isTablet } = useScreenSize();

  useEffect(() => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;
    const density = isMobile ? 3 : isTablet ? 4 : 5;

    (function frame() {
      confetti({
        particleCount: density,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: density,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [isMobile, isTablet]);

  return (
    <div className="scene">
      <div className="animated-text">
        {text.split("").map((char, index) => (
          <span key={index} className={`letter color-${index % 6}`}>{char}</span>
        ))}
      </div>
    </div>
  );
};

export default TasteHealthLoader;
