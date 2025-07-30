from flask import Blueprint, request, jsonify, current_app
from .model import predict_image, model_load
from .utils import allowed_file
import os

api_routes = Blueprint('api', __name__)

# Model Endpoint
@api_routes.route('/model', methods=['POST'])
def model_check():
    return jsonify({
        "status": "Model is loaded and ready for predictions.",
        "model": model_load(),
        "result": predict_image(request.data)
    })

# ML Prediction Endpoint
@api_routes.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({
            "success": False, "error": "No image uploaded"
            }), 400
    
    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({
            "success": False, "error": "No selected file"
        }), 400
        
    if not allowed_file(image_file.filename):
        return jsonify({
            "success": False, "error": "Invalid file type"
        }), 400
    image_file.seek(0, os.SEEK_END)
    
    size = image_file.tell()
    if size > current_app.config['MAX_CONTENT_LENGTH']:
        return jsonify({
            "success": False, "error": "File size too large"
        }), 400
    image_file.seek(0)
    
    try:
        image_bytes = image_file.read()
        result = predict_image(image_bytes)
        return jsonify({
            "status": "success",
            "prediction": [
                result['class'], result['confidence']
                ],
            "error": result["error"] if "error" in result else None
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500