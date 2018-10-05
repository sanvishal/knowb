const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const config = require("../config/database");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

module.exports = function(passport) {
	// Local Strategy
	passport.use(
		new LocalStrategy(
			{
				usernameField: "uname",
				passwordField: "pass"
			},
			function(uname, pass, done) {
				// Match Username
				let query = { uname: uname };
				User.findOne(query, function(err, user) {
					if (err) throw err;
					if (!user) {
						return done(null, false, { message: "No user found" });
					}

					// Match Password
					bcrypt.compare(pass, user.pass, function(err, isMatch) {
						if (err) throw err;
						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, { message: "Wrong password" });
						}
					});
				});
			}
		)
	);

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
