import React from 'react';
import { Activity, Heart, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ apiStatus, onCheckApi, isCheckingApi }) {
  return (
    <header className="header">
      <div className="brand-section">
        <div className="logo-heart-wrapper pulse-animation">
          <Heart size={26} strokeWidth={2.5} fill="#f43f5e" fillOpacity={0.2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="brand-title">CardioPredict AI</h1>
            <span style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              fontSize: '0.6875rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              v1.0 • ML
            </span>
          </div>
          <p className="brand-subtitle">
            Clinical Heart Disease Risk Assessment & Stratification System
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          className={`api-status-badge ${
            apiStatus === 'online' ? 'online' : apiStatus === 'offline' ? 'offline' : 'checking'
          }`}
          title="Backend FastAPI status (http://127.0.0.1:8000)"
        >
          <span
            className={`status-dot ${
              apiStatus === 'online' ? 'online' : apiStatus === 'offline' ? 'offline' : 'checking'
            }`}
          />
          <span>
            {apiStatus === 'online'
              ? 'FastAPI Online'
              : apiStatus === 'offline'
              ? 'FastAPI Offline'
              : 'Connecting...'}
          </span>
          <button
            onClick={onCheckApi}
            disabled={isCheckingApi}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              marginLeft: '2px',
              opacity: 0.8
            }}
            title="Check API health connection"
          >
            <RefreshCw size={13} className={isCheckingApi ? 'spinner' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
}
