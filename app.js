const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const config = require('./config/database');
const passport = require('passport');


// Connect to mongoose and check if there's a db error
mongoose
  .connect(
    config.database,
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

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


// Passport config 
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
})

// Set Public Folder (containing static assets like CSS, images...)
app.use(express.static(path.join(__dirname,'public')));

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
