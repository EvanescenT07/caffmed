from .utils import load_upload_image, suspicious_input
from dotenv import load_dotenv
import numpy as np
import os
from keras.models import load_model

load_dotenv()

MODEL_PATH = os.getenv('MODEL_PATH')
THRESHOLD = float(os.getenv('THRESHOLD', '0.83'))
CLASS_NAMES = [name.strip() for name in os.getenv('CLASS_NAMES', '').split(',') if name.strip()]

try:
    model = load_model(MODEL_PATH)
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

def model_load():
    return os.path.exists(MODEL_PATH) and model is not None # type: ignore

def predict_image(image_bytes):
    if model is None:
        return {
            "class": "Error",
            "confidence": 0.0,
            "error": "Model not loaded or not found."
        }
    try:
        img_array = load_upload_image(image_bytes)
        if isinstance(img_array, tuple):
            return {
                "class": "Error",
                "confidence": 0.0,
                "error": img_array[1]
            }
        img_array = np.expand_dims(img_array, axis=0)
        prediction = model.predict(img_array) # type: ignore
        probability = float(np.max(prediction))
        if probability < THRESHOLD or (probability >= 1.0 and suspicious_input(image_bytes)):
            return {
                "class": "Not a Brain X-Ray image",
                "confidence": probability,
                "error": None
            }
        predicted_class = CLASS_NAMES[np.argmax(prediction)]
        return {
            "class": predicted_class,
            "confidence": probability,
            "error": None
        }
    except Exception as e:
        return {
            "class": "Error Predicting Image",
            "confidence": 0.0,
            "error": str(e)
        }