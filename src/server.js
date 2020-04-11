// connect express library
const express = require("express");

// to make express application
const app = express();
app.set("views", "./src/views"); // where to take files
app.set("view engine", "ejs"); // who will render

// add route to app
app.get("/notes", (req, res) => res.render("notes"));

module.exports = app;
