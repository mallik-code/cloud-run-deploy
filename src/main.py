from flask import Flask, jsonify
from flask_cors import CORS
import os
import socket

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:4200", "https://localhost:4200"]}})

@app.route('/')
def home():
    try:
        hostname = socket.gethostname()
        # Success response - default status code 200
        return jsonify({
            "message": f"Welcome to Cloud Run Deployment App!!!",
            "host": hostname,
            "version": "v2"  # Added version number
        })
    except Exception as e:
        return jsonify(
            {
                "error": str(e),
                "status": "Internal Server Error" 
            }),500

if __name__ == '__main__':
    # Get port from environment variable (Cloud Run sets PORT=8080)
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)