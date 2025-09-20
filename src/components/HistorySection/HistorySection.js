// src/components/HistorySection/HistorySection.js
import React from 'react';
import './HistorySection.css';
import SixStarSummary from '../SixStarSummary/SixStarSummary';
function HistorySection({ 
  history, 
  totalDraws, 
  sixStarCount, 
  fiveStarCount, 
  onClearHistory 
}) {
  const sixStarRate = totalDraws > 0 
    ? ((sixStarCount / totalDraws) * 100).toFixed(2) + '%' 
    : '0%';

  return (
    <section className="history-section">
      <div className="history-header">
        <h2>招募历史</h2>
        <button 
          className="btn btn-single" 
          onClick={onClearHistory}
        >
          清空记录
        </button>
      </div>
      
      <div className="stats">
        <div className="stat-item">
          <div className="stat-value">{totalDraws}</div>
          <div className="stat-label">总招募次数</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{sixStarCount}</div>
          <div className="stat-label">六星干员</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{fiveStarCount}</div>
          <div className="stat-label">五星干员</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{sixStarRate}</div>
          <div className="stat-label">六星出率</div>
        </div>
      </div>
      
      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-item">
            <span>暂无招募记录</span>
          </div>
        ) : (
          history.map((item, index) => (
            <div className="history-item" key={`${item.name}-${index}`}>
              <span>
                {item.name} ({item.class})
                {item.rarity === 6 && item.drawIndex ? `（第${item.drawIndex}抽获得）` : ''}
              </span>
              <span>{'★'.repeat(item.rarity)} {item.time}</span>
            </div>
          ))
        )}
      </div>
      <SixStarSummary history={history} />
    </section>
  );
}

export default React.memo(HistorySection);