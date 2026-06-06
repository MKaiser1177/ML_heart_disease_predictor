# Heart Disease Predictor

This repository contains a heart disease prediction project built with Python and scikit-learn. The analysis and model training are performed in `main.ipynb` using the `heart.csv` dataset.

## Project Overview

- Load and inspect the heart disease dataset (`heart.csv`)
- Split the data into training and test sets
- Train multiple classification models:
  - Random Forest
  - Gaussian Naive Bayes
  - Gradient Boosting
  - K-Nearest Neighbors
  - Logistic Regression
  - Support Vector Classifier
- Evaluate model performance using accuracy, recall, and ROC AUC
- Perform hyperparameter tuning for the Random Forest model
- Visualize feature importances and correlation heatmap

## Files

- `main.ipynb` - Main Jupyter notebook with the full workflow and code
- `heart.csv` - Dataset used for training and evaluation
- `README.md` - Project documentation

## Requirements

Recommended Python packages:

- pandas
- numpy
- scikit-learn
- matplotlib
- seaborn

You can install the required packages using pip:

```bash
pip install pandas numpy scikit-learn matplotlib seaborn
```

## Usage

1. Open `main.ipynb` in Jupyter Notebook or JupyterLab.
2. Run the notebook cells sequentially to load the data, train models, and evaluate performance.
3. Review the output and visualizations for model comparison and feature importance.

## Notes

- The notebook includes both scale-insensitive models (Random Forest, Naive Bayes, Gradient Boosting) and scale-sensitive models (KNN, Logistic Regression, SVC).
- Standard scaling is applied before training scale-sensitive models.
- A grid search is used to find better hyperparameters for the Random Forest classifier.

## License

This project is provided for educational purposes.
