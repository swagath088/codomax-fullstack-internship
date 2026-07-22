const API_URL = "http://localhost:3000/blogs";

document.addEventListener("DOMContentLoaded", fetchBlogs);

// 1. GET: Fetch all blogs
async function fetchBlogs() {
  try {
    const res = await fetch(API_URL);
    const blogs = await res.json();
    displayBlogs(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
  }
}

// Render Blogs with Animation Class
function displayBlogs(blogs) {
  const list = document.getElementById("blogs-list");
  const countEl = document.getElementById("blog-count");
  list.innerHTML = "";
  countEl.innerText = blogs.length;

  if (blogs.length === 0) {
    list.innerHTML = `<li style="text-align:center; color:#a0aec0; padding:20px;">No blogs found. Add one above!</li>`;
    return;
  }

  blogs.forEach((blog) => {
    const li = document.createElement("li");
    li.className = "blog-card";
    li.innerHTML = `
      <div class="blog-info">
        <h4>${escapeHTML(blog.title)}</h4>
        <p>By <em>${escapeHTML(blog.author)}</em></p>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-edit" onclick="prepareEdit(${blog.id}, '${escapeQuote(blog.title)}', '${escapeQuote(blog.author)}')">Edit</button>
        <button class="btn btn-delete" onclick="deleteBlog(${blog.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// 2. Handle Form Submit (POST / PUT)
async function handleFormSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("blog-id").value;
  const title = document.getElementById("blog-title").value.trim();
  const author = document.getElementById("blog-author").value.trim();

  if (!title || !author) return;

  const payload = { title, author };

  try {
    if (id) {
      // PUT
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      // POST
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    resetForm();
    await fetchBlogs();
  } catch (err) {
    console.error("Error saving blog:", err);
  }
}

// Prepare Edit
function prepareEdit(id, title, author) {
  document.getElementById("blog-id").value = id;
  document.getElementById("blog-title").value = title;
  document.getElementById("blog-author").value = author;
  
  document.getElementById("form-heading").innerText = "Edit Blog";
  document.getElementById("save-btn").querySelector("span").innerText = "Update Blog";
  document.getElementById("cancel-btn").style.display = "inline-block";

  // Smooth scroll to form
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 3. DELETE: Remove blog
async function deleteBlog(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchBlogs();
  } catch (err) {
    console.error("Error deleting blog:", err);
  }
}

// Reset Form
function resetForm() {
  document.getElementById("blog-id").value = "";
  document.getElementById("blog-title").value = "";
  document.getElementById("blog-author").value = "";
  document.getElementById("form-heading").innerText = "Add New Blog";
  document.getElementById("save-btn").querySelector("span").innerText = "Add Blog";
  document.getElementById("cancel-btn").style.display = "none";
}

// Smooth Scroll Helper
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

function escapeQuote(str) {
  return str.replace(/'/g, "\\'");
}