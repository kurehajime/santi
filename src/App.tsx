import React from 'react';
import { GameElement } from './components/GameElement';

function App(): React.ReactElement {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
      <GameElement />
    </div>
  );
}

export default App;

