from flask import Flask, jsonify, render_template, request, redirect, url_for, flash
import os
import requests

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "")
ALPHAVANTAGE_API_KEY = os.environ.get("ALPHAVANTAGE_API_KEY", "")

submissions = []

# ---------------- Pages ----------------
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/business_owner', methods=['GET','POST'])
def business_owner():
    if request.method == 'POST':
        submission = {
            'idea': request.form.get('idea'),
            'description': request.form.get('description'),
            'funding_needs': request.form.get('funding_needs'),
            'phone': request.form.get('phone'),
            'email': request.form.get('email')
        }
        submissions.append(submission)
        flash('Submission received!')
        return redirect(url_for('business_owner'))
    return render_template('business_owner.html', submissions=submissions)

@app.route('/investor', methods=['GET','POST'])
def investor():
    matches, query = None, None
    if request.method == 'POST':
        query = request.form.get('query')
        matches = [s for s in submissions if query.lower() in s['idea'].lower() or query.lower() in s['description'].lower()]
    return render_template('investor.html', submissions=submissions, matches=matches, query=query)

@app.route('/about')
def about(): return render_template('about.html')
@app.route('/contact')
def contact(): return render_template('contactus.html')

@app.route('/add_submission', methods=['POST'])
def add_submission():
    data = request.get_json()
    if not data or 'idea' not in data or 'description' not in data:
        return jsonify({"success": False, "message": "Missing data"}), 400
    submission = {
        'idea': data['idea'], 'description': data['description'],
        'funding_needs': data.get('funding_needs',''),
        'phone': data.get('phone',''), 'email': data.get('email','')
    }
    submissions.append(submission)
    return jsonify({"success": True, "submission": submission}), 201

@app.route('/stock_analysis')
def stock_analysis(): 
    return render_template('stock_analysis.html')

# ---------------- Stock Endpoint ----------------
@app.route('/stock')
def stock_data():
    symbol = request.args.get("symbol")
    if not symbol:
        return jsonify({"error": "No symbol provided"}), 400

    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={ALPHAVANTAGE_API_KEY}"
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        if "Time Series (Daily)" not in data:
            return jsonify({
                "error": True,
                "message": "Alpha Vantage did not return expected daily data.",
                "original": data
            })
        return jsonify({"Time Series (Daily)": data["Time Series (Daily)"]})
    except Exception as e:
        return jsonify({
            "error": True,
            "message": f"Failed to fetch data: {str(e)}"
        })

# ---------------- Main ----------------
if __name__ == '__main__':
    app.run(debug=True)