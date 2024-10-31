from functools import wraps
from flask import request, jsonify
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import AuthenticateRequestOptions

from app.appconfig import config

clerk = Clerk(bearer_auth=config.CLERK_BEARER_TOKEN_SECRET)

def verify_bearer_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized"}), 401

        try:
            request_state = clerk.authenticate_request(
                request,
                AuthenticateRequestOptions(
                    authorized_parties=[config.FRONTEND_SERVICE_URL]
                )
            )
            if (request_state.is_signed_in):
                return f(*args, **kwargs)
            return jsonify({"error": "Unauthorized"}), 401
        except Exception as e:
            print(f"Error verifying clerk token: {e}")
            return jsonify({"error": "Authentication Error"}), 401
    return decorated_function