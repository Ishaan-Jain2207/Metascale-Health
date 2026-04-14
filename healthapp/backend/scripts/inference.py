import sys
import json
import joblib
import numpy as np
import os

# Set base path for models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LIVER_MODEL_PATH = os.path.join(BASE_DIR, "models/liver_model.pkl")
DIABETES_MODEL_PATH = os.path.join(BASE_DIR, "models/diabetes_model.pkl")

# Load models
liver_model = joblib.load(LIVER_MODEL_PATH)
diabetes_model = joblib.load(DIABETES_MODEL_PATH)

def predict_liver(data):
    # Feature order: age, gender, total_bilirubin, direct_bilirubin, alkaline_phosphotase, alt, ast, total_proteins, albumin, albumin_globulin_ratio
    gender_map = {'male': 1, 'female': 0}
    
    features = [
        float(data.get('age', 0)),
        gender_map.get(data.get('gender', 'male').lower(), 1),
        float(data.get('totalBilirubin', 0)),
        float(data.get('directBilirubin', 0)),
        float(data.get('alkalinePhosphotase', 0)),
        float(data.get('alamineAminotransferase', 0)),
        float(data.get('aspartateAminotransferase', 0)),
        float(data.get('totalProteins', 0)),
        float(data.get('albumin', 0)),
        float(data.get('albuminGlobulinRatio', 0))
    ]
    
    # Use numpy for inference instead of pandas
    X = np.array([features])
    prob = liver_model.predict_proba(X)[0][1] # Probability of disease
    prediction = int(liver_model.predict(X)[0])
    
    return {
        "status": "success",
        "prediction": "Disease" if prediction == 1 else "No Disease",
        "probability": float(prob)
    }

def predict_diabetes(data):
    # Feature order: Age,Gender,Family_Diabetes,highBP,PhysicallyActive,BMI,Smoking,Alcohol,Sleep,SoundSleep,RegularMedicine,JunkFood,Stress,BPLevel,Pregnancies,Pdiabetes,UriationFreq
    
    # Mappings from diabetes_dataset_logic.ipynb
    age_map = {'less than 40': 0, '40-49': 1, '50-59': 2, '60 or older': 3}
    gender_map = {'male': 1, 'female': 0}
    binary_map = {'yes': 1, 'no': 0, True: 1, False: 0}
    active_map = {'none': 0, 'less than half an hr': 1, 'more than half an hr': 2, 'one hr or more': 3}
    junk_map = {'occasionally': 1, 'often': 2, 'very often': 3, 'always': 4}
    stress_map = {'not at all': 0, 'sometimes': 1, 'very often': 2, 'always': 3}
    bp_map = {'low': 0, 'normal': 1, 'high': 2}
    urination_map = {'quite often': 1, 'not much': 0}

    features = [
        age_map.get(data.get('ageGroup'), 0),
        gender_map.get(data.get('gender', 'male').lower(), 1),
        binary_map.get(data.get('familyDiabetes'), 0),
        binary_map.get(data.get('highBP'), 0),
        active_map.get(data.get('physicallyActive'), 0),
        float(data.get('bmi', 0)),
        binary_map.get(data.get('smoking'), 0),
        binary_map.get(data.get('alcohol'), 0),
        float(data.get('sleepHours', 0)),
        float(data.get('soundSleep', 0)),
        binary_map.get(data.get('regularMedicine'), 0),
        junk_map.get(data.get('junkFood'), 1),
        stress_map.get(data.get('stress'), 0),
        bp_map.get(data.get('bpLevel'), 1),
        float(data.get('pregnancies', 0)),
        binary_map.get(data.get('prediabetes'), 0),
        urination_map.get(data.get('urinationFreq'), 0)
    ]
    
    # Use numpy for inference instead of pandas
    X = np.array([features])
    prob = diabetes_model.predict_proba(X)[0][1] # Probability of disease
    prediction = int(diabetes_model.predict(X)[0])
    
    return {
        "status": "success",
        "prediction": "Diabetic" if prediction == 1 else "Not Diabetic",
        "probability": float(prob)
    }


if __name__ == "__main__":
    try:
        if len(sys.argv) < 3:
            print(json.dumps({"status": "error", "message": "Missing arguments"}))
            sys.exit(1)
            
        service_type = sys.argv[1] # 'liver' or 'diabetes'
        input_data = json.loads(sys.argv[2])
        
        if service_type == 'liver':
            print(json.dumps(predict_liver(input_data)))
        elif service_type == 'diabetes':
            print(json.dumps(predict_diabetes(input_data)))
        else:
            print(json.dumps({"status": "error", "message": "Unknown service type"}))
            
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)
