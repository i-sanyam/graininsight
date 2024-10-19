from flask import Flask, jsonify
from app.routes import routes
import time

def create_app():
    app = Flask(__name__)
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

app = create_app()