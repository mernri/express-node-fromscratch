const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const config = require('./config/database');
const passport = require('passport');
const session = require('express-session');


mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
})

// Check for DB errors 
db.on('error', function(err) {
  console.log(err);
})

// Init app
const app = express();

// Bring in Models
let Article = require("./models/article");
let User = require("./models/user");

// Load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Middleware setup - Necessary so the body parser can work (req.body.title ... )
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Public Folder (containing static assets like CSS, images...)
app.use(express.static(path.join(__dirname,'public')));

// Passport config 
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
})


// Home Route
app.get("/", (req, res, next) => {
  Article.find()
    .then(articles => {
      res.render("index", { 
        title: "Articles",
        articles: articles 
      });
    })
    .catch(error => {
      console.log(error);
    });
});

// Route Files
let articles = require('./routes/articles');
app.use('/articles', articles)

let users = require('./routes/users');
app.use('/users', users)

//Start server
app.listen(3000, () => {
  console.log("server started on port 3000...");
});
