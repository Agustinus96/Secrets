require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/userDB");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })

    .post((req, res) => {
        User.findOne({email: req.body.username}, (err, foundUser) => {
            if (err) {
                console.log(err);
            } else {
                if (foundUser) { 
                if (foundUser.password === req.body.password) {
                    res.render("secrets");
                }
            }
        }
        })
    })

app.route("/register")

    .get((req, res) => {
        res.render("register");
    })

    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save((err) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.render("secrets");
            }
        })
    });

    app.get("/logout", (req, res) => {
        res.render("home");
    })

app.listen(3000, function (req, res) {
    console.log("Server started on port 3000.");
})