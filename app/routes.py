from flask import Blueprint, request, jsonify, send_file, current_app
from app.analyze import analyze_grains
import os
from io import BytesIO
import cv2
import uuid
import time

routes = Blueprint('routes', __name__)

@routes.route('/internal/uptime', methods=['GET'])
def uptime():
    start_time = current_app.config['START_TIME']
    current_time = time.time()
    uptime_seconds = current_time - start_time
    uptime = {
        "uptime_seconds": round(uptime_seconds, 2)
    }
    return jsonify(uptime)

@routes.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    # Extract the file extension from the uploaded file
    original_file_name, file_extension = os.path.splitext(image_file.filename)

    # Generate a unique filename using UUID and the original file extension
    unique_filename = f"{original_file_name}-{uuid.uuid4()}{file_extension}"
    image_path = os.path.join('/tmp', unique_filename)
    image_file.save(image_path)

    output_image, analysis_results = analyze_grains(image_path)

    # Convert the output image to a format that can be sent in the response
    _, buffer = cv2.imencode('.jpg', output_image)
    image_bytes = BytesIO(buffer)

    return send_file(image_bytes, 'image/jpeg', True, f"result-${unique_filename}"), 200, analysis_results