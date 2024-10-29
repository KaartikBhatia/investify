// investorscript.js

// Function to open the mail client with a dynamic email address
function openMail(email) {
    if (email) {
        window.location.href = `mailto:${email}`;
    } else {
        alert("No email provided.");
    }
}
