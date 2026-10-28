import React, { useState, useEffect } from 'react';
import {
  User,
  Stethoscope,
  Activity,
  HeartPulse,
  Send,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import Header from './components/Header';
import PresetSelector from './components/PresetSelector';
import FormSection from './components/FormSection';
import PredictionCard from './components/PredictionCard';
import {
  INITIAL_FORM_STATE,
  FIELD_DEFINITIONS,
  PRESETS
} from './constants/presets';

// Auto-detect base API URL: if on localhost:3000 (Vite), use proxy or direct 8000
const API_BASE = window.location.port === '3000' ? '' : 'http://127.0.0.1:8000';

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [activePreset, setActivePreset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [isCheckingApi, setIsCheckingApi] = useState(false);

  // Health check on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    setIsCheckingApi(true);
    try {
      // First try relative (proxied by Vite)
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' }).catch(() => null);
      if (res && res.ok) {
        setApiStatus('online');
        setIsCheckingApi(false);
        return;
      }
      // If relative failed and API_BASE was empty, fallback to absolute 8000
      const fallbackRes = await fetch('http://127.0.0.1:8000/health').catch(() => null);
      if (fallbackRes && fallbackRes.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch {
      setApiStatus('offline');
    } finally {
      setIsCheckingApi(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }));
    setActivePreset(null);
  };

  const handleSelectPreset = (preset) => {
    setFormData({ ...preset.data });
    setActivePreset(preset.id);
    setPrediction(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setActivePreset(null);
    setPrediction(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // Validate all fields are numbers
    const payload = {};
    for (const [key, value] of Object.entries(formData)) {
      if (value === '' || isNaN(Number(value))) {
        setErrorMessage(`Please provide a valid numeric value for ${key}.`);
        setLoading(false);
        return;
      }
      payload[key] = Number(value);
    }

    try {
      let res;
      try {
        res = await fetch(`${API_BASE}/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        // Fallback directly to 8000 if proxy failed
        res = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Server returned status ${res.status}: ${res.statusText}`
        );
      }

      const data = await res.json();
      setPrediction(data);
      setApiStatus('online');
    } catch (err) {
      console.error('Prediction request error:', err);
      setErrorMessage(
        `Unable to reach the prediction API. Make sure FastAPI is running with: uvicorn app:app --reload`
      );
      setApiStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header
        apiStatus={apiStatus}
        onCheckApi={checkBackendHealth}
        isCheckingApi={isCheckingApi}
      />

      <PresetSelector
        activePreset={activePreset}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
      />

      {errorMessage && (
        <div className="error-banner">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Error connecting to prediction server:</strong>
            <p style={{ marginTop: '4px' }}>{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="main-grid">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="form-container">
          {/* Section 1: Demographics */}
          <FormSection
            icon={User}
            title="1. Patient Demographics"
            description="Basic patient baseline and biological profile"
            fields={FIELD_DEFINITIONS.demographics}
            values={formData}
            onChange={handleFieldChange}
          />

          {/* Section 2: Vitals & Blood Chemistry */}
          <FormSection
            icon={Stethoscope}
            title="2. Resting Vitals & Blood Chemistry"
            description="Blood pressure, lipid panel, and glucose levels"
            fields={FIELD_DEFINITIONS.vitals}
            values={formData}
            onChange={handleFieldChange}
          />

          {/* Section 3: Cardiac & ECG */}
          <FormSection
            icon={Activity}
            title="3. Cardiac Symptoms & Electrocardiography"
            description="Chest pain classification and resting electrical cardiac traces"
            fields={FIELD_DEFINITIONS.cardiac}
            values={formData}
            onChange={handleFieldChange}
          />

          {/* Section 4: Stress Test & Angiography */}
          <FormSection
            icon={HeartPulse}
            title="4. Exercise Stress Test & Fluoroscopy"
            description="Exercise-induced ischemia indicators and nuclear scintigraphy"
            fields={FIELD_DEFINITIONS.advanced}
            values={formData}
            onChange={handleFieldChange}
          />

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <HeartPulse size={20} className="spinner" />
                <span>Evaluating Biomarkers...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Run Heart Disease Risk Prediction</span>
              </>
            )}
          </button>
        </form>

        {/* Results Sticky Column */}
        <div className="results-container">
          <PredictionCard
            prediction={prediction}
            formData={formData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
