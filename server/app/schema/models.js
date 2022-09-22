const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	email: String,
	username: String,
	password: String,
	country: String,
	profilePicture: String,
	verified: Boolean,
	isAdmin: Boolean,
	stats: Object,
	gamesPlayed: Number,
	score: Number,
	rank: Number,
});

const messageSchema = new Schema({
	private: Boolean,
	from: { type: Schema.Types.ObjectId, ref: "User" },
	to: { type: Schema.Types.ObjectId, ref: "User" },
	text: String,
	dateTime: Date,
	read: Boolean,
});

module.exports = {
	Message: model('Message', messageSchema),
	User: model("User", userSchema)
};