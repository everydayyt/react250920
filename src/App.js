import './App.css';
import { useState } from 'react';
import Header from './components/Header/Header';
import GachaSection from './components/GachaSection/GachaSection';
import ResultSection from './components/ResultSection/ResultSection';
import HistorySection from './components/HistorySection/HistorySection';
import GachaAnimation from './components/GachaAnimation/GachaAnimation';
import { 
  standardOperators,
  summerLimitedOperators,
  anniversaryLimitedOperators,
  reserveOperators,
  newyearLimitedOperators
} from './data/operators';

// 合并所有干员数据并添加类型标识
const allOperators = {
  '6-star': [
    ...standardOperators['6-star'].map(op => ({ ...op, type: 'standard' })),
    ...summerLimitedOperators['6-star'].map(op => ({ ...op, type: 'summer' })),
    ...anniversaryLimitedOperators['6-star'].map(op => ({ ...op, type: 'anniversary' })),
    ...reserveOperators['6-star'].map(op => ({ ...op, type: 'reserve' })),
    ...newyearLimitedOperators['6-star'].map(op => ({ ...op, type: 'newyear' }))
  ],
  '5-star': [
    ...standardOperators['5-star'].map(op => ({ ...op, type: 'standard' })),
    ...summerLimitedOperators['5-star'].map(op => ({ ...op, type: 'summer' })),
    ...anniversaryLimitedOperators['5-star'].map(op => ({ ...op, type: 'anniversary' })),
    ...reserveOperators['5-star'].map(op => ({ ...op, type: 'reserve' })),
    ...newyearLimitedOperators['5-star'].map(op => ({ ...op, type: 'newyear' }))
  ],
  '4-star': [
    ...standardOperators['4-star'].map(op => ({ ...op, type: 'standard' })),
    ...summerLimitedOperators['4-star'].map(op => ({ ...op, type: 'summer' })),
    ...anniversaryLimitedOperators['4-star'].map(op => ({ ...op, type: 'anniversary' })),
    ...reserveOperators['4-star'].map(op => ({ ...op, type: 'reserve' })),
    ...newyearLimitedOperators['4-star'].map(op => ({ ...op, type: 'newyear' }))
  ],
  '3-star': [
    ...standardOperators['3-star'].map(op => ({ ...op, type: 'standard' })),
    ...summerLimitedOperators['3-star'].map(op => ({ ...op, type: 'summer' })),
    ...anniversaryLimitedOperators['3-star'].map(op => ({ ...op, type: 'anniversary' })),
    ...reserveOperators['3-star'].map(op => ({ ...op, type: 'reserve' })),
    ...newyearLimitedOperators['3-star'].map(op => ({ ...op, type: 'newyear' }))
  ]
};

function App() {
  // 状态管理
  const [pityCounter, setPityCounter] = useState(0);
  const [totalDraws, setTotalDraws] = useState(0);
  const [sixStarCount, setSixStarCount] = useState(0);
  const [fiveStarCount, setFiveStarCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [poolDraws, setPoolDraws] = useState(0);

  // 动画相关状态
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationResults, setAnimationResults] = useState([]);

  // 卡池范围选择
  const [poolFilter, setPoolFilter] = useState({
    standard: true,
    summer: false,
    anniversary: false,
    reserve: false,
    newyear: false
  });

  // UP干员选择
  const [selectedSixStarUp, setSelectedSixStarUp] = useState([]);
  const [selectedFiveStarUp, setSelectedFiveStarUp] = useState([]);
  const [selectedRateUpOperators, setSelectedRateUpOperators] = useState([]);

  // 根据过滤条件获取当前可用干员
  const getFilteredOperators = () => {
    const filtered = {
      '6-star': [],
      '5-star': [],
      '4-star': [],
      '3-star': []
    };

    Object.keys(allOperators).forEach(rarity => {
      filtered[rarity] = allOperators[rarity].filter(op => {
        return poolFilter[op.type];
      });
    });

    return filtered;
  };

  // 获取随机干员（考虑UP和概率提升）
  const getRandomOperator = (rarity) => {
    const key = `${rarity}-star`;
    const filteredPool = getFilteredOperators()[key] || [];

    // 处理六星UP逻辑（无保底，只按概率分配）
    if (rarity === 6 && selectedSixStarUp.length > 0) {
      const rand = Math.random();
      if (selectedSixStarUp.length === 1) {
        if (rand < 0.5) {
          return { ...selectedSixStarUp[0], isUp: true };
        }
      } else if (selectedSixStarUp.length === 2) {
        if (rand < 0.35) {
          return { ...selectedSixStarUp[0], isUp: true };
        } else if (rand < 0.7) {
          return { ...selectedSixStarUp[1], isUp: true };
        }
      } else if (selectedSixStarUp.length >= 3) {
        return { ...selectedSixStarUp[Math.floor(Math.random() * selectedSixStarUp.length)], isUp: true };
      }
    }

    // 处理五星UP逻辑
    if (rarity === 5 && selectedFiveStarUp.length > 0) {
      const rand = Math.random();
      if (rand < 0.5) {
        return { 
          ...selectedFiveStarUp[Math.floor(Math.random() * selectedFiveStarUp.length)],
          isUp: true
        };
      }
    }

    // 处理概率提升干员
    if (selectedRateUpOperators.length > 0) {
      const rateUpPool = filteredPool.filter(op => 
        selectedRateUpOperators.some(upOp => upOp.name === op.name)
      );

      const normalPool = filteredPool.filter(op => 
        !selectedRateUpOperators.some(upOp => upOp.name === op.name)
      );

      // 概率提升5倍
      const rateUpWeight = rateUpPool.length * 5;
      const normalWeight = normalPool.length;
      const totalWeight = rateUpWeight + normalWeight;

      const rand = Math.random() * totalWeight;
      if (rand < rateUpWeight) {
        return { 
          ...rateUpPool[Math.floor(Math.random() * rateUpPool.length)],
          isRateUp: true
        };
      } else {
        return { 
          ...normalPool[Math.floor(Math.random() * normalPool.length)],
          isRateUp: false
        };
      }
    }

    // 默认随机选择
    if (filteredPool.length === 0) {
      console.warn(`在${Object.keys(poolFilter).filter(k => poolFilter[k]).join('/')}卡池中没有找到${rarity}星干员数据`);
      return { name: '未知干员', class: '未知', rarity, type: 'standard' };
    }

    return { 
      ...filteredPool[Math.floor(Math.random() * filteredPool.length)],
      isUp: false,
      isRateUp: false
    };
  };

  // 计算六星概率
  const calculateSixStarRate = (currentPity) => {
    if (currentPity <= 50) return 0.02;
    return Math.min(0.02 + (currentPity - 50) * 0.02, 1.0);
  };

  // 单次抽卡
  const performSingleDraw = (currentPity) => {
    const sixStarRate = calculateSixStarRate(currentPity);
    const rand = Math.random();

    if (rand < sixStarRate) {
      return { operator: getRandomOperator(6), isSixStar: true };
    } else if (rand < sixStarRate + 0.08) {
      return { operator: getRandomOperator(5), isSixStar: false };
    } else if (rand < sixStarRate + 0.08 + 0.5) {
      return { operator: getRandomOperator(4), isSixStar: false };
    } else {
      return { operator: getRandomOperator(3), isSixStar: false };
    }
  };

  // 抽卡主函数
  const drawGacha = (isTenDraw = false) => {
    if (isLoading) {
      alert('干员数据正在加载，请稍候...');
      return;
    }

    const drawCount = isTenDraw ? 10 : 1;
    const newResults = [];
    let currentPity = pityCounter;
    let newSixStarCount = sixStarCount;
    let newFiveStarCount = fiveStarCount;
    let currentPoolDraws = poolDraws;

    for (let i = 0; i < drawCount; i++) {
      // 前十抽保底机制
      if (currentPoolDraws < 10 && isTenDraw && 
          currentPoolDraws + i + 1 >= 10 && 
          !newResults.some(r => r.rarity >= 5)) {
        const guaranteedFiveStar = getRandomOperator(5);
        newResults.push(guaranteedFiveStar);
        newFiveStarCount++;
        currentPity++;
        currentPoolDraws++;
        continue;
      }

      const drawResult = performSingleDraw(currentPity);
      // 记录第几抽获得
      if (drawResult.operator.rarity === 6) {
        newResults.push({ ...drawResult.operator, drawIndex: totalDraws + i + 1 });
      } else {
        newResults.push(drawResult.operator);
      }

      // 更新计数
      if (drawResult.isSixStar) {
        currentPity = 0;
        newSixStarCount++;
      } else {
        currentPity++;
      }

      if (drawResult.operator.rarity === 5) {
        newFiveStarCount++;
      }

      currentPoolDraws++;
    }

    // 更新状态
    setTotalDraws(prev => prev + drawCount);
    setPityCounter(currentPity);
    setSixStarCount(newSixStarCount);
    setFiveStarCount(newFiveStarCount);
    setPoolDraws(currentPoolDraws);

    // 显示动画
    setAnimationResults(newResults);
    setShowAnimation(true);
  };

  // 300连抽（只统计六星，结果只显示六星，且不播放动画）
  const drawThreeHundred = () => {
    if (isLoading) {
      alert('干员数据正在加载，请稍候...');
      return;
    }
    const drawCount = 300;
    let currentPity = pityCounter;
    let newSixStarCount = sixStarCount;
    let newFiveStarCount = fiveStarCount;
    let currentPoolDraws = poolDraws;

    const sixStarResults = [];
    let totalDrawIndex = totalDraws;

    for (let i = 0; i < drawCount; i++) {
      const drawResult = performSingleDraw(currentPity);

      if (drawResult.isSixStar) {
        currentPity = 0;
        newSixStarCount++;
        sixStarResults.push({ ...drawResult.operator, drawIndex: totalDrawIndex + i + 1 });
      } else {
        currentPity++;
      }
      if (drawResult.operator.rarity === 5) {
        newFiveStarCount++;
      }
      currentPoolDraws++;
    }

    setTotalDraws(prev => prev + drawCount);
    setPityCounter(currentPity);
    setSixStarCount(newSixStarCount);
    setFiveStarCount(newFiveStarCount);
    setPoolDraws(currentPoolDraws);

    // 只显示六星结果
    setResults(sixStarResults);
    updateHistory(sixStarResults);
    setShowAnimation(false);
    setAnimationResults([]);
  };

  // 动画结束回调
  const handleAnimationEnd = () => {
    setResults(animationResults);
    updateHistory(animationResults);
    setShowAnimation(false);
  };

  // 更新历史记录
  const updateHistory = (newResults) => {
    const newHistory = newResults.map(op => ({
      name: op.name,
      class: op.class,
      rarity: op.rarity,
      type: op.type,
      isUp: op.isUp || false,
      isRateUp: op.isRateUp || false,
      time: new Date().toLocaleTimeString(),
      drawIndex: op.drawIndex
    }));

    setHistory(prev => [
      ...newHistory,
      ...prev
    ]);
  };

  // 清空历史
  const clearHistory = () => {
    setHistory([]);
    setTotalDraws(0);
    setSixStarCount(0);
    setFiveStarCount(0);
    setPityCounter(0);
    setResults([]);
    setPoolDraws(0);
    setShowAnimation(false);
    setAnimationResults([]);
  };

  // 计算六星概率
  const sixStarRate = totalDraws > 0 
    ? ((sixStarCount / totalDraws) * 100).toFixed(2) + '%' 
    : '0%';

  return (
    <div className="container">
      <Header />
      
      <div className="main-content">
        <GachaSection 
          pityCounter={pityCounter}
          onSingleDraw={() => drawGacha(false)}
          onTenDraw={() => drawGacha(true)}
          onThreeHundredDraw={drawThreeHundred}
          currencyAmount="∞"
          ticketAmount="∞"
          selectedPool={'custom'}
          poolDraws={poolDraws}
          poolFilter={poolFilter}
          setPoolFilter={setPoolFilter}
          allOperators={allOperators}
          selectedSixStarUp={selectedSixStarUp}
          setSelectedSixStarUp={setSelectedSixStarUp}
          selectedFiveStarUp={selectedFiveStarUp}
          setSelectedFiveStarUp={setSelectedFiveStarUp}
          selectedRateUpOperators={selectedRateUpOperators}
          setSelectedRateUpOperators={setSelectedRateUpOperators}
        />
        
        <ResultSection 
          results={results}
          isLoading={isLoading}
        />
      </div>
      
      <HistorySection 
        history={history}
        totalDraws={totalDraws}
        sixStarCount={sixStarCount}
        fiveStarCount={fiveStarCount}
        sixStarRate={sixStarRate}
        onClearHistory={clearHistory}
      />

      {/* 视频动画组件 */}
      <GachaAnimation 
        isOpen={showAnimation}
        onClose={handleAnimationEnd}
        results={animationResults}
      />
    </div>
  );
}

export default App;