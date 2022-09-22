const { User } = require("../schema/models");
const validator = require("email-validator");
const { countries } = require("./data");

const userExists = async (res, email) => {
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		res.json({
			success: false,
			body: { message: "Email already exists" },
		});
		return false;
	}
	return true;
};

const domains = ["com", "in", "org", "ru", "fr", "eu", "br", "net", "uk"];
const providers = ["gmail", "yahoo", "hotmail", "ymail", "reddifmail", "zohomail"];
const validateEmail = (res, email) => {
	if (!validator.validate(email) || email.split("@")[0].length === 0) {
		res.json({
			success: false,
			body: { message: "Invalid email address" },
		});
		return false;
	}
	const emailServer = email.split("@")[1];
	const provider = emailServer.split(".")[0];
	const domain = emailServer.split(".")[1];
	if (!providers.includes(provider) || !domains.includes(domain)) {
		res.json({
			success: false,
			body: { message: "Invalid email address" },
		});
		return false;
	}
	return true;
};

const validatePassword = (res, password, confirmPassword) => {
	if (password.length < 8) {
		res.json({
			success: false,
			body: {
				message: "Password should contain atleast 8 characters",
			},
		});
		return false;
	}
	if (password !== confirmPassword) {
		res.json({
			success: false,
			body: {
				message: "Passwords do not match",
			},
		});
		return false;
	}
	return true;
};

const validateUsername = async (res, username) => {
	if (username.length < 6) {
		res.json({
			success: false,
			body: {
				message: "Username should contain atleast 6 characters",
			},
		});
		return false;
	}
	else if(await User.countDocuments({username})) {
		res.json({success: false, body: {message: 'Username already exists'}});
		return false;
	}
	return true;
};

const validateCountry = (res, country) => {
	if (!countries.includes(country)) {
		res.json({ success: false, body: { message: "Invalid country name" } });
		return false;
	}
	return true;
};

module.exports = {
	userExists,
	validatePassword,
	validateEmail,
	validateUsername,
	validateCountry,
};