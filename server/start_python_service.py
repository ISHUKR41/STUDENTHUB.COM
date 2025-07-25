#!/usr/bin/env python3
"""
Standalone Python service for PDF to Word conversion
Run this separately from the main Node.js application
"""
import os
import sys
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

try:
    from pdf_routes import app
    logger.info("PDF routes module imported successfully")
except ImportError as e:
    logger.error(f"Failed to import pdf_routes: {e}")
    sys.exit(1)

if __name__ == '__main__':
    try:
        logger.info("Starting PDF conversion service on port 5001...")
        app.run(host='0.0.0.0', port=5001, debug=False, threaded=True)
    except Exception as e:
        logger.error(f"Failed to start service: {e}")
        sys.exit(1)