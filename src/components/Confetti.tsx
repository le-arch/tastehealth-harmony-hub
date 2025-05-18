import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ 
  active, 
  duration = 3000 
}) => {
  const [pieces, setPieces] = useState<JSX.Element[]>([]);
  const [isActive, setIsActive] = useState(active);
  
  useEffect(() => {
    if (active) {
      setIsActive(true);
      const newPieces = [];
      const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6B5CA5', '#72B01D'];
      
      for (let i = 0; i < 100; i++) {
        const style = {
          left: `${Math.random() * 100}%`,
          top: '-5%',
          width: `${Math.random() * 8 + 4}px`,
          height: `${Math.random() * 8 + 4}px`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          transform: `rotate(${Math.random() * 360}deg)`,
          animationDuration: `${Math.random() * 2 + 2}s`,
          animationDelay: `${Math.random()}s`
        };
        
        newPieces.push(
          <div 
            key={i}
            className="absolute animate-confetti"
            style={style}
          />
        );
      }
      
      setPieces(newPieces);
      
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setIsActive(false);
    }
  }, [active, duration]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces}
    </div>
  );
};

export default Confetti;
