const express = require("express");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

// GET Route
app.get("/", (req, res) => {
    res.send("Welcome to Codomax Express Server!");
});

// GET Route - Blog
app.get("/blog", (req, res) => {
    res.json({
        message: "This is the Blog Page"
    });
});

// POST Route
app.post("/blog", (req, res) => {

    const { title, author } = req.body;

    res.json({
        success: true,
        message: "Blog added successfully!",
        blog: {
            title,
            author
        }
    });

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});