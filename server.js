// Initialize the express and supporting modules
const express = require("express");
const path = require("path");
const api = require("./routes/index.js");

// Use port 3001 unless the assigned by hosting provider
const PORT = process.env.PORT || 3001;

// Initialize the express app
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the api route and public folder
app.use("/api", api);
app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

// Start listening on the specified port
app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`));
