import React, { useState, useRef, useEffect } from 'react';
import './GachaAnimation.css';

function GachaAnimation({ isOpen, onClose, results }) {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // 默认静音以避免自动播放限制
  const [showControls, setShowControls] = useState(false);

  // 加载视频
  useEffect(() => {
    if (isOpen && results.length > 0) {
      const highestRarity = Math.max(...results.map(r => r.rarity));
      setVideoSrc(getVideoByRarity(highestRarity));
      setIsVideoReady(false);
    }
  }, [isOpen, results]);

  // 视频元数据加载完成
  const handleLoadedMetadata = () => {
    setIsVideoReady(true);
    // 尝试播放（移动端可能仍需要用户交互）
    videoRef.current?.play().catch(e => {
      console.log('自动播放失败，需要用户交互:', e);
    });
  };

  // 视频播放结束
  const handleVideoEnd = () => {
    onClose();
  };

  // 视频错误处理
  const handleError = (e) => {
    console.error('视频加载错误:', e);
    setTimeout(() => onClose(), 3000);
  };

  // 切换静音状态
  const toggleMute = (e) => {
    e.stopPropagation(); // 阻止事件冒泡到关闭事件
    setIsMuted(!isMuted);
  };

  // 获取视频路径
  const getVideoByRarity = (rarity) => {
    switch(rarity) {
      case 6: return '/videos/6star.mp4';
      case 5: return '/videos/5star.mp4';
      case 4: return '/videos/4star.mp4';
      case 3: return '/videos/3star.mp4';
      default: return '/videos/default.mp4';
    }
  };

  // 跳过视频（点击任意位置关闭）
  const handleSkip = () => {
    videoRef.current?.pause();
    onClose();
  };

  // 显示/隐藏控制按钮
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideControlsTimer);
    hideControlsTimer = setTimeout(() => setShowControls(false), 2000);
  };

  let hideControlsTimer;

  if (!isOpen) return null;

  return (
    <div 
      className="gacha-animation-overlay" 
      onClick={handleSkip}
      onMouseMove={handleMouseMove}
    >
      {videoSrc && (
        <>
          <video
            ref={videoRef}
            src={videoSrc}
            className="gacha-video"
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnd}
            onError={handleError}
            muted={isMuted}
            playsInline
            autoPlay
          />
          
          {/* 声音控制按钮 */}
          <div 
            className={`sound-control ${showControls ? 'visible' : ''}`}
            onClick={toggleMute}
          >
            {isMuted ? (
              <span className="sound-icon">🔇</span>
            ) : (
              <span className="sound-icon">🔊</span>
            )}
          </div>

          {/* 加载提示 */}
          {!isVideoReady && (
            <div className="loading-indicator">
              🎬 视频加载中...
            </div>
          )}

          {/* 跳过提示 */}
          {isVideoReady && (
            <div className="skip-indicator">
              点击任意位置跳过
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GachaAnimation;