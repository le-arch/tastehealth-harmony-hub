import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import "./TasteHealthLoader.css";

const TasteHealthLoader: React.FC = () => {
  const text = "TASTEHEALTH";

  useEffect(() => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

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
