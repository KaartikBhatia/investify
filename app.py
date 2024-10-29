from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'Kaartik2411'  # Required for flashing messages

# List to store submissions
submissions = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/business_owner', methods=['GET', 'POST'])
def business_owner():
    if request.method == 'POST':
        # Get form data
        idea = request.form.get('idea')
        description = request.form.get('description')
        funding_needs = request.form.get('funding_needs')
        phone = request.form.get('phone')
        email = request.form.get('email')

        # Create a new submission entry
        submission = {
            'idea': idea,
            'description': description,
            'funding_needs': funding_needs,
            'phone': phone,
            'email': email
        }

        # Add the submission to the list
        submissions.append(submission)
        
        # Flash a message and redirect to the same page
        flash('Submission received!')
        return redirect(url_for('business_owner'))

    return render_template('business_owner.html')

@app.route('/investor')
def investor():
    return render_template('investor.html', submissions=submissions)

if __name__ == '__main__':
    app.run(debug=True)
