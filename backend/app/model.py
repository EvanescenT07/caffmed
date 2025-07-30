from .utils import load_upload_image
from dotenv import load_dotenv
import tensorflow as tf
import numpy as np
import os

load_dotenv()

MODEL_PATH = os.getenv('MODEL_PATH')

threshold_env = os.getenv('THRESHOLD')
if threshold_env is not None:
    THRESHOLD = float(threshold_env)
else:
    THRESHOLD = 0.83  # Default threshold if not set

CLASS_NAMES = os.getenv('CLASS_NAMES', '').split(',')

try:
    model = tf.keras.models.load_model(MODEL_PATH) # type: ignore
except Exception as e:
    model = None
    print(f"Error loading model: {e}")
    
def model_load():
    return MODEL_PATH in os.listdir() and model is not None

def predict_image(image_bytes):
    if model is None:
        return {
            "error": "Model not loaded or not found."
        }
    
    try:
        image_array = load_upload_image(image_bytes)
        if isinstance(image_array, tuple):
            return {
                "error": image_array[0]
            }
        image_array = np.expand_dims(image_array, axis=0)
        predictions = model.predict(image_array)
        probabilities = float(np.max(predictions))
        if probabilities < THRESHOLD:
            return {
                "class": "Not a Brain Tumor",
                "confidence": probabilities
            }
        prediction_class = CLASS_NAMES[np.argmax(predictions)]
        return {
            "class": prediction_class,
            "confidence": probabilities
        }
        
    except Exception as e:
        return {
            "error": str(e)
        }
