document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // confirmation message
    document.getElementById('confirmation-message').style.display = 'block';

    // This redirects to the Home Page after 5 seconds when user hits submit button
    setTimeout(function() {
        window.location.href = '../index.html';
    }, 5000);
});