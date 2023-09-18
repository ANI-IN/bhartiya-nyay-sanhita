const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const Register = require("./models/register"); 
const PORT = process.env.PORT || 3300
const connectDB = require("./db/conn");



const static_path = path.join(__dirname, 'public');
const template_path = path.join(__dirname, 'templates', 'views');
const partials_path = path.join(__dirname, 'templates', 'partials');



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);



app.get('/register', (req, res) => {
    res.render('register'); 
});

app.post('/register', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            mobileNumber,
            adhaarCardNumber,
            dateOfBirth,
            userType,
            password,
            confirmPassword
        } = req.body;

       
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

      
        const newUser = new Register({
            firstName,
            lastName,
            email,
            mobileNumber,
            adhaarCardNumber,
            dateOfBirth,
            userType,
            password: hashedPassword,  
            confirmPassword: hashedPassword, 
        });
      
        // console.log(newUser);

        const savedUser = await newUser.save();
        //  console.log(savedUser);

        res.status(201).send("Registration successful!");
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send(`Registration failed. Error: ${error.message}`);
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is Running at http://localhost:${PORT}`);
    });

})