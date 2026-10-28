import joblib
import numpy as np
import pandas as pd

from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

ROOT_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = ROOT_DIR / "frontend" / "dist"

MODEL_CANDIDATES = [
    ROOT_DIR / "model" / "model.joblib",
    ROOT_DIR / "model.joblib",
]


def resolve_model_path() -> Path:
    for candidate in MODEL_CANDIDATES:
        if candidate.exists():
            return candidate

    raise FileNotFoundError(
        "No trained model artifact was found. Run 'python pipeline.py' to train and save the model."
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    artifact_path = resolve_model_path()
    artifact = joblib.load(artifact_path)

    if isinstance(artifact, dict):
        app.state.model = artifact.get("model")
        app.state.class_names = artifact.get("class_names")
        app.state.feature_names = artifact.get("feature_names", [])
    else:
        app.state.model = artifact
        app.state.class_names = getattr(artifact, "classes_", None)
        app.state.feature_names = []

    if app.state.model is None:
        raise RuntimeError("The model artifact is missing or invalid.")

    yield


app = FastAPI(
    title="Heart Disease Prediction API",
    description="Predict heart disease risk using Scikit-learn and FastAPI",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for React frontend (Vite dev server on port 3000, 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HeartDiseaseInput(BaseModel):
    age: int = Field(..., example=45)
    sex: int = Field(..., example=1)
    cp: int = Field(..., example=3)
    trestbps: int = Field(..., example=130)
    chol: int = Field(..., example=250)
    fbs: int = Field(..., example=0)
    restecg: int = Field(..., example=1)
    thalach: int = Field(..., example=150)
    exang: int = Field(..., example=0)
    oldpeak: float = Field(..., example=1.5)
    slope: int = Field(..., example=2)
    ca: int = Field(..., example=0)
    thal: int = Field(..., example=2)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/predict")
def health_predict(input_data: HeartDiseaseInput):
    feature_dict = {
        "age": [input_data.age],
        "sex": [input_data.sex],
        "cp": [input_data.cp],
        "trestbps": [input_data.trestbps],
        "chol": [input_data.chol],
        "fbs": [input_data.fbs],
        "restecg": [input_data.restecg],
        "thalach": [input_data.thalach],
        "exang": [input_data.exang],
        "oldpeak": [input_data.oldpeak],
        "slope": [input_data.slope],
        "ca": [input_data.ca],
        "thal": [input_data.thal],
    }

    feature_df = pd.DataFrame(feature_dict)

    prediction = int(app.state.model.predict(feature_df)[0])
    response = {"prediction": prediction}

    if app.state.class_names is not None and prediction < len(app.state.class_names):
        response["class_name"] = int(app.state.class_names[prediction])

    if hasattr(app.state.model, "predict_proba"):
        probabilities = app.state.model.predict_proba(feature_df)[0]
        prob_absence = float(probabilities[0])
        prob_presence = float(probabilities[1]) if len(probabilities) > 1 else float(prediction)

        response["probability"] = {
            "absence": round(prob_absence, 4),
            "presence": round(prob_presence, 4),
        }
        response["risk_score"] = round(prob_presence * 100, 1)

    return response


# Mount built React static files if available
if FRONTEND_DIST.exists():
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_index():
        return FileResponse(FRONTEND_DIST / "index.html")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    def home():
        return {"message": "Welcome to the Heart Disease Prediction API!"}
