import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FormSection({ icon: Icon, title, description, fields, values, onChange }) {
  return (
    <div className="form-card">
      <div className="form-card-header">
        <div className="card-icon-badge">
          <Icon size={19} />
        </div>
        <div className="card-title-group">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className={`fields-grid ${fields.length > 1 ? 'two-cols' : ''}`}>
        {fields.map((field) => {
          const val = values[field.name];

          return (
            <div key={field.name} className="field-group">
              <div className="field-header">
                <label className="field-label" htmlFor={field.name} title={field.tooltip}>
                  {field.label}
                </label>
                {field.unit && <span className="field-unit">{field.unit}</span>}
              </div>

              <div className="input-wrapper">
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    className="select-input"
                    value={val}
                    onChange={(e) => onChange(field.name, Number(e.target.value))}
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                    className="text-input"
                    value={val}
                    onChange={(e) => {
                      const numVal = field.step && field.step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
                      onChange(field.name, isNaN(numVal) ? '' : numVal);
                    }}
                    required
                  />
                )}
              </div>

              {field.info && <span className="field-hint">{field.info}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
