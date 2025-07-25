"""
Flask application stub for Python services integration.
This file is required for the Python workflow but the main application runs on Node.js.
"""

import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)
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

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Python services."""
    return jsonify({"status": "healthy", "service": "python-backend"})

@app.route('/', methods=['GET'])
def index():
    """Default route - redirects to main Node.js application."""
    return jsonify({
        "message": "Python backend service is running",
        "main_app": "Please use port 5000 for the main StudentHub application"
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=8000, debug=True)