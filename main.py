"""
StudentHub.com - Main Flask Application
Serves the React frontend and provides backend API functionality.
"""

import os
from flask import Flask, jsonify, send_from_directory, send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__, static_folder='dist/public', static_url_path='')
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the app with the extension
db.init_app(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for backend services."""
    return jsonify({"status": "healthy", "service": "studenthub-backend"})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Serve the React application for all routes."""
    static_folder = app.static_folder or 'dist/public'
    if path != "" and os.path.exists(os.path.join(static_folder, path)):
        # Serve static files (CSS, JS, images, etc.)
        return send_from_directory(static_folder, path)
    else:
        # Serve the main React app for all other routes (SPA routing)
        return send_from_directory(static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)