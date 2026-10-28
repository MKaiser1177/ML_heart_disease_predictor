export const PRESETS = [
  {
    id: 'low_risk',
    name: 'Low Risk Profile',
    tag: 'Low Risk (Healthy / Optimal)',
    color: '#10b981',
    data: {
      age: 52,
      sex: 1, // Male
      cp: 0, // Typical Angina
      trestbps: 125,
      chol: 212,
      fbs: 0,
      restecg: 1,
      thalach: 168,
      exang: 0,
      oldpeak: 1.0,
      slope: 2,
      ca: 2,
      thal: 3,
    },
    description: 'Patient exhibiting low statistical probability of heart disease under model evaluation.'
  },
  {
    id: 'moderate',
    name: 'Moderate Profile',
    tag: 'Moderate Risk (26%)',
    color: '#f59e0b',
    data: {
      age: 60,
      sex: 1,
      cp: 2,
      trestbps: 140,
      chol: 185,
      fbs: 0,
      restecg: 0,
      thalach: 155,
      exang: 0,
      oldpeak: 3.0,
      slope: 1,
      ca: 0,
      thal: 2,
    },
    description: '60yo male, elevated systolic BP (140 mm Hg) and significant ST depression (3.0 mm).'
  },
  {
    id: 'high_risk',
    name: 'High Risk Profile',
    tag: 'High Risk (99%)',
    color: '#ef4444',
    data: {
      age: 71,
      sex: 0,
      cp: 0,
      trestbps: 112,
      chol: 149,
      fbs: 0,
      restecg: 1,
      thalach: 125,
      exang: 0,
      oldpeak: 1.6,
      slope: 1,
      ca: 0,
      thal: 2,
    },
    description: 'Senior patient presenting with typical angina, ST-T abnormality, and low max heart rate.'
  }
];

export const INITIAL_FORM_STATE = {
  age: 52,
  sex: 1,
  cp: 0,
  trestbps: 125,
  chol: 212,
  fbs: 0,
  restecg: 1,
  thalach: 168,
  exang: 0,
  oldpeak: 1.0,
  slope: 2,
  ca: 2,
  thal: 3,
};

export const FIELD_DEFINITIONS = {
  demographics: [
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      min: 18,
      max: 100,
      step: 1,
      unit: 'years',
      tooltip: 'Patient age in years (range: 18 - 100)',
      info: 'Cardiovascular risk generally increases with age.'
    },
    {
      name: 'sex',
      label: 'Biological Sex',
      type: 'select',
      options: [
        { value: 1, label: 'Male (1)' },
        { value: 0, label: 'Female (0)' }
      ],
      tooltip: 'Biological sex assigned at birth',
      info: 'Biological sex factor used in Cleveland cardiac cohort.'
    }
  ],
  vitals: [
    {
      name: 'trestbps',
      label: 'Resting Blood Pressure',
      type: 'number',
      min: 80,
      max: 220,
      step: 1,
      unit: 'mm Hg',
      tooltip: 'Blood pressure measured on admission to hospital',
      info: 'Normal is under 120 mm Hg. ≥130 mm Hg indicates hypertension.'
    },
    {
      name: 'chol',
      label: 'Serum Cholesterol',
      type: 'number',
      min: 100,
      max: 600,
      step: 1,
      unit: 'mg/dL',
      tooltip: 'Total serum cholesterol in bloodstream',
      info: 'Desirable: < 200 mg/dL. Borderline: 200-239 mg/dL. High: ≥ 240 mg/dL.'
    },
    {
      name: 'fbs',
      label: 'Fasting Blood Sugar > 120 mg/dL',
      type: 'select',
      options: [
        { value: 0, label: '0: No (≤ 120 mg/dL) - Normal' },
        { value: 1, label: '1: Yes (> 120 mg/dL) - Elevated / Diabetic' }
      ],
      tooltip: 'Fasting blood glucose level',
      info: 'Values > 120 mg/dL indicate elevated systemic fasting glucose.'
    }
  ],
  cardiac: [
    {
      name: 'cp',
      label: 'Chest Pain Type (CP)',
      type: 'select',
      options: [
        { value: 0, label: '0: Typical Angina' },
        { value: 1, label: '1: Atypical Angina' },
        { value: 2, label: '2: Non-Anginal Pain' },
        { value: 3, label: '3: Asymptomatic' }
      ],
      tooltip: 'Classification of chest discomfort symptoms',
      info: 'Typical angina is classical ischemic pressure brought on by stress.'
    },
    {
      name: 'restecg',
      label: 'Resting Electrocardiogram (ECG)',
      type: 'select',
      options: [
        { value: 0, label: '0: Normal' },
        { value: 1, label: '1: ST-T Wave Abnormality' },
        { value: 2, label: '2: Left Ventricular Hypertrophy' }
      ],
      tooltip: 'Resting ECG readout status',
      info: 'ST-T abnormalities signify reduced myocardial perfusion.'
    },
    {
      name: 'thalach',
      label: 'Maximum Heart Rate Achieved',
      type: 'number',
      min: 60,
      max: 230,
      step: 1,
      unit: 'bpm',
      tooltip: 'Highest heart rate recorded during peak stress testing',
      info: 'Target max is approximately (220 - age) bpm.'
    }
  ],
  advanced: [
    {
      name: 'exang',
      label: 'Exercise-Induced Angina',
      type: 'select',
      options: [
        { value: 0, label: '0: No (No angina during exercise)' },
        { value: 1, label: '1: Yes (Angina provoked by exertion)' }
      ],
      tooltip: 'Chest pain triggered by treadmill physical exertion',
      info: 'Key clinical marker of exercise-induced ischemia.'
    },
    {
      name: 'oldpeak',
      label: 'ST Depression (Oldpeak)',
      type: 'number',
      min: 0.0,
      max: 7.0,
      step: 0.1,
      unit: 'mm',
      tooltip: 'ST segment depression induced by exercise relative to resting baseline',
      info: 'Depression ≥ 1.0 mm is commonly considered a positive ischemic response.'
    },
    {
      name: 'slope',
      label: 'Slope of Peak Exercise ST Segment',
      type: 'select',
      options: [
        { value: 0, label: '0: Upsloping' },
        { value: 1, label: '1: Flat' },
        { value: 2, label: '2: Downsloping' }
      ],
      tooltip: 'Trajectory angle of the ST segment at peak exertion',
      info: 'Flat or downsloping profiles carry higher coronary risk.'
    },
    {
      name: 'ca',
      label: 'Major Vessels Colored by Fluoroscopy',
      type: 'select',
      options: [
        { value: 0, label: '0 vessels' },
        { value: 1, label: '1 vessel' },
        { value: 2, label: '2 vessels' },
        { value: 3, label: '3 vessels' },
        { value: 4, label: '4 vessels' }
      ],
      tooltip: 'Count of major coronary vessels visible via fluoroscopy',
      info: 'Higher vessel counts correlate with coronary artery disease extent.'
    },
    {
      name: 'thal',
      label: 'Thallium Stress Test (Thal)',
      type: 'select',
      options: [
        { value: 1, label: '1: Normal blood flow' },
        { value: 2, label: '2: Fixed defect' },
        { value: 3, label: '3: Reversible defect' },
        { value: 0, label: '0: Other' }
      ],
      tooltip: 'Nuclear imaging test showing myocardial blood perfusion',
      info: 'Nuclear imaging showing blood flow to cardiac muscle.'
    }
  ]
};
