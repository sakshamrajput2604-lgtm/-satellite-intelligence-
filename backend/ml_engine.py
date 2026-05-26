import sqlite3
import os
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import pickle
import time

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'rf_model.pkl')
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'users.db')

def train_model():
    print("Training ML Risk Model...")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT missDistance, timeToImpact, probability FROM alerts")
        rows = cursor.fetchall()
        conn.close()

        if len(rows) < 10:
            print("Not enough data to train. Need at least 10 alerts.")
            return False

        X = np.array([[r[0], r[1]] for r in rows])
        # We will train it to predict the original probability, but in reality 
        # this could be a more complex target variable (like orbital decay).
        y = np.array([r[2] for r in rows])

        model = RandomForestRegressor(n_estimators=50, random_state=42)
        model.fit(X, y)

        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(model, f)
            
        print("Model trained successfully.")
        return True
    except Exception as e:
        print(f"ML Training Error: {e}")
        return False

def get_risk_prediction(miss_distance, time_to_impact):
    # Returns an AI augmented risk score
    try:
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            # Predict base probability from the model
            base_prob = model.predict([[miss_distance, time_to_impact]])[0]
            # Add a slight AI confidence multiplier
            return min(1.0, base_prob * 1.05)
    except Exception as e:
        pass
    
    # Fallback to a basic heuristic if model fails/doesn't exist
    score = (5000 - miss_distance) / 5000
    if time_to_impact < 100:
        score += 0.1
    return max(0.0, min(1.0, score))
