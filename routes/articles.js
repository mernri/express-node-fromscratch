const express = require("express");
const router = express.Router();

// Bring in Article Model
const Article = require("../models/article");

// GET - Add article Route
router.get("/add", (req, res, next) => {
  res.render("add_article");
});

// POST - Add article Submit Route
router.post("/add", (req, res, next) => {
  const { title, author, body } = req.body;
  const newArticle = new Article({ title, author, body });
  newArticle
    .save()
    .then(article => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
});

// POST - Delete article
router.post("/:id/delete", (req, res, next) => {
  Article.findByIdAndRemove(req.params.id)
    .then(article => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
});

// GET - Load edit form Route (edit part 1)
router.get("/:id/edit", (req, res, next) => {
  Article.findById(req.params.id)
    .then(article => {
      res.render("edit_article", { article });
    })
    .catch(error => {
      console.log(error);
    });
});

// POST - Sumbit edition (edit part 2)
router.post("/:id/edit", (req, res, next) => {
  const { title, author, body } = req.body;
  Article.updateOne({ _id: req.params.id }, { $set: { title, author, body } })
    .then(article => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
});

// GET article details Route
router.get("/:id", (req, res, next) => {
  Article.findById(req.params.id)
    .then(article => {
      res.render("article", { article });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
