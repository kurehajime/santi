import React from 'react';

type Props = {
  onStart: () => void;
};

export const StartOverlay: React.FC<Props> = ({ onStart }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
      <button onClick={onStart} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 16 }}>開始</button>
    </div>
  );
};

