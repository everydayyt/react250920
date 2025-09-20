import React from 'react';
import './ResultSection.css';
import OperatorCard from '../OperatorCard/OperatorCard';

function ResultSection({ results, isLoading, isThreeHundredDraw }) {
  if (isLoading) {
    return <div className="loading">正在加载干员数据...</div>;
  }

  // 300抽只显示六星，否则显示全部
  const displayResults = isThreeHundredDraw
    ? results.filter(op => op.rarity === 6)
    : results;

  return (
    <section className="result-section">
      <h2>招募结果</h2>
      <div className="result-display">
        {displayResults.length > 0 ? (
          displayResults.map((operator, index) => (
            <OperatorCard 
              key={`${operator.name}-${index}`} 
              operator={operator}
              showImage={true}
            />
          ))
        ) : (
          <div className="placeholder">招募结果将显示在这里</div>
        )}
      </div>
    </section>
  );
}

export default ResultSection;