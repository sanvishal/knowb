const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const validator = require("express-validator");
const passport = require("passport");
const config = require("./config/database");

//init db
mongoose.connect(config.database);
let db = mongoose.connection;

//connect to db
db.once("open", function() {
	console.log("db connected");
});

//debug errors
db.on("error", function(err) {
	console.log(err);
});

//db model
let Article = require("./models/article");

//init app
const app = express();

//load views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

//use public folder
app.use(express.static(path.join(__dirname, "public")));

//use port
app.set("port", process.env.PORT || 3000);

//express session
app.use(
	session({
		secret: "topsecretcode",
		resave: true,
		saveUninitialized: true
		//cookie: { secure: true }
	})
);

//express messages
app.use(require("connect-flash")());
app.use(function(req, res, next) {
	res.locals.messages = require("express-messages")(req, res);
	next();
});

//express validator
app.use(validator());

//passport config
require("./config/passport")(passport);

//use passport
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function(req, res, next) {
	res.locals.user = req.user || null;
	next();
});

//home
app.get("/", function(req, res) {
	Article.find({}, function(err, articles) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {
				title: "Articles",
				articles: articles
			});
		}
	});
});

//Route all the files..
//articles
let articles = require("./routes/articles");
app.use("/articles", articles);

//User auth
let users = require("./routes/users");
app.use("/users", users);

//port server
app.listen(app.get("port"), function() {
	console.log("Server Started at ", app.get("port"));
});
