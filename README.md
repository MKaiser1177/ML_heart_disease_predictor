# Heart Disease Predictor & React UI

This repository contains an end-to-end heart disease prediction solution built with **Scikit-learn**, served via **FastAPI**, and accompanied by a modern **React.js** web interface.

---

## 🚀 Quick Start (Running Both UI & Backend)

The React web frontend is compiled into `frontend/dist` and directly served by FastAPI. You can launch the complete application with a single command:

```bash
uvicorn app:app --reload
```

Open your browser at **[http://127.0.0.1:8000](http://127.0.0.1:8000)** to interact with the UI.

Interactive API documentation (Swagger UI) is available at **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**.

---

## 💻 Frontend Development (Vite + React)

If you wish to modify or develop the React interface with Instant Hot Module Replacement (HMR):

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open **[http://localhost:3000](http://localhost:3000)**. API calls to `/predict` and `/health` are automatically proxied to `http://127.0.0.1:8000`.

To build the production bundle:
```bash
npm run build
```

---

## 🎨 UI Features

- **Categorized Clinical Sections**:
  - **Demographics**: Age and Biological Sex
  - **Resting Vitals & Blood Chemistry**: Blood pressure, cholesterol levels, fasting blood sugar
  - **Cardiac & Electrocardiography**: Chest pain type classification, resting ECG status, maximum heart rate achieved
  - **Stress Testing & Fluoroscopy**: Exercise-induced angina, ST depression, ST slope, fluoroscopy major vessel count, thallium scintigraphy
- **Quick Test Presets**:
  - **Low Risk Profile**: Instant one-click load of a low-risk case
  - **Moderate Profile**: Borderline markers (e.g. elevated blood pressure and ST depression)
  - **High Risk Profile**: Symptomatic patient with elevated probability
  - **Reset Form**: Restores baseline defaults
- **Live Backend Connection Indicator**: Real-time heartbeat checking `/health` on FastAPI
- **Risk Stratification Card**:
  - Visual probability gauge (0% - 100%)
  - High Risk vs. Low Risk status badge
  - Biomarker summary highlighting critical flags (e.g. hypertension, elevated cholesterol, angina)
  - Clinical guidance & educational disclaimer

---

## 🧠 Machine Learning Model & Pipeline

- **Dataset**: Cleveland Heart Disease dataset (`heart.csv`) with 13 predictive clinical features.
- **Model**: Scikit-Learn `RandomForestClassifier` trained via `pipeline.py`.
- **Serialization**: Saved as a Joblib artifact in `model/model.joblib`.

### Re-training the Model

Run the training pipeline from the root directory:

```bash
python pipeline.py
```

Optional arguments:
```bash
python pipeline.py --data heart.csv --model-output model/model.joblib
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the React web app |
| `GET` | `/health` | Health check endpoint returning `{"status": "healthy"}` |
| `POST` | `/predict` | Evaluates the 13 clinical biomarkers and returns prediction & risk probability |
| `GET` | `/docs` | OpenAPI / Swagger interactive documentation |

### Example Request (`POST /predict`):

```json
{
  "age": 52,
  "sex": 1,
  "cp": 0,
  "trestbps": 125,
  "chol": 212,
  "fbs": 0,
  "restecg": 1,
  "thalach": 168,
  "exang": 0,
  "oldpeak": 1.0,
  "slope": 2,
  "ca": 2,
  "thal": 3
}
```

### Example Response:

```json
{
  "prediction": 0,
  "class_name": 0,
  "probability": {
    "absence": 0.985,
    "presence": 0.015
  },
  "risk_score": 1.5
}
```

---

## 📁 Project Structure

```
ML_heart_disease_predictor/
├── app.py                   # FastAPI backend server with static UI serving & CORS
├── pipeline.py              # ML training and evaluation pipeline
├── heart.csv                # Dataset
├── model/
│   └── model.joblib         # Serialized Scikit-learn Random Forest model
├── main.ipynb               # Exploratory data analysis & model comparison notebook
├── README.md                # Project documentation
└── frontend/                # React.js application
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── Header.jsx
        │   ├── PresetSelector.jsx
        │   ├── FormSection.jsx
        │   └── PredictionCard.jsx
        └── constants/
            └── presets.js
```

---

## ⚖️ License & Disclaimer

This project is intended strictly for educational and screening assistance purposes. It does not replace professional medical diagnosis or clinical consultation.
