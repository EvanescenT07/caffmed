from app import create_app
from unittest.mock import patch, MagicMock
import pytest
import io


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_model_check(client):
    response = client.post('/api/model')
    assert response.status_code == 200
    data = response.get_json()
    assert "model_loaded" in data

@patch('app.routes.predict_image')
def test_predict_valid_image(mock_predict, client):
    mock_predict.return_value = {
        "class": "Glioma Detected",
        "confidence": 0.95,
        "error": None
    }
    image_bytes = io.BytesIO(b"fake image data")
    data = {
        'image': (image_bytes, 'test_image.jpg')
    }
    response = client.post('/api/predict', data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    result = response.get_json()
    assert result['success'] is True
    assert result['predicted'] == "Glioma Detected"
    assert result['error'] is None
    
def test_predict_no_image(client):
    response = client.post('/api/predict', data={}, content_type='multipart/form-data')
    assert response.status_code == 400
    result = response.get_json()
    assert result['success'] is False
    assert result['error'] == "No image uploaded"
    
def test_predict_invalid_file_type(client):
    image_bytes = io.BytesIO(b"fake image data")
    data = {
        'image': (image_bytes, 'test_image.txt')
    }
    response = client.post('/api/predict', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    result = response.get_json()
    assert result['success'] is False
    assert result['error'] == "Invalid file type. Only PNG, JPG, JPEG files are allowed"