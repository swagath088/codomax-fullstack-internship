const express = require("express");
const app = express();
const PORT = 3000;

// Enable JSON body parsing middleware
app.use(express.json());

// In-memory blog storage
let blogs = [
  { id: 1, title: "Original Blog Title", author: "Author Name" },
  { id: 2, title: "Second Blog Post", author: "Jane Doe" }
];

// 1. Root route (Fixes "Cannot GET /" in browser)
app.get("/", (req, res) => {
  res.send("Welcome to the Blog API Server!");
});

// 2. GET: Fetch all blogs
app.get("/blogs", (req, res) => {
  res.json(blogs);
});

// 3. GET: Fetch a single blog by ID
app.get("/blogs/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const blog = blogs.find((b) => b.id === blogId);

  if (!blog) {
    return res.status(404).json({ message: "Blog post not found" });
  }

  res.json(blog);
});

// 4. POST: Create a new blog post
app.post("/blogs", (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and Author are required" });
  }

  const newBlog = {
    id: blogs.length + 1,
    title: title,
    author: author
  };

  blogs.push(newBlog);
  console.log("POST ROUTE HIT - New Blog:", newBlog);

  res.status(201).json({
    message: "Blog created successfully!",
    blog: newBlog
  });
});

// 5. PUT: Edit / Update an existing blog post (Day 8 Task)
app.put("/blogs/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const { title, author } = req.body;

  const blogIndex = blogs.findIndex((b) => b.id === blogId);

  if (blogIndex === -1) {
    return res.status(404).json({ message: "Blog post not found to update" });
  }

  if (title) blogs[blogIndex].title = title;
  if (author) blogs[blogIndex].author = author;

  console.log("PUT ROUTE HIT - Updated Blog:", blogs[blogIndex]);

  res.status(200).json({
    message: "Blog updated successfully!",
    updatedBlog: blogs[blogIndex]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});