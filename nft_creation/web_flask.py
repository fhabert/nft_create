from flask import Flask, redirect, url_for, render_template, request, session, jsonify, make_response
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "NfT"
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)