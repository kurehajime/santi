import React from 'react';

// フェーズ1: SVGでHello, worldを描画する最小実装
export const GameElement: React.FC = () => {
  const width = 480;
  const height = Math.round(width * Math.SQRT2);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Hello, world"
      style={{ border: '1px solid #e5e7eb', borderRadius: 12, background: '#0b1020' }}
    >
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>

      <rect x={0} y={0} width={width} height={height} fill="#0b1020" />
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        <text
          x={0}
          y={0}
          fill="url(#g)"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={40}
          fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial"
        >
          Hello, world
        </text>
      </g>
    </svg>
  );
};

