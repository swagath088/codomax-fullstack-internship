const API_URL = "http://localhost:3000/blogs";

// Default initial data for live GitHub Pages preview
let localBlogs = [
  { id: 1, title: "Welcome to the Full-Stack Blog", author: "Gaddam Swagath" },
  { id: 2, title: "Mastering Express & REST APIs", author: "Jane Doe" }
];

document.addEventListener("DOMContentLoaded", fetchBlogs);

// 1. GET: Fetch blogs from API with localStorage fallback
async function fetchBlogs() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Server response not ok");
    const blogs = await res.json();
    displayBlogs(blogs);
  } catch (err) {
    // Fallback to localStorage for GitHub Pages live demo
    const stored = localStorage.getItem("blogs");
    if (stored) {
      localBlogs = JSON.parse(stored);
    } else {
      localStorage.setItem("blogs", JSON.stringify(localBlogs));
    }
    displayBlogs(localBlogs);
  }
}

// 2. Render Blogs List
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
      <div class="card-actions">
        <button class="btn btn-edit" onclick="prepareEdit(${blog.id}, '${escapeQuote(blog.title)}', '${escapeQuote(blog.author)}')">Edit</button>
        <button class="btn btn-delete" onclick="deleteBlog(${blog.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// 3. Handle Form Submit (POST / PUT)
async function handleFormSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("blog-id").value;
  const title = document.getElementById("blog-title").value.trim();
  const author = document.getElementById("blog-author").value.trim();

  if (!title || !author) return;

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
  } catch (err) {
    // Fallback logic for LocalStorage
    if (id) {
      const idx = localBlogs.findIndex((b) => b.id === parseInt(id));
      if (idx !== -1) {
        localBlogs[idx].title = title;
        localBlogs[idx].author = author;
      }
    } else {
      const newId = localBlogs.length ? localBlogs[localBlogs.length - 1].id + 1 : 1;
      localBlogs.push({ id: newId, title, author });
    }
    localStorage.setItem("blogs", JSON.stringify(localBlogs));
  }

  resetForm();
  await fetchBlogs();
}

// Prepare Edit State
function prepareEdit(id, title, author) {
  document.getElementById("blog-id").value = id;
  document.getElementById("blog-title").value = title;
  document.getElementById("blog-author").value = author;
  
  document.getElementById("form-heading").innerText = "Edit Blog";
  document.getElementById("save-btn").querySelector("span").innerText = "Update Blog";
  document.getElementById("cancel-btn").style.display = "inline-flex";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 4. DELETE: Remove blog
async function deleteBlog(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  } catch (err) {
    localBlogs = localBlogs.filter((b) => b.id !== id);
    localStorage.setItem("blogs", JSON.stringify(localBlogs));
  }
  fetchBlogs();
}

// Reset Form State
function resetForm() {
  document.getElementById("blog-id").value = "";
  document.getElementById("blog-title").value = "";
  document.getElementById("blog-author").value = "";
  document.getElementById("form-heading").innerText = "Add New Blog";
  document.getElementById("save-btn").querySelector("span").innerText = "Add Blog";
  document.getElementById("cancel-btn").style.display = "none";
}

// Smooth Scroll to Top
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