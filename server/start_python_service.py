#!/usr/bin/env python3
"""
Standalone Python service for PDF to Word conversion
Run this separately from the main Node.js application
"""
import os
import sys
sys.path.append(os.path.dirname(__file__))

from pdf_routes import app

if __name__ == '__main__':
    print("Starting PDF conversion service on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=False)