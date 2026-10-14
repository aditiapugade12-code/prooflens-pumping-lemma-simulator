import React from 'react';
import '../styles/StringVisualizer.css';

export default function StringVisualizer({ string, x = null, y = null, z = null, hideLabels = false }) {
  const getSymbolType = (index) => {
    let pos = 0;
    
    if (x !== null && pos + x.length > index) {
      return 'x';
    }
    pos += x ? x.length : 0;
    
    if (y !== null && pos + y.length > index) {
      return 'y';
    }
    pos += y ? y.length : 0;
    
    if (z !== null && pos + z.length > index) {
      return 'z';
    }
    
    return null;
  };

  const hasDecomposition = x !== null && y !== null && z !== null;

  return (
    <div className="string-visualizer">
      <div className="symbols-container">
        {string.split('').map((symbol, idx) => {
          const type = getSymbolType(idx);
          return (
            <div key={idx} className={`symbol ${hasDecomposition ? type : ''}`}>
              <span>{symbol}</span>
              {!hideLabels && hasDecomposition && type && idx === (
                type === 'x' ? (x?.length || 0) - 1 :
                type === 'y' ? (x?.length || 0) + (y?.length || 0) - 1 :
                string.length - 1
              ) ? (
                <div className="symbol-label">{type}</div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="string-length">
        Length = {string.length}
      </div>
    </div>
  );
}
