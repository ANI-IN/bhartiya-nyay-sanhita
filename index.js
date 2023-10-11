const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const User = require("./models/register");
const PORT = process.env.PORT || 3300;
const connectDB = require("./db/conn");

// Require the Register model here
// const Register = require('./models/register');

const static_path = path.join(__dirname, 'public');
const template_path = path.join(__dirname, 'templates', 'views');
const partials_path = path.join(__dirname, 'templates', 'partials');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get(["/", "/home"], (req, res) => {
  const isAuthenticated = req.isAuthenticated;
  res.render("index", { isAuthenticated });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/judge', (req, res) => {
  res.render('judge');
});


app.post("/register", async (req, res) => {
  //console.log(req.body);
  try {
    const registerEmployee = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      gender: req.body.gender,
      age: req.body.age,
      category: req.body.category,
      adhaarCardNumber: req.body.adhaarCardNumber,
      password: req.body.password,
    });

    const registered = await registerEmployee.save();

  
    const token = await registerEmployee.generateAuthToken();


    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30000000),
      httpOnly: true
    });

    res.render("judge", { success: "Registration successful!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).render("register", { error: "Registration failed." });
  }
});


app.get('/login', (req, res) => {
  const isAuthenticated = req.isAuthenticated; 
  res.render('login', { isAuthenticated });
});

app.get('/lawyer', (req, res) => {
  const isAuthenticated = req.isAuthenticated; 
  res.render('lawyer', { isAuthenticated });
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      
      return res.redirect("/login?error=Invalid%20email%20or%20password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Successful login
      const token = await user.generateAuthToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000000),
        httpOnly: true,
      });

      return res.redirect("/lawyer");
    } else {
      // Handle case where the password doesn't match
      return res.redirect("/login?error=Invalid%20email%20or%20password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is Running at http://localhost:${PORT}`);
  });
});
