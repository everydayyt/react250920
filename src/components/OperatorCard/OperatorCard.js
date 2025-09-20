import './OperatorCard.css';
import React, { useState, useEffect } from 'react';


function OperatorCard({ operator }) {
  const [isRainbow, setIsRainbow] = useState(false);

  useEffect(() => {
    if (operator.rarity === 6) {
      setIsRainbow(true);
      const timer = setTimeout(() => setIsRainbow(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [operator.rarity]);

  return (
    <div className={`operator-card ${isRainbow ? 'rainbow' : ''}`}>
      <div className={`operator-rarity rarity-${operator.rarity}`} />
      <div className="operator-image">
        <div>干员立绘</div>
      </div>
      <div className="operator-info">
        <div className="operator-name">{operator.name}</div>
        <div className="operator-class">{operator.class}</div>
      </div>
    </div>
  );
}

export default React.memo(OperatorCard);