from flask import Blueprint, request, jsonify, current_app
from .model import predict_image, model_load
from .utils import allowed_file
import os
import logging

# ✅ Create versioned API blueprint
api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/v1')

@api_v1.route('/predict', methods=['POST'])
def predict():
    """Brain tumor detection endpoint"""
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
            "error": "Invalid file type. Only PNG, JPG, JPEG, WebP files are allowed"
        }), 400

    # File size validation
    image_file.seek(0, os.SEEK_END)
    size = image_file.tell()
    if size > current_app.config.get('MAX_CONTENT_LENGTH', 5 * 1024 * 1024):
        logging.error("File size exceeds the maximum limit")
        return jsonify({
            "success": False,
            "error": "File size too large. Maximum size is 5MB"
        }), 413
    image_file.seek(0)

    try:
        image_bytes = image_file.read()
        result = predict_image(image_bytes)
        logging.info(f"Prediction successful: {result['class']} ({result['confidence']:.2f})")
        
        return jsonify({
            "success": True,
            "predicted": result["class"],
            "prediction": float(result["confidence"]),  # Ensure it's a float
            "processing_time": result.get("processing_time"),
            "model_version": result.get("model_version", "1.0"),
            "error": None
        }), 200
        
    except Exception as e:
        logging.error(f"Prediction failed: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "predicted": None,
            "prediction": None
        }), 500

@api_v1.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        model_status = model_load()
        return jsonify({
            "status": "healthy" if model_status else "unhealthy",
            "model_loaded": model_status,
            "service": "caffmed-api",
            "version": "1.0.0",
            "timestamp": os.getenv('BUILD_TIME', 'unknown')
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

@api_v1.route('/model/info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        "model_name": "Brain Tumor Detection CNN",
        "version": "1.0.0",
        "classes": ["No Tumor", "Glioma", "Meningioma", "Pituitary"],
        "input_size": "224x224",
        "model_type": "Convolutional Neural Network"
    })