const API_URL = "http://localhost:3000/blogs";

// Automatically fetch blogs when page loads
document.addEventListener("DOMContentLoaded", fetchBlogs);

// 1. GET Request: Fetch all blogs
async function fetchBlogs() {
  try {
    const res = await fetch(API_URL);
    const blogs = await res.json();
    displayBlogs(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
  }
}

// Display blogs in HTML
function displayBlogs(blogs) {
  const list = document.getElementById("blogs-list");
  list.innerHTML = "";

  blogs.forEach((blog) => {
    const li = document.createElement("li");
    li.style.marginBottom = "10px";
    li.innerHTML = `
      <strong>${blog.title}</strong> by <em>${blog.author}</em>
      <button onclick="prepareEdit(${blog.id}, '${blog.title}', '${blog.author}')">Edit</button>
      <button onclick="deleteBlog(${blog.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

// 2. POST / PUT Request: Create or Update Blog
async function saveBlog() {
  const id = document.getElementById("blog-id").value;
  const title = document.getElementById("blog-title").value;
  const author = document.getElementById("blog-author").value;

  if (!title || !author) {
    alert("Please provide both Title and Author!");
    return;
  }

  const payload = { title, author };

  try {
    if (id) {
      // PUT Request
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      // POST Request
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    resetForm();
    fetchBlogs();
  } catch (err) {
    console.error("Error saving blog:", err);
  }
}

// Populate form fields for editing
function prepareEdit(id, title, author) {
  document.getElementById("blog-id").value = id;
  document.getElementById("blog-title").value = title;
  document.getElementById("blog-author").value = author;
  document.getElementById("form-heading").innerText = "Edit Blog";
  document.getElementById("save-btn").innerText = "Update Blog";
}

// 3. DELETE Request: Remove a blog
async function deleteBlog(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
    fetchBlogs();
  } catch (err) {
    console.error("Error deleting blog:", err);
  }
}

// Reset form to default state
function resetForm() {
  document.getElementById("blog-id").value = "";
  document.getElementById("blog-title").value = "";
  document.getElementById("blog-author").value = "";
  document.getElementById("form-heading").innerText = "Add New Blog";
  document.getElementById("save-btn").innerText = "Add Blog";
}