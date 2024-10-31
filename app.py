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
        amount_funding = request.form.get('amount_funding')
        phone = request.form.get('phone')
        email = request.form.get('email')

        # Print amount_funding to debug
        print(f"Amount of Funding: {amount_funding}")  # Debugging line

        # Create a new submission entry
        submission = {
            'idea': idea,
            'description': description,
            'funding_needs': funding_needs,
            'phone': phone,
            'email': email,
            'amount_funding': amount_funding,  # Ensure this matches exactly
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

@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact')
def contact():
    return render_template('contactus.html')

if __name__ == '__main__':
    app.run(debug=True)
