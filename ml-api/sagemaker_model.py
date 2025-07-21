from flask import Flask, request, jsonify
import xgboost as xgb
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load your XGBoost model
model = xgb.Booster()
model.load_model('model/xgboost-model')  # Path to your model

# Define threshold (adjust this based on your model's performance)
DROPOUT_THRESHOLD = 0.5  # Students with risk > 0.5 will be classified as "will dropout"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Validate input data
        required_fields = ['lecture_watch_pct', 'checklist_pct', 
                         'attended_live_class', 'attended_group_discussion',
                         'qa_participation_pct']
        
        data = request.json
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Prepare features
        features = [
            float(data['lecture_watch_pct']),
            float(data['checklist_pct']),
            int(data['attended_live_class']),
            int(data['attended_group_discussion']),
            float(data['qa_participation_pct'])
        ]

        # Make prediction
        dtest = xgb.DMatrix(np.array([features]))
        dropout_prob = float(model.predict(dtest)[0])
        
        # Convert to binary prediction
        will_dropout = bool(dropout_prob > DROPOUT_THRESHOLD)  # True/False
        dropout_class = int(will_dropout)  # 0 or 1

         # Generate smarter recommendations
        recs = []

        if data['lecture_watch_pct'] < 70:
            recs.append("Increase your lecture video completion to at least 80% to strengthen understanding.")
        if data['checklist_pct'] < 70:
            recs.append("Make sure to complete all checklist items to stay on track.")
        if data['attended_live_class'] == 0:
            recs.append("Attend live classes to get real-time support and stay engaged.")
        if data['attended_group_discussion'] == 0:
            recs.append("Join group discussions to improve collaboration and communication skills.")
        if data['qa_participation_pct'] < 60:
            recs.append("Participate more in Q&A to clarify doubts and boost retention.")

        # If no improvements are needed, send praise
        if not recs:
            recs.append("🎉 Good job! You did well this week. Keep the momentum going!")

        return jsonify({
            "probability": dropout_prob,  # Keep original probability for reference
            "dropout_risk": will_dropout,  # True/False
            "dropout_class": dropout_class,  # 0 or 1
            "recommended_activities": recs,
            "threshold_used": DROPOUT_THRESHOLD
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False
        }), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)