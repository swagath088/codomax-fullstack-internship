const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// JavaScript array to store blogs
const blogs = [];

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to Codomax Blog API!");
});

// Get All Blogs
app.get("/blogs", (req, res) => {
    res.json(blogs);
});

// Add Blog API
app.post("/blogs", (req, res) => {

    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            success: false,
            message: "Title and Author are required."
        });
    }

    const newBlog = {
        id: blogs.length + 1,
        title,
        author
    };

    blogs.push(newBlog);

    res.status(201).json({
        success: true,
        message: "Blog created successfully!",
        blog: newBlog
    });

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});