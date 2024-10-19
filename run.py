import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    # Get the environment from the environment variable, default to 'development'
    environment = os.getenv('FLASK_ENV', 'development')
    
    # Enable debug mode only if the environment is not 'production'
    debug = environment != 'production'
    app.run(debug=debug)