const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware for JSON body parsing
app.use(express.json());

// Serve static frontend files from Day2 folder
app.use(express.static(path.join(__dirname, "Day2")));

// In-memory blog storage
let blogs = [
  { id: 1, title: "Original Blog Title", author: "Gaddam Swagath" },
  { id: 2, title: "Second Blog Post", author: "Jane Doe" }
];

// GET: Fetch all blogs
app.get("/blogs", (req, res) => {
  res.json(blogs);
});

// POST: Create a blog
app.post("/blogs", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Title and Author required" });
  }
  const newBlog = {
    id: blogs.length ? blogs[blogs.length - 1].id + 1 : 1,
    title,
    author
  };
  blogs.push(newBlog);
  res.status(201).json(newBlog);
});

// PUT: Edit/Update a blog
app.put("/blogs/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const { title, author } = req.body;
  const blogIndex = blogs.findIndex((b) => b.id === blogId);

  if (blogIndex === -1) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (title) blogs[blogIndex].title = title;
  if (author) blogs[blogIndex].author = author;

  res.json(blogs[blogIndex]);
});

// DELETE: Remove a blog
app.delete("/blogs/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const blogIndex = blogs.findIndex((b) => b.id === blogId);

  if (blogIndex === -1) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const deletedBlog = blogs.splice(blogIndex, 1)[0];
  res.json({ message: "Blog deleted successfully", deletedBlog });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});