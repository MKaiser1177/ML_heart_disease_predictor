import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Info,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function PredictionCard({ prediction, formData, loading }) {
  if (loading) {
    return (
      <div className="result-card">
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <HeartPulse size={30} className="spinner" color="#60a5fa" />
          </div>
          <h3>Analyzing Clinical Biomarkers...</h3>
          <p>Running inputs through trained Random Forest ensemble model.</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="result-card">
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <Activity size={28} />
          </div>
          <h3>Ready for Evaluation</h3>
          <p>Complete the clinical parameters on the left or select a preset, then click Predict Risk.</p>
        </div>

        <div className="disclaimer-card" style={{ marginTop: '16px' }}>
          <Info size={18} style={{ flexShrink: 0, color: '#60a5fa' }} />
          <span>
            The Random Forest model predicts binary risk based on the 13 Cleveland Heart Disease attributes.
          </span>
        </div>
      </div>
    );
  }

  // Model prediction: 1 = Presence (High Risk), 0 = Absence (Low Risk)
  const isHighRisk = prediction.prediction === 1;
  const riskScore = prediction.risk_score !== undefined
    ? prediction.risk_score
    : (isHighRisk ? 85 : 15);

  // Derive risk category
  let riskLevel = 'Low Risk';
  let badgeColor = 'success';
  if (riskScore >= 70) {
    riskLevel = 'High Risk';
    badgeColor = 'danger';
  } else if (riskScore >= 40) {
    riskLevel = 'Moderate / Borderline Risk';
    badgeColor = 'danger';
  }

  // Derive key factor highlights from formData
  const keyFactors = [];
  if (formData.trestbps >= 140) {
    keyFactors.push({ name: 'Blood Pressure', text: `${formData.trestbps} mm Hg (Hypertension)`, isWarning: true });
  } else if (formData.trestbps < 120) {
    keyFactors.push({ name: 'Blood Pressure', text: `${formData.trestbps} mm Hg (Optimal)`, isWarning: false });
  }

  if (formData.chol >= 240) {
    keyFactors.push({ name: 'Cholesterol', text: `${formData.chol} mg/dL (Elevated)`, isWarning: true });
  } else if (formData.chol < 200) {
    keyFactors.push({ name: 'Cholesterol', text: `${formData.chol} mg/dL (Desirable)`, isWarning: false });
  }

  if (formData.exang === 1) {
    keyFactors.push({ name: 'Exercise Angina', text: 'Present during exertion', isWarning: true });
  }

  if (formData.oldpeak >= 1.5) {
    keyFactors.push({ name: 'ST Depression', text: `${formData.oldpeak} mm (Significant)`, isWarning: true });
  } else if (formData.oldpeak === 0) {
    keyFactors.push({ name: 'ST Depression', text: '0.0 mm (None)', isWarning: false });
  }

  if (formData.ca > 0) {
    keyFactors.push({ name: 'Fluoroscopy Vessels', text: `${formData.ca} vessel(s) affected`, isWarning: true });
  }

  return (
    <div className={`result-card ${isHighRisk ? 'high-risk' : 'low-risk'}`}>
      <div className="result-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isHighRisk ? (
            <ShieldAlert size={22} color="#f43f5e" />
          ) : (
            <ShieldCheck size={22} color="#10b981" />
          )}
          <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>
            Risk Stratification
          </span>
        </div>

        <span className={`result-badge ${badgeColor}`}>
          {isHighRisk ? (
            <>
              <AlertTriangle size={13} /> High Risk Detected
            </>
          ) : (
            <>
              <CheckCircle2 size={13} /> Low Risk (Normal)
            </>
          )}
        </span>
      </div>

      <div className="risk-meter-wrapper">
        <div className={`risk-percentage-display ${isHighRisk ? 'danger' : 'success'}`}>
          {riskScore}%
        </div>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>
          Predicted Probability of Heart Disease
        </div>

        <div className="risk-meter-bar-container">
          <div
            className={`risk-meter-bar ${isHighRisk ? 'danger' : 'success'}`}
            style={{ width: `${Math.max(5, Math.min(100, riskScore))}%` }}
          />
        </div>

        <div className="risk-scale-labels">
          <span>0% Low</span>
          <span>50% Threshold</span>
          <span>100% High</span>
        </div>
      </div>

      {/* Clinical Interpretation & Next Steps */}
      <div style={{
        margin: '18px 0',
        padding: '14px',
        borderRadius: '10px',
        background: isHighRisk ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)',
        border: `1px solid ${isHighRisk ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
      }}>
        <h4 style={{
          fontSize: '0.875rem',
          fontWeight: '700',
          color: isHighRisk ? '#fca5a5' : '#86efac',
          marginBottom: '6px'
        }}>
          {isHighRisk ? 'Clinical Alert & Guidance' : 'Optimal Screening Summary'}
        </h4>
        <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: '1.45' }}>
          {isHighRisk
            ? 'The model evaluated multiple cardiac risk markers suggesting elevated likelihood of coronary artery disease. A formal clinical cardiology consultation and follow-up stress echocardiogram or angiography is strongly recommended.'
            : 'Biomarkers align within lower-risk physiological ranges. Continued maintenance of cardiovascular fitness, balanced diet, and routine annual health screenings are recommended.'}
        </p>
      </div>

      {/* Biomarker highlights */}
      {keyFactors.length > 0 && (
        <div className="factors-summary">
          <div className="factors-title">
            <TrendingUp size={15} />
            <span>Notable Biomarkers Detected</span>
          </div>

          <div className="factor-tags">
            {keyFactors.map((item, idx) => (
              <div
                key={idx}
                className={`factor-item ${item.isWarning ? 'warning' : 'optimal'}`}
              >
                <span className="factor-name">{item.name}</span>
                <span className="factor-value">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model metadata */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.725rem',
        color: '#64748b'
      }}>
        <span>Model: Random Forest (200 trees)</span>
        <span>Output Class: {prediction.prediction}</span>
      </div>

      <div className="disclaimer-card" style={{ marginTop: '16px' }}>
        <Info size={16} style={{ flexShrink: 0, color: '#f59e0b' }} />
        <span>
          <strong>Disclaimer:</strong> This tool is an AI demonstration prototype built with Scikit-learn and FastAPI. It does NOT provide formal medical diagnosis.
        </span>
      </div>
    </div>
  );
}
