const nodemailer = require("nodemailer");
const { User } = require("../schema/models");

const updateStats = async (room, winnerUserId) => {
	if (!room || !winnerUserId) return;
	for (let player of room.players) {
		const user = await User.findById(player.user._id).exec();
		const isWinner = user._id.toString() === winnerUserId.toString();
		user.gamesPlayed += 1;
		if (isWinner) {
			if (room.gameMode === "five_player") user.score += 30;
			else if (room.gameMode === "challenge") {
				if (room.roomType === 3) user.score += 3;
				else if (room.roomType === 4) user.score += 10;
				else if (room.roomType === 5) user.score += 20;
			} else if (room.gameMode === "two_player") {
				if (room.roomType === 3) user.score += 1;
				else if (room.roomType === 4) user.score += 2;
				else if (room.roomType === 5) user.score += 3;
			}
		}
		if (room.gameMode === "five_player")
			user.stats[room.gameMode][isWinner ? 0 : 1] += 1;
		else {
			user.stats[room.gameMode][room.roomType][isWinner ? 0 : 1] += 1;
		}
		user.markModified("stats");
		user.markModified("score");
		user.markModified("gamesPlayed");
		user.save();
	}
};

const getUser = async (userId) => {
	const user = await User.findById(userId);
	if (!user) return null;
	const users = await User.find({}).sort({ score: -1 });
	let rank = 1;
	for (let i = 0; i < users.length; ++i, ++rank) {
		if (users[i]._id.toString() === user._id.toString()) break;
	}
	user.rank = rank;
	return user;
};

const currentDateTimestamp = () => {
	const current = new Date();

	const date = `${current.getDate()}/${
		current.getMonth() + 1
	}/${current.getFullYear()}`;

	const minutes = "0" + current.getMinutes().toString();
	const hours = "0" + current.getHours().toString();

	const time = `${hours.slice(hours.length - 2, 3)}:${minutes.slice(
		minutes.length - 2,
		3
	)}`;
	return date + " - " + time;
};

const getGuessScore = (number, guess, roomType) => {
	if (
		isNaN(number) ||
		isNaN(guess) ||
		String(number).length !== roomType ||
		String(guess).length !== roomType
	)
		return { y: -1, n: -1 };
	let y = 0,
		n = 0;
	for (let i = 0; i < roomType; ++i) {
		if (String(number)[i] === String(guess)[i]) ++y;
		else if (String(number).split("").includes(String(guess)[i])) ++n;
	}
	return { y, n };
};

const logErrorMessage = async (functionName, err) => {
	const transporter = nodemailer.createTransport({
	    host: 'smtp.ethereal.email',
	    port: 587,
	    auth: {
	        user: 'antone.schneider32@ethereal.email',
	        pass: 'wmuPqqjXuEPgZTEBmp'
	    }
	});

	let info = await transporter.sendMail({
		from: 'antone.schneider32@ethereal.email',
		to: "antone.schneider32@ethereal.email",
		subject: functionName,
		text: `${err}`,
		html: `<pre>${err}</pre>`,
	});
};

module.exports = {
	getUser,
	updateStats,
	currentDateTimestamp,
	getGuessScore,
	logErrorMessage,
};
