import os
from functools import wraps
from flask import request, jsonify
from clerk_backend_api import Clerk

# Initialize Clerk with your bearer token
clerk_bearer_token = os.getenv("CLERK_BEARER_TOKEN_SECRET")
clerk = Clerk(bearer_auth=clerk_bearer_token)

def verify_bearer_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized"}), 401

        token = auth_header.split(" ")[1]
        try:
            res = clerk.clients.verify(request={
                "token": token
            })
            if res is None:
                return jsonify({"error": "Unauthorized"}), 401
        except Exception as e:
            print(f"Error verifying clerk token: {e}")
            return jsonify({"error": "Authentication Error"}), 401

        return f(*args, **kwargs)
    return decorated_function