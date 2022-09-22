const { User } = require("../schema/models");
const {
	hashPassword,
	comparePassword,
	generateAccessToken,
} = require("../utils/auth");
const { getUser, currentDateTimestamp } = require("../utils/utils");
const {
	validateEmail,
	validatePassword,
	userExists,
	validateUsername,
	validateCountry,
} = require("../utils/validators");

const signup = async (req, res) => {
	const { email, username, password, confirmPassword, country } = req.body;
	if (
		!(await userExists(res, email)) ||
		!validateEmail(res, email) ||
		!await validateUsername(res, username) ||
		!validatePassword(res, password, confirmPassword) ||
		!validateCountry(res, country)
	)
		return;
	const hashedPassword = await hashPassword(password);
	let user = new User({
		email,
		username,
		country,
		password: hashedPassword,
		verified: false,
		isAdmin: false,
		profilePicture: 'default.png',
		stats: {
			two_player: {3: [0, 0], 4: [0, 0], 5: [0, 0]},
			five_player: [0, 0],
			challenge: {3: [0, 0], 4: [0, 0], 5: [0, 0]},
		},
		gamesPlayed: 0,
		score: 0,
	});
	user = await user.save();
	user = await getUser(user._id);
	const accessToken = generateAccessToken(user);
	res.cookie("accessToken", accessToken, { sameSite: "None", secure: true });
	return res.json({
		success: true,
		body: { message: "Signed up successfully", user },
	});
};

const login = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		return res.json({
			success: false,
			body: { message: "Credentials not provided" },
		});
	let user = await User.findOne({ username });
	if (!user)
		return res.json({
			success: false,
			body: { message: "User does not exist" },
		});

	if (!(await comparePassword(password, user.password)))
		return res.json({
			success: false,
			body: { message: "Incorrect password" },
		});
	user = await getUser(user._id);
	const accessToken = generateAccessToken(user);
	res.cookie("accessToken", accessToken, { sameSite: "None", secure: true });

	res.json({
		success: true,
		body: { message: "Logged in successfully", user },
	});
};

const refresh = async (req, res) => {
	const user = await getUser(req.user._id);
	res.json({
		success: true,
		body: { message: "Token was verified", user },
	});
};

const logout = async (req, res) => {
	res.clearCookie("accessToken");
	res.json({ success: true, body: { message: "Logged out successfully" } });
};

module.exports = {
	signup,
	login,
	refresh,
	logout,
};