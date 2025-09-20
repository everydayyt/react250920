import React from 'react';
import './GachaSection.css';
import PoolSelector from '../PoolSelector/PoolSelector';
import UpOperatorSelector from '../UpOperatorSelector/UpOperatorSelector';

function GachaSection({ 
  pityCounter, 
  onSingleDraw, 
  onTenDraw, 
  onThreeHundredDraw,
  currencyAmount = "∞", 
  ticketAmount = "∞",
  poolDraws,
  poolFilter,
  setPoolFilter,
  allOperators,
  selectedSixStarUp,
  setSelectedSixStarUp,
  selectedFiveStarUp,
  setSelectedFiveStarUp,
  selectedRateUpOperators,
  setSelectedRateUpOperators,
  upPityCounter
}) {
  // 计算动态概率（用于UI显示）
  const calculateDynamicRate = () => {
    if (pityCounter <= 50) return "2%";
    const rate = 2 + (pityCounter - 50) * 2;
    return `${Math.min(rate, 100)}%`;
  };

  // 根据保底计数判断是否激活保底状态
  const isPityActive = pityCounter >= 50;

  return (
    <section className="gacha-section">
      <div className="gacha-header">
        <h2>招募控制中心</h2>
        <div className="pool-tabs">
          <button 
            className={`pool-tab ${poolFilter.standard ? 'active' : ''}`}
            onClick={() => setPoolFilter(prev => ({ ...prev, standard: !prev.standard }))}
          >
            标准干员
          </button>
          <button 
            className={`pool-tab ${poolFilter.summer ? 'active' : ''}`}
            onClick={() => setPoolFilter(prev => ({ ...prev, summer: !prev.summer }))}
          >
            夏活限定
          </button>
          <button 
            className={`pool-tab ${poolFilter.anniversary ? 'active' : ''}`}
            onClick={() => setPoolFilter(prev => ({ ...prev, anniversary: !prev.anniversary }))}
          >
            周年限定
          </button>
          <button 
            className={`pool-tab ${poolFilter.reserve ? 'active' : ''}`}
            onClick={() => setPoolFilter(prev => ({ ...prev, reserve: !prev.reserve }))}
          >
            中坚干员
          </button>
          <button 
            className={`pool-tab ${poolFilter.newyear ? 'active' : ''}`}
            onClick={() => setPoolFilter(prev => ({ ...prev, newyear: !prev.newyear }))}
          >
            新年限定
          </button>
        </div>
      </div>
      
      <div className="gacha-controls">
        <div className="resource-display">
          <div className="currency">
            <span className="currency-icon">🟡</span>
            <span className="currency-value">{currencyAmount}</span>
            <span className="currency-name">合成玉</span>
          </div>
          <div className="currency">
            <span className="currency-icon">🎟️</span>
            <span className="currency-value">{ticketAmount}</span>
            <span className="currency-name">寻访凭证</span>
          </div>
        </div>
        
        <div className="buttons">
          <button 
            className="btn btn-single"
            onClick={onSingleDraw}
            aria-label="单次招募"
          >
            <span className="btn-icon">✨</span>
            <span className="btn-text">单次招募</span>
            <span className="btn-cost">消耗: 600</span>
          </button>
          <button 
            className="btn btn-ten"
            onClick={onTenDraw}
            aria-label="十连招募"
          >
            <span className="btn-icon">💫</span>
            <span className="btn-text">十连招募</span>
            <span className="btn-cost">消耗: 6000</span>
          </button>
          <button
            className="btn btn-multi"
            onClick={() => onThreeHundredDraw && onThreeHundredDraw()}
          >
            一次性抽300抽（仅统计六星）
          </button>
        </div>
      </div>
      
      <div className="probability-display">
        <h3>当前概率 - 自定义池</h3>
        <div className="probability-bars">
          <div className="probability-bar">
            <span className="rarity">★★★★★★</span>
            <span className="rate">{calculateDynamicRate()}</span>
            <div 
              className="bar-fill" 
              style={{ width: `${pityCounter > 50 ? Math.min(100, 2 + (pityCounter - 50) * 2) : 2}%` }}
            />
          </div>
          <div className="probability-bar">
            <span className="rarity">★★★★★</span>
            <span className="rate">8%</span>
            <div className="bar-fill" style={{ width: "8%" }} />
          </div>
          <div className="probability-bar">
            <span className="rarity">★★★★</span>
            <span className="rate">50%</span>
            <div className="bar-fill" style={{ width: "50%" }} />
          </div>
        </div>
      </div>
      
      <div className={`pity-counter ${isPityActive ? 'active' : ''}`}>
        <div className="pity-progress">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(100, pityCounter)}%` }}
          />
          <span className="pity-text">
            {pityCounter >= 50 ? "🎯 概率提升" : `再${50 - pityCounter}次6★概率提升`}
          </span>
        </div>
        <div className="pity-details">
          <span>当前计数: {pityCounter}</span>
          {selectedSixStarUp.length > 0 && (
            <span>上次出UP: {upPityCounter}</span>
          )}
        </div>
      </div>
      
      <UpOperatorSelector
        allOperators={allOperators}
        selectedSixStarUp={selectedSixStarUp}
        setSelectedSixStarUp={setSelectedSixStarUp}
        selectedFiveStarUp={selectedFiveStarUp}
        setSelectedFiveStarUp={setSelectedFiveStarUp}
        selectedRateUpOperators={selectedRateUpOperators}
        setSelectedRateUpOperators={setSelectedRateUpOperators}
        poolFilter={poolFilter}
      />
    </section>
  );
}

export default GachaSection;