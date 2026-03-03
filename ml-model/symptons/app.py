from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import json
import os

app = Flask(__name__)
print("✅ Registered routes:")
for rule in app.url_map.iter_rules():
    print(f"   {rule}")
CORS(app) 

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Disease Prediction ML Model",
        "endpoints": ["/health", "/predict"]
    })

# Get the directory where app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load the model, encoder, and feature list with full paths
try:
    model_path = os.path.join(BASE_DIR, 'symptom_model.pkl')
    encoder_path = os.path.join(BASE_DIR, 'symptom_encoder.pkl')
    features_path = os.path.join(BASE_DIR, 'symptom_features.json')
    
    print(f"Loading model from: {model_path}")
    model = joblib.load(model_path)
    
    print(f"Loading encoder from: {encoder_path}")
    encoder = joblib.load(encoder_path)
    
    print(f"Loading features from: {features_path}")
    with open(features_path, 'r') as f:
        features = json.load(f)
    
    print(f"✅ Model loaded successfully with {len(features)} features")
    
except FileNotFoundError as e:
    print(f"❌ Error loading model files: {e}")
    print("Please ensure the following files exist:")
    print("  - symptom_model.pkl")
    print("  - symptom_encoder.pkl") 
    print("  - symptom_features.json")
    exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    exit(1)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        user_symptoms = data.get('symptoms', [])
        
        if not isinstance(user_symptoms, list):
            return jsonify({"error": "Symptoms must be a list"}), 400
        
        print(f"Received symptoms: {user_symptoms}")

        # Create a 132-length input vector of zeros
        input_vector = np.zeros(len(features))
        
        # Set 1 for every symptom the user selected
        matched_symptoms = []
        for s in user_symptoms:
            if s in features:
                idx = features.index(s)
                input_vector[idx] = 1
                matched_symptoms.append(s)
            else:
                print(f"Warning: Symptom '{s}' not found in feature list")
        
        print(f"Matched {len(matched_symptoms)} symptoms: {matched_symptoms}")

        # Get probabilities for all diseases
        probs = model.predict_proba([input_vector])[0]
        
        # Pick the top 3 highest probabilities
        top_3_idx = np.argsort(probs)[-3:][::-1]
        
        results = []
        for i in top_3_idx:
            disease_name = encoder.inverse_transform([i])[0]
            confidence = round(probs[i] * 100, 2)
            results.append({
                "disease": disease_name,
                "confidence": f"{confidence}%",
                "confidence_level": "High" if confidence >= 70 else "Medium" if confidence >= 40 else "Low"
            })

        print(f"Prediction results: {results}")
        return jsonify(results)
        
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 400

# Add a symptoms list endpoint
@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """Return the list of all possible symptoms"""
    try:
        return jsonify({
            "success": True,
            "count": len(features),
            "symptoms": features
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting ML Service...")
    print(f"📁 Base directory: {BASE_DIR}")
    print(f"🔧 Model loaded with {len(features) if 'features' in dir() else 0} features")
    print(f"🌐 Server will run on http://0.0.0.0:5001")
    app.run(debug=True, port=5001, host='0.0.0.0')