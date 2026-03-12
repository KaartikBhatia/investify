function openMail(email) {
    if (email) {
        const encodedEmail = encodeURIComponent(email);
        const subject = encodeURIComponent("Inquiry about your business");
        const body = encodeURIComponent(
            "Hi,\n\nI am interested in learning more about your business submission.\n\nBest regards,"
        );
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
    } else {
        alert("No email provided.");
    }
}

async function filterSubmissions() {
    const searchInput = document.getElementById('search-input').value;
    const response = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchInput }),
    });

    const data = await response.json();
    console.log(data)
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; 

    if (data.matches && data.matches.length > 0) {
        data.matches.forEach(match => {
            const listItem = document.createElement('li');
            listItem.className = 'submission-item';
            listItem.innerHTML = `<strong>Idea:</strong> ${match.idea}<br>
                                  <strong>Description:</strong> ${match.description}<br>
                                  <strong>Funding Needs:</strong> ${match.funding_needs}<br>
                                  <strong>Phone:</strong> ${match.phone}<br>
                                  <strong>Email:</strong> ${match.email}<br>`;
            resultsList.appendChild(listItem);
        });
    } else {
        const noResultsMessage = document.createElement('li');
        noResultsMessage.textContent = data.message || 'No matching businesses found.';
        resultsList.appendChild(noResultsMessage);
    }
}

function toggleLike(button) {
    if (button.classList.contains("liked")) {
        button.classList.remove("liked");
        button.style.backgroundColor = "#4CAF50";
        button.innerText = "Like";
    } else {
        button.classList.add("liked");
        button.style.backgroundColor = "#007bff";
        button.innerText = "Unlike";
    }
}