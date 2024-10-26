import os
from flask import Flask, jsonify
from app.routes import routes
from flask_cors import CORS
import time
from app.appconfig import config


def create_app():
    app = Flask(__name__)
    print(f"FLASK_ENV: {config.FLASK_ENV}")
    if config.FLASK_ENV == "development":
        fe_url = f"http://localhost:{config.FE_PORT}"
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