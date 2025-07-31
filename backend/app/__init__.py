from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from .routes import api_routes
import os
import logging

def create_app():
    app = Flask(__name__)
    CORS(app=app)
    load_dotenv() 
    max_content_length = os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)
    app.config['MAX_CONTENT_LENGTH'] = int(max_content_length)
    app.register_blueprint(api_routes, url_prefix='/api')

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s',
        handlers= [
            logging.FileHandler('caffmed-backend.log'),
            logging.StreamHandler()
        ]
    )
    app.logger.setLevel(logging.INFO)
    return app