from app import create_app
from unittest.mock import patch, MagicMock
import pytest
import io


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.app_context():
        with app.test_client() as client:
            yield client

def test_model_info(client):
    response = client.get('/api/v1/model/info')  # ✅ New endpoint
    assert response.status_code == 200
    data = response.get_json()
    assert "model_name" in data
    assert "version" in data
    assert "classes" in data
    assert len(data["classes"]) == 4


@patch('app.routes.predict_image')
def test_predict_valid_image(mock_predict, client):
    mock_predict.return_value = {
        "class": "Glioma",
        "confidence": 0.95,
        "error": None
    }
    image_bytes = io.BytesIO(b"fake image data")
    data = {
        'image': (image_bytes, 'test_image.jpg')
    }
    response = client.post('/api/v1/predict', data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    result = response.get_json()
    assert result['success'] is True
    assert result['predicted'] == "Glioma"
    assert result['error'] is None
    
def test_predict_no_image(client):
    response = client.post('/api/v1/predict', data={}, content_type='multipart/form-data')
    assert response.status_code == 400
    result = response.get_json()
    assert result['success'] is False
    assert result['error'] == "No image uploaded"
    
def test_predict_invalid_file_type(client):
    image_bytes = io.BytesIO(b"fake image data")
    data = {
        'image': (image_bytes, 'test_image.txt')
    }
    response = client.post('/api/v1/predict', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    result = response.get_json()
    assert result['success'] is False
    assert "Invalid file type" in result['error'] 
