from flask import Blueprint, request, jsonify, current_app
from .model import predict_image, model_load
from .utils import allowed_file
import os
import logging

api_routes = Blueprint('api', __name__)

@api_routes.route('/model', methods=['POST'])
def model_check():
    return jsonify({
        "status": "Model is loaded and ready for predictions.",
        "model_loaded": model_load(),
        "result": None  # Optionally, you can run a test prediction here
    })

@api_routes.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        logging.warning("No image part in the request")
        return jsonify({
            "success": False,
            "error": "No image uploaded"
        }), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logging.warning("No selected file")
        return jsonify({
            "success": False,
            "error": "No selected file"
        }), 400

    if not allowed_file(image_file.filename):
        logging.error("Invalid file type")
        return jsonify({
            "success": False,
            "error": "Invalid file type. Only PNG, JPG, JPEG files are allowed"
        }), 400

    image_file.seek(0, os.SEEK_END)
    size = image_file.tell()
    if size > current_app.config['MAX_CONTENT_LENGTH']:
        logging.error("File size exceeds the maximum limit")
        return jsonify({
            "success": False,
            "error": "File size too large. Maximum size is 5MB"
        }), 400
    image_file.seek(0)

    try:
        image_bytes = image_file.read()
        result = predict_image(image_bytes)
        logging.info(f"Prediction result: {result}")
        return jsonify({
            "success": True,
            "predicted": result["class"],
            "prediction": result["confidence"],
            "error": result["error"]
        })
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500