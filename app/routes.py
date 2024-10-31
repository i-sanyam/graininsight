from flask import Blueprint, request, jsonify, current_app
import os
import uuid
import time
from app.auth_decorator import verify_bearer_token
from app.analyze import analyze_grains
import app.image_utils as image_utils

routes = Blueprint('routes', __name__)

@routes.route('/api/internal/uptime', methods=['GET'])
def uptime():
    start_time = current_app.config['START_TIME']
    current_time = time.time()
    uptime_seconds = current_time - start_time
    uptime = {
        "uptime_seconds": round(uptime_seconds, 2)
    }
    return jsonify(uptime)

@routes.route('/api/internal/health', methods=['GET'])
def healthCheck():
    return jsonify({
        "status": "OK"
    })

@routes.route('/api/dashboard/analyze', methods=['POST'])
@verify_bearer_token
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']

    ALLOWED_MAX_IMAGE_SIZE_MB = 3;
    is_valid_image_size = image_utils.validate_image_size(image_file, ALLOWED_MAX_IMAGE_SIZE_MB * 1024)
    if is_valid_image_size == False:  # 3MB in bytes
        return jsonify({"error": f"Image size exceeds {ALLOWED_MAX_IMAGE_SIZE_MB} MB"}), 400
    
    # Extract the file extension from the uploaded file
    original_file_name, file_extension = os.path.splitext(image_file.filename)

    # Generate a unique filename using UUID and the original file extension
    unique_filename = f"{original_file_name}-{uuid.uuid4()}{file_extension}"
    image_path = os.path.join('/tmp', unique_filename)
    image_file.save(image_path)

    output_image, analysis_results = analyze_grains(image_path)

    output_image_base64 = image_utils.convert_image_to_base64(output_image)
    attachment_name = f"result-{unique_filename}"

    return jsonify({
        "attachment_name": attachment_name,
        "image_base64": output_image_base64,
        "data": analysis_results,
    }), 200