// connect express library
const express = require("express");
const bodyParser = require("body-parser");
const repository = require("./repository");

// to make express application
const app = express();
app.set("views", "./src/views"); // where to take files
app.set("view engine", "ejs"); // who will render

//to use middleware
app.use(bodyParser.urlencoded({ extended: true }));

// add route to app
app.get("/notes", (req, res) => {
  repository.findAll((err, notes) => {
    if (err) {
      return res.status(500).send("oops");
    }
    res.render("notes", { title: "My notes", notes });
  });
});

app.post("/notes", (req, res) => {
  repository.create(req.body.textField, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("internal server error");
    }
    res.redirect("/notes");
  });
});

module.exports = app;
