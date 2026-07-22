// Select the form
const blogForm = document.getElementById("blogForm");
const message = document.getElementById("message");

// Listen for form submission
blogForm.addEventListener("submit", function(event) {

    // Prevent page refresh
    event.preventDefault();

    // Get input values
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const description = document.getElementById("description").value.trim();

    // Validate fields
    if (title === "" || author === "" || description === "") {

        message.textContent = "Please fill in all fields.";
        message.style.color = "red";

    } else {

        message.textContent = "Blog added successfully!";
        message.style.color = "green";

        // Clear form
        blogForm.reset();
    }

});