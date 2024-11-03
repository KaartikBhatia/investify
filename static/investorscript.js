
function openMail(email) {
    if (email) {
        window.location.href = `mailto:${email}`;
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
    
    const counter = button.nextElementSibling;
    let currentLikes = parseInt(counter.innerText) || 0; 

    
    currentLikes += 1;

    
    counter.innerText = currentLikes;

    
    button.innerText = "Liked";
    button.disabled = true; 
}
