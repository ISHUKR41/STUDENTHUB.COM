#!/usr/bin/env python3
import os
import json
import tempfile
import threading
import time
from pathlib import Path
from flask import Flask, request, jsonify, send_file, abort
from werkzeug.utils import secure_filename
from pdf_converter import PDFToWordConverter
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Initialize converter
converter = PDFToWordConverter()

# Allowed extensions
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def cleanup_worker():
    """Background worker to clean up expired files"""
    while True:
        try:
            converter.cleanup_expired_files()
            time.sleep(60)  # Check every minute
        except Exception as e:
            logger.error(f"Cleanup worker error: {e}")

# Start cleanup worker thread
cleanup_thread = threading.Thread(target=cleanup_worker, daemon=True)
cleanup_thread.start()

@app.route('/api/pdf-converter/upload', methods=['POST'])
def upload_and_convert():
    """Upload PDF and convert to Word"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({'success': False, 'error': 'Only PDF files are allowed'}), 400
        
        # Get client IP
        client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
        
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        temp_pdf_path = os.path.join(tempfile.gettempdir(), f"upload_{int(time.time())}_{filename}")
        file.save(temp_pdf_path)
        
        logger.info(f"File uploaded: {filename} from IP: {client_ip}")
        
        # Convert PDF to Word
        result = converter.convert_pdf_to_word(temp_pdf_path, client_ip)
        
        if result['success']:
            return jsonify({
                'success': True,
                'download_id': result['download_id'],
                'expiry_time': result['expiry_time'],
                'file_size': result['file_size'],
                'pdf_type': result['pdf_type'],
                'pages': result['pages'],
                'expires_in_minutes': 4
            })
        else:
            # Clean up uploaded file if conversion failed
            if os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)
            return jsonify({'success': False, 'error': result['error']}), 400
            
    except Exception as e:
        logger.error(f"Upload and convert error: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

@app.route('/api/pdf-converter/download/<download_id>', methods=['GET'])
def download_file(download_id):
    """Download converted Word file"""
    try:
        result = converter.get_download_file(download_id)
        
        if result is None:
            return jsonify({'success': False, 'error': 'File not found or expired'}), 404
        
        file_path, file_info = result
        
        # Generate download filename
        original_name = os.path.basename(file_info.get('pdf_path', 'document'))
        if original_name.lower().endswith('.pdf'):
            download_name = original_name[:-4] + '_converted.docx'
        else:
            download_name = 'converted_document.docx'
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=download_name,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return jsonify({'success': False, 'error': 'Download failed'}), 500

@app.route('/api/pdf-converter/status/<download_id>', methods=['GET'])
def check_status(download_id):
    """Check download status and time remaining"""
    try:
        if download_id in converter.active_files:
            file_info = converter.active_files[download_id]
            current_time = time.time()
            
            if current_time > file_info['expiry_time']:
                converter.cleanup_file(download_id)
                return jsonify({'success': False, 'expired': True})
            
            time_remaining = file_info['expiry_time'] - current_time
            
            return jsonify({
                'success': True,
                'expired': False,
                'time_remaining_seconds': int(time_remaining),
                'time_remaining_minutes': round(time_remaining / 60, 1),
                'file_size': os.path.getsize(file_info['file_path']) if os.path.exists(file_info['file_path']) else 0
            })
        else:
            return jsonify({'success': False, 'expired': True})
            
    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        return jsonify({'success': False, 'error': 'Status check failed'}), 500

@app.route('/api/pdf-converter/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test Tesseract OCR
        import pytesseract
        tesseract_version = pytesseract.get_tesseract_version()
        
        return jsonify({
            'success': True,
            'status': 'healthy',
            'tesseract_version': str(tesseract_version),
            'active_conversions': len(converter.active_files)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'status': 'unhealthy',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # For development
    app.run(host='0.0.0.0', port=5001, debug=True)