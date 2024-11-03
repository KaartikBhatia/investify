from urllib import response
from flask import Flask, jsonify, render_template, request, redirect, url_for, flash
import openai
import json

app = Flask(__name__)
app.secret_key = ''  
openai.api_key = ""  

submissions = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/business_owner', methods=['GET', 'POST'])
def business_owner():
    if request.method == 'POST':
        
        idea = request.form.get('idea')
        description = request.form.get('description')
        funding_needs = request.form.get('funding_needs')
        phone = request.form.get('phone')
        email = request.form.get('email')

      
        submission = {
            'idea': idea,
            'description': description,
            'funding_needs': funding_needs,
            'phone': phone,
            'email': email
        }

        submissions.append(submission)
        
        
        flash('Submission received!')
        return redirect(url_for('business_owner'))

    return render_template('business_owner.html', submissions=submissions)

@app.route('/investor', methods=['GET', 'POST'])
def investor():
    matches = None
    query = None
    
    if request.method == 'POST':
        query = request.form.get('query')
        
        matches = [
            submission for submission in submissions
            if query.lower() in submission['description'].lower() or query.lower() in submission['idea'].lower()
        ]
    
    return render_template('investor.html', submissions=submissions, matches=matches, query=query)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contactus.html')

@app.route('/add_submission', methods=['POST'])
def add_submission():
    data = request.get_json()
    
   
    if not data or 'idea' not in data or 'description' not in data:
        return jsonify({"success": False, "message": "Missing data"}), 400
    
    
    submission = {
        'idea': data['idea'],
        'description': data['description'],
        'funding_needs': data.get('funding_needs', ''),
        'phone': data.get('phone', ''),
        'email': data.get('email', '')
    }
    
    
    submissions.append(submission)

    return jsonify({"success": True, "submission": submission}), 201

@app.route('/search', methods=['POST'])
def search():
    print(submissions)
    data = request.get_json()
    query = data['query']
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[{"role": "user", "content": f"You are a business recommendation system. Based on this query: {query}, search through the following businesses and return a JSON object containing the best matching business details. Use double quptes only, no single quptes. The data is {submissions}"}]
        )

        if response and len(response.choices) > 0:
            ai_matches = response.choices[0].message['content']
            print(ai_matches)
           
            parsed_matches = [json.loads(ai_matches)]  

            return jsonify({"matches": parsed_matches})

        return jsonify({"matches": [], "message": "No valid response from OpenAI."})
    except json.JSONDecodeError:
        return jsonify({"matches": [], "message": "Error decoding AI response."})
    except Exception as e:
        return jsonify({"matches": [], "message": f"Error occurred during search: {str(e)}"})
    

@app.route('/stock_analysis')
def stock_analysis():
    return render_template('stock_analysis.html')


print("OpenAI response:", response)

if __name__ == '__main__':
    app.run(debug=True)

