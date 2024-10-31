from flask import Flask, jsonify
from app.routes import routes
from flask_cors import CORS
import time
from app.appconfig import config


def create_app():
    app = Flask(__name__)
    CORS(app, origins=[config.FRONTEND_SERVICE_URL])
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