from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

FEATURE_COLUMNS = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal",
]
TARGET_COLUMN = "target"


def train_and_save_model(data_path: Path | str | None = None, model_output: Path | str | None = None) -> dict:
    root_dir = Path(__file__).resolve().parent
    source_path = Path(data_path) if data_path is not None else root_dir / "heart.csv"
    output_path = Path(model_output) if model_output is not None else root_dir / "model" / "model.joblib"

    df = pd.read_csv(source_path)
    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"Dataset must contain a '{TARGET_COLUMN}' column.")

    missing_columns = [column for column in FEATURE_COLUMNS if column not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing feature columns: {missing_columns}")

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        stratify=y,
        random_state=42,
    )

    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    artifact = {
        "model": model,
        "feature_names": FEATURE_COLUMNS,
        "class_names": sorted(y.unique().tolist()),
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, output_path)

    root_model_path = root_dir / "model.joblib"
    joblib.dump(artifact, root_model_path)

    print(f"Model trained successfully with test accuracy: {accuracy:.4f}")
    print(f"Saved artifact to: {output_path}")
    print(f"Saved copy to: {root_model_path}")
    return artifact


if __name__ == "__main__":
    train_and_save_model()
