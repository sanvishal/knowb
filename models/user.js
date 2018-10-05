let mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	uname: {
		type: String,
		required: true
	},
	pass: {
		type: String,
		required: true
	}
});

const User = (module.exports = mongoose.model("User", UserSchema));
