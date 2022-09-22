const {
	logErrorMessage,
	getUser,
	updateStats,
	getGuessScore,
} = require("../utils/utils");

const setNumber = (io, socket, socketUsers, rooms, body) => {
	try {
		let { number, roomType, roomId } = body;
		if (!roomType || !roomId) return;
		const room = rooms[roomType][roomId];
		/* number should be a number and the length should be according to room type */
		if (isNaN(number) || String(number).length !== room.roomType)
			socket.emit("room-error", `Enter a ${room.roomType} digit number`);
		else if (new Set(String(number)).size < String(number).length)
			/* no digits can be repeated in a number */
			socket.emit("room-error", "A digit should not be repeated");
		else if (String(number)[0] === "0")
			/* number cannot begin with a zero */
			socket.emit("room-error", "Number cannot begin with a zero");
		else if (room && room.players.length === room.playerCount) {
			/* setting the number if room exists and number is not already set */
			for (let i = 0; i < room.playerCount; ++i) {
				/* find the player and set the number if it is not already set */
				if (
					socket.id === room.players[i].socketId &&
					room.numbers[i] === null
				) {
					/* increase set number count */
					++rooms[roomType][roomId].numberCount;
					rooms[roomType][roomId].numbers[i] = Number(number);
					break;
				}
			}
			/* sending room data */
			for (let i = 0; i < room.playerCount; ++i)
				io.to(room.players[i].socketId).emit("room-data", {
					...rooms[roomType][roomId],
					numbers: null,
					number: rooms[roomType][roomId].numbers[i],
				});
			for (let viewer of room.viewers)
				io.to(viewer.socketId).emit("room-data", {
					...rooms[roomType][roomId],
					viewer: true,
				});
		}
	} catch (err) {
		logErrorMessage("setnumber", err);
	}
};

const makeGuess = async (io, socket, socketUsers, rooms, body) => {
	try {
		let { guess, roomType, roomId } = body;
		const room = rooms[roomType][roomId];
		/* number should be a number and the length should be according to room type */
		if (!room) socket.emit("room-error", "Room does not exists");
		if (isNaN(guess) || String(guess).length !== room.roomType)
			socket.emit("room-error", `Enter a ${room.roomType} digit number`);
		else if (new Set(String(guess)).size < String(guess).length)
			/* no digits can be repeated in a number */
			socket.emit("room-error", "A digit should not be repeated");
		else if (String(guess)[0] === "0")
			/* number cannot begin with a zero */
			socket.emit("room-error", "Number cannot begin with a zero");
		else if (!room.gameOver) {
			/* let user guess only if room exists and room has not ended */
			/* find out which player is making the guess */
			let playerIndex;
			for (let i = 0; i < room.playerCount; ++i) {
				/* find player index in the lists */
				if (socket.id === room.players[i].socketId) {
					playerIndex = i;
					break;
				}
			}
			for (let i = 0; i < room.playerCount; ++i) {
				/* traverse through opponent numbers */
				if (socket.id !== room.players[i].socketId) {
					/* calculate the guess score */
					const guessScore = getGuessScore(
						room.numbers[i],
						guess,
						roomType
					);
					/* if guess score is perfect */
					if (guessScore.y === room.roomType) {
						/* end the room and announce the winner */
						rooms[roomType][roomId].gameOver = true;
						rooms[roomType][roomId].winner = socketUsers[socket.id];
						io.emit("room-list", rooms);
						/* mark all players and viewers as not in a room */
						for (let player of rooms[roomType][roomId].players) {
							if (socketUsers[player.socketId])
								socketUsers[player.socketId].inARoom = false;
						}
						for (let viewer of rooms[roomType][roomId].viewers) {
							if (socketUsers[viewer.socketId])
								socketUsers[viewer.socketId].inARoom = false;
						}
						/* update the stats */
						await updateStats(
							room,
							socketUsers[socket.id]?.user._id
						);
					}
					/* add the guess in the guess list */
					rooms[roomType][roomId].guesses[playerIndex].push({
						number: guess,
						...guessScore,
					});
				}
			}
			/* sending room data */
			for (let i = 0; i < room.playerCount; ++i) {
				let user;
				if (rooms[roomType][roomId].gameOver)
					user = await getUser(room.players[i].user._id);
				io.to(room.players[i].socketId).emit("room-data", {
					...rooms[roomType][roomId],
					numbers: room.gameOver ? room.numbers : null,
					number: room.numbers[i],
					user
				});
			}
			for (let viewer of room.viewers) {
				let user = await getUser(viewer.user._id);
				io.to(viewer.socketId).emit("room-data", {
					...rooms[roomType][roomId],
					viewer: true,
					numbers: room.gameOver ? room.numbers : null,
					user
				});
			}
			if(rooms[roomType][roomId].gameOver) {
				delete rooms[roomType][roomId];
				io.emit('room-list', rooms);
			} 
		}
	} catch (err) {
		logErrorMessage("makeguess", err);
	}
};

module.exports = { setNumber, makeGuess };
