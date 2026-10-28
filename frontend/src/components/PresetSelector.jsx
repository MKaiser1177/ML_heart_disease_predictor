import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { PRESETS } from '../constants/presets';

export default function PresetSelector({ activePreset, onSelectPreset, onReset }) {
  return (
    <div className="preset-bar">
      <div className="preset-label-group">
        <Sparkles size={16} color="#60a5fa" />
        <span>Quick Test Presets:</span>
      </div>

      <div className="preset-buttons">
        {PRESETS.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              className={`preset-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectPreset(preset)}
              title={preset.description}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: preset.color,
                }}
              />
              {preset.name}
            </button>
          );
        })}

        <button
          type="button"
          className="preset-btn reset-btn"
          onClick={onReset}
          title="Reset to initial values"
        >
          <RotateCcw size={13} />
          Reset Form
        </button>
      </div>
    </div>
  );
}
