//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] }); //only encrypting the password  //require('dotenv').config(); connects to .env via process.env.SECRET


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});


app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username, //connecting the posted username from register
    password: req.body.password //connecting the posted password from register
  });

  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets"); //when the user registers, he will be able to get access
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username; //connecting the posted username from register
  const password = req.body.password; //connecting the posted password from register

User.findOne({email: username}, function(err, foundUser){
  if (err) {
    console.log(err);
  } else {
    if (foundUser) {
    if (foundUser.password === password) { //if the foundUser's password matches
      res.render("secrets");
    }
  }
}
});

  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
