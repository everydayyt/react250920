import React, { useState } from 'react';
import './UpOperatorSelector.css';
import { 
  standardOperators,
  summerLimitedOperators,
  anniversaryLimitedOperators,
  reserveOperators,
  newyearLimitedOperators // 新增
} from '../../data/operators';

const UpOperatorSelector = ({ 
  selectedSixStarUp,
  setSelectedSixStarUp,
  selectedFiveStarUp,
  setSelectedFiveStarUp,
  selectedRateUpOperators,
  setSelectedRateUpOperators,
  poolFilter
}) => {
  const [activeTab, setActiveTab] = useState('6-star');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRarities, setExpandedRarities] = useState({
    '6-star': true,
    '5-star': false
  });

  // 合并当前选中的卡池数据
  const getMergedOperators = () => {
    const merged = { '6-star': [], '5-star': [] };
    
    if (poolFilter.standard) {
      mergeOperators(merged, standardOperators);
    }
    if (poolFilter.summer) {
      mergeOperators(merged, summerLimitedOperators);
    }
    if (poolFilter.anniversary) {
      mergeOperators(merged, anniversaryLimitedOperators);
    }
    if (poolFilter.reserve) {
      mergeOperators(merged, reserveOperators);
    }
    if (poolFilter.newyear) { // 新年限定
      mergeOperators(merged, newyearLimitedOperators);
    }
    
    return merged;
  };

  const mergeOperators = (target, source) => {
    ['6-star', '5-star'].forEach(rarity => {
      if (source[rarity]) {
        target[rarity].push(...source[rarity]);
      }
    });
  };

  // 获取当前可选的干员列表（按稀有度分组）
  const getAvailableOperators = () => {
    const merged = getMergedOperators();
    const result = {
      '6-star': [],
      '5-star': []
    };

    // 过滤出符合条件的干员
    Object.keys(merged).forEach(rarity => {
      result[rarity] = merged[rarity].filter(op => 
        op.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    return result;
  };

  const toggleOperatorSelection = (operator, list, setList, maxCount = Infinity) => {
    if (list.some(op => op.name === operator.name)) {
      setList(list.filter(op => op.name !== operator.name));
    } else if (list.length < maxCount) {
      setList([...list, operator]);
    }
  };

  const toggleRarityExpansion = (rarity) => {
    setExpandedRarities(prev => ({
      ...prev,
      [rarity]: !prev[rarity]
    }));
  };

  // 获取干员类型标签
  const getOperatorType = (operator, rarity) => {
    const types = [];
    if (poolFilter.standard && standardOperators[rarity].some(op => op.name === operator.name)) {
      types.push('标准');
    }
    if (poolFilter.summer && summerLimitedOperators[rarity].some(op => op.name === operator.name)) {
      types.push('夏活限定');
    }
    if (poolFilter.anniversary && anniversaryLimitedOperators[rarity].some(op => op.name === operator.name)) {
      types.push('周年限定');
    }
    if (poolFilter.reserve && reserveOperators[rarity].some(op => op.name === operator.name)) {
      types.push('中坚');
    }
    if (poolFilter.newyear && newyearLimitedOperators[rarity].some(op => op.name === operator.name)) {
      types.push('新年限定');
    }
    return types.join('/');
  };

  const availableOperators = getAvailableOperators();

  return (
    <div className="up-operator-selector">
      <div className="selector-header">
        <h3>UP干员设置</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索干员..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === '6-star' ? 'active' : ''}`}
          onClick={() => setActiveTab('6-star')}
        >
          六星UP ({selectedSixStarUp.length}/4)
        </button>
        <button 
          className={`tab-button ${activeTab === '5-star' ? 'active' : ''}`}
          onClick={() => setActiveTab('5-star')}
        >
          五星UP ({selectedFiveStarUp.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'rate-up' ? 'active' : ''}`}
          onClick={() => setActiveTab('rate-up')}
        >
          概率提升 ({selectedRateUpOperators.length}/3)
        </button>
      </div>
      
      <div className="operator-list-container">
        {Object.entries(availableOperators).map(([rarity, operators]) => (
          <div key={rarity} className="rarity-group">
            <div 
              className="rarity-header"
              onClick={() => toggleRarityExpansion(rarity)}
            >
              <span className="rarity-title">
                {rarity === '6-star' ? '★★★★★★' : '★★★★★'} 
                ({operators.length})
              </span>
              <span className="toggle-icon">
                {expandedRarities[rarity] ? '▼' : '▶'}
              </span>
            </div>
            
            {expandedRarities[rarity] && (
              <div className="operator-list">
                {operators.map(operator => (
                  <div
                    key={operator.name}
                    className={`operator-item ${
                      (activeTab === '6-star' && selectedSixStarUp.some(op => op.name === operator.name)) ||
                      (activeTab === '5-star' && selectedFiveStarUp.some(op => op.name === operator.name)) ||
                      (activeTab === 'rate-up' && selectedRateUpOperators.some(op => op.name === operator.name))
                        ? 'selected' : ''
                    }`}
                    onClick={() => {
                      if (activeTab === '6-star') {
                        toggleOperatorSelection(operator, selectedSixStarUp, setSelectedSixStarUp, 4);
                      } else if (activeTab === '5-star') {
                        toggleOperatorSelection(operator, selectedFiveStarUp, setSelectedFiveStarUp);
                      } else if (activeTab === 'rate-up') {
                        toggleOperatorSelection(operator, selectedRateUpOperators, setSelectedRateUpOperators, 3);
                      }
                    }}
                  >
                    <span className="operator-name">{operator.name}</span>
                    <span className="operator-class">{operator.class}</span>
                    <span className="operator-type">
                      {getOperatorType(operator, rarity)}
                    </span>
                    <span className="selection-status">
                      {(activeTab === '6-star' && selectedSixStarUp.some(op => op.name === operator.name)) && '✔'}
                      {(activeTab === '5-star' && selectedFiveStarUp.some(op => op.name === operator.name)) && '✔'}
                      {(activeTab === 'rate-up' && selectedRateUpOperators.some(op => op.name === operator.name)) && '↑'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="selection-summary">
        {activeTab === '6-star' && selectedSixStarUp.length > 0 && (
          <div className="selected-list">
            <h4>当前六星UP:</h4>
            <div className="selected-operators">
              {selectedSixStarUp.map(op => (
                <span key={op.name} className="selected-operator">
                  {op.name}
                  <button 
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSixStarUp(prev => prev.filter(o => o.name !== op.name));
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === '5-star' && selectedFiveStarUp.length > 0 && (
          <div className="selected-list">
            <h4>当前五星UP:</h4>
            <div className="selected-operators">
              {selectedFiveStarUp.map(op => (
                <span key={op.name} className="selected-operator">
                  {op.name}
                  <button 
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFiveStarUp(prev => prev.filter(o => o.name !== op.name));
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'rate-up' && selectedRateUpOperators.length > 0 && (
          <div className="selected-list">
            <h4>当前概率提升:</h4>
            <div className="selected-operators">
              {selectedRateUpOperators.map(op => (
                <span key={op.name} className="selected-operator">
                  {op.name}
                  <button 
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRateUpOperators(prev => prev.filter(o => o.name !== op.name));
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpOperatorSelector;