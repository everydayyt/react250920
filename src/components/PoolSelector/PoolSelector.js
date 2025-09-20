import React from 'react';
import './PoolSelector.css';

const PoolSelector = ({ poolFilter, setPoolFilter }) => {
  const poolTypes = [
    { 
      key: 'standard', 
      label: '标准干员', 
      icon: '⭐', 
      description: '常驻干员',
      color: '#3498db'
    },
    { 
      key: 'summer', 
      label: '夏活限定', 
      icon: '🏖️', 
      description: '夏季活动限定',
      color: '#e74c3c'
    },
    { 
      key: 'anniversary', 
      label: '周年限定', 
      icon: '🎂', 
      description: '周年庆典限定',
      color: '#9b59b6'
    },
    { 
      key: 'reserve', 
      label: '中坚干员', 
      icon: '🛡️', 
      description: '中坚甄选',
      color: '#2ecc71'
    }
  ];

  const handlePoolToggle = (poolKey) => {
    const newFilter = { ...poolFilter, [poolKey]: !poolFilter[poolKey] };
    // 确保至少有一个池子被选中
    if (Object.values(newFilter).filter(Boolean).length === 0) {
      alert('请至少选择一种卡池类型');
      return;
    }
    setPoolFilter(newFilter);
  };

  return (
    <div className="pool-selector">
      <div className="selector-header">
        <h3>卡池范围选择</h3>
        <p className="hint-text">勾选要包含的干员类型</p>
      </div>
      
      <div className="pool-grid">
        {poolTypes.map(pool => (
          <div
            key={pool.key}
            className={`pool-card ${poolFilter[pool.key] ? 'active' : ''}`}
            onClick={() => handlePoolToggle(pool.key)}
            style={{ '--type-color': pool.color }}
          >
            <div className="card-header">
              <span className="type-icon">{pool.icon}</span>
              <span className="type-name">{pool.label}</span>
            </div>
            <div className="card-description">{pool.description}</div>
            <div className="card-footer">
              <div className={`check-mark ${poolFilter[pool.key] ? 'checked' : ''}`}>
                {poolFilter[pool.key] ? '✓' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="selection-summary">
        <div className="selected-count">
          已选择: {Object.values(poolFilter).filter(Boolean).length}/4
        </div>
        <div className="selected-tags">
          {poolTypes.filter(pool => poolFilter[pool.key]).map(pool => (
            <span 
              key={pool.key} 
              className="type-tag"
              style={{ backgroundColor: pool.color }}
            >
              {pool.icon} {pool.label}
            </span>
          ))}
          {Object.values(poolFilter).filter(Boolean).length === 0 && (
            <span className="empty-hint">未选择任何类型</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoolSelector;