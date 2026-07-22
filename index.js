const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Store blogs
const blogs = [];

// Home Page
app.get("/", (req, res) => {

    let html = `
    <html>
    <head>
        <title>Codomax Blog</title>

        <style>
            body{
                font-family:Arial;
                background:#f4f4f4;
                padding:40px;
            }

            h1{
                color:#333;
            }

            .card{
                background:white;
                padding:20px;
                margin:15px 0;
                border-radius:8px;
                box-shadow:0 2px 8px rgba(0,0,0,.2);
            }
        </style>

    </head>

    <body>

    <h1>All Blog Posts</h1>
    `;

    blogs.forEach(blog => {

        html += `
        <div class="card">

            <h2>${blog.title}</h2>

            <p>
                <strong>Author:</strong>
                ${blog.author}
            </p>

        </div>
        `;

    });

    if(blogs.length===0){

        html += "<p>No blogs available.</p>";

    }

    html += `
    </body>
    </html>
    `;

    res.send(html);

});

// View blogs as JSON
app.get("/blogs",(req,res)=>{

    res.json(blogs);

});

// Add Blog
app.post("/blogs",(req,res)=>{

    const {title,author}=req.body;

    if(!title || !author){

        return res.status(400).json({

            success:false,
            message:"Title and Author are required."

        });

    }

    const newBlog={

        id:blogs.length+1,
        title,
        author

    };

    blogs.push(newBlog);

    res.status(201).json({

        success:true,
        message:"Blog created successfully!",
        blog:newBlog

    });

});

app.listen(PORT,()=>{

    console.log(`Server running on http://localhost:${PORT}`);

});