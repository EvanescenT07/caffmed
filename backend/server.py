from waitress import serve
from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.logger.info(f"Starting server on port {port}")
    print(f"starting server on port {port}")
    serve(
        app,
        host='0.0.0.0',
        port=port,
        threads=4,
        url_scheme='http'
      )