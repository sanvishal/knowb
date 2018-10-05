const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//Article model
let Article = require("../models/article");

//User model
let User = require("../models/user");

//add articles
router.get("/add", ensureAuth, function(req, res) {
	res.render("add_article", {
		title: "Add Article"
	});
});

//post route
router.post("/add", ensureAuth, function(req, res) {
	req.checkBody("title", "Title is Required").notEmpty();
	req.checkBody("body", "Body is Required").notEmpty();
	//req.checkBody("author", "Author is Required").notEmpty();

	//get errors
	let err = req.validationErrors();
	if (err) {
		res.render("add_article", {
			title: "Add Article",
			err: err
		});
	}

	let article = new Article();
	article.title = req.body.title;
	article.author = req.user._id;
	article.body = req.body.body;
	//console.log(article.author);
	//return;

	article.save(function(err) {
		if (err) {
			console.log(err);
			return;
		} else {
			req.flash("success", "Article is successfully added!");
			res.redirect("/");
		}
	});
});

//Load edit view
router.get("/edit/:id", ensureAuth, function(req, res) {
	Article.findById(req.params.id, function(err, article) {
		if (article.author != req.user._id) {
			req.flash("danger", "Not Authorized");
			res.redirect("/");
		}
		if (err) {
			console.log("err");
			return;
		} else {
			res.render("edit_article", {
				article: article
			});
		}
	});
});

// Get Single Article
router.get("/:id", function(req, res) {
	Article.findById(req.params.id, function(err, article) {
		//console.log(article);
		User.findById(article.author, function(err, user) {
			res.render("article", {
				article: article,
				author: user.name
			});
		});
	});
});

//Access Control
function ensureAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("danger", "Please Login First to Continue");
		res.redirect("/users/login");
	}
}

//edit and save route
router.post("/edit/:id", function(req, res) {
	let article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;
	//console.log(article.body);
	let query = { _id: req.params.id };
	Article.update(query, article, function(err) {
		if (err) {
			console.log(err);
			return;
		} else {
			res.redirect("/");
		}
	});
});

//delete article
router.delete("/:id", function(req, res) {
	let query = { _id: req.params.id };
	Article.remove(query, function(err) {
		if (err) {
			console.log(err);
		} else {
			res.send("Success");
		}
	});
});

module.exports = router;
