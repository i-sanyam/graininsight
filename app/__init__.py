import os
from flask import Flask, jsonify
from app.routes import routes
from flask_cors import CORS
import time

def create_app():
    app = Flask(__name__)
    if os.getenv("FLASK_ENV") == "development":
        fe_url = f"http://localhost:{os.getenv('FE_PORT')}"
        CORS(app, origins=[fe_url])
    else:
        CORS(app)
    app.register_blueprint(routes)
    
    # Global error handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        response = {
            "error": "Something went wrong",
            "message": str(e)
        }
        return jsonify(response), 500
    
    # Record the start time
    app.config['START_TIME'] = time.time()
    return app