import React from 'react';

function SixStarSummary({ history }) {
  // 统计六星干员出现次数及抽出顺序
  const sixStarInfo = {};
  history.forEach((item, idx) => {
    if (item.rarity === 6) {
      if (!sixStarInfo[item.name]) {
        sixStarInfo[item.name] = { count: 0, positions: [] };
      }
      sixStarInfo[item.name].count += 1;
      // 由于历史是倒序，实际抽数为 history.length - idx
      sixStarInfo[item.name].positions.push(history.length - idx);
    }
  });

  const sixStarList = Object.entries(sixStarInfo)
    .sort((a, b) => b[1].count - a[1].count); // 按次数降序

  if (sixStarList.length === 0) {
    return (
      <div className="sixstar-summary">
        <h3>六星统计</h3>
        <div>暂无六星记录</div>
      </div>
    );
  }

  return (
    <div className="sixstar-summary">
      <h3>六星统计</h3>
      <ul>
        {sixStarList.map(([name, info]) => (
          <li key={name}>
            {name}：{info.count} 次，
            抽出顺序：{info.positions.sort((a, b) => a - b).join('、')} 抽
          </li>
        ))}
      </ul>
    </div>
  );
}

export default React.memo(SixStarSummary);