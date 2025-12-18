import React, { useEffect, useState } from 'react';

const NewYearDecoration = () => {
  const [snowflakes, setSnowflakes] = useState([]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Generate snowflakes
    const flakes = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 5 + Math.random() * 10,
        animationDelay: Math.random() * 5,
        size: 10 + Math.random() * 20,
        opacity: 0.4 + Math.random() * 0.6,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <>
      {/* Snowflakes */}
      <div className="snowfall-container">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              animationDuration: `${flake.animationDuration}s`,
              animationDelay: `${flake.animationDelay}s`,
              fontSize: `${flake.size}px`,
              opacity: flake.opacity,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Christmas Tree in corner */}
      <div className="christmas-tree">
        <div className="tree-container">
          <span className="tree-emoji">🎄</span>
          <div className="tree-glow"></div>
        </div>
      </div>

      {/* Festive Banner */}
      {showBanner && (
        <div className="new-year-banner">
          <div className="banner-content">
            <div className="banner-stars">✨</div>
            <div className="banner-text">
              <span className="banner-emoji">🎅</span>
              <span className="happy-new-year">С Новым 2025 Годом!</span>
              <span className="banner-emoji">🎁</span>
            </div>
            <div className="banner-subtext">Счастья, здоровья и успехов!</div>
            <div className="banner-stars">✨</div>
            <button
              className="banner-close"
              onClick={() => setShowBanner(false)}
              title="Закрыть"
            >
              ×
            </button>
          </div>
          <div className="garland">
            {['🔴', '🟡', '🟢', '🔵', '🟣', '🔴', '🟡', '🟢', '🔵', '🟣'].map((light, i) => (
              <span
                key={i}
                className="garland-light"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {light}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Corner decorations */}
      <div className="corner-decoration top-right">🎊</div>
      <div className="corner-decoration bottom-left">🎉</div>
    </>
  );
};

export default NewYearDecoration;
