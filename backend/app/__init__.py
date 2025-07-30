from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from .routes import api_routes
import os

def create_app():
    app = Flask(__name__)
    CORS(app=app)
    load_dotenv() 
    app.config['MAX_CONTENT_LENGTH'] = os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)  # 16 MB limit
    app.register_blueprint(api_routes, url_prefix='/api')
    return app