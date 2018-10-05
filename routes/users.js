const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const bodyParser = require("body-parser");
const router = express.Router();

//db model
let User = require("../models/user");

//get reg form
router.get("/register", function(req, res) {
	res.render("register", {
		title: "Register"
	});
});

//Register Form
router.post("/register", function(req, res) {
	const name = req.body.name;
	const uname = req.body.uname;
	const pass = req.body.pass;
	const email = req.body.email;
	const cpass = req.body.confpass;

	req.checkBody("name", "Name is required").notEmpty();
	req.checkBody("email", "Email address is required").notEmpty();
	req.checkBody("email", "Email address is required").isEmail();
	req.checkBody("pass", "Password is required").notEmpty();
	req.checkBody("uname", "Username is required").notEmpty();
	req.checkBody("confpass", "Passwords do not match").equals(req.body.pass);

	let err = req.validationErrors();
	if (err) {
		res.render("register", {
			title: "Register",
			err: err
		});
	} else {
		let newuser = new User({
			name: name,
			uname: uname,
			email: email,
			pass: pass
		});

		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newuser.pass, salt, function(err, hash) {
				if (err) {
					console.log(err);
				} else {
					newuser.pass = hash;
				}
				newuser.save(function(err) {
					if (err) {
						console.log(err);
						return;
					}
					req.flash(
						"success",
						"Hi, " +
							newuser.name +
							". Your Account is Created, Please Login to Continue"
					);
					res.redirect("/users/login");
				});
			});
		});
	}
});

// Login Form
router.get("/login", function(req, res) {
	res.render("login", {
		title: "login"
	});
});

// Login Process
router.post("/login", function(req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/users/login",
		failureFlash: true
	})(req, res, next);
});

//logout
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "You've logged out now!");
	res.redirect("/users/login");
});

module.exports = router;
