const { logErrorMessage, getUser, updateStats } = require("../utils/utils");
const { roomTypes } = require("../utils/data");
const { v4 } = require("uuid");

const createRoom = async (io, socket, socketUsers, rooms, body) => {
	try {
		let { roomType } = body;
		/* create a room only if user has a socket entry */
		if (socketUsers[socket.id]) {
			roomType = Number(roomType);
			/* checking for valid room type */
			if (!roomTypes.includes(roomType)) {
				socket.emit("room-error", "Invalid room type");
			} else if (socketUsers[socket.id].inARoom) {
				/* the user must not be already in a room */
				return;
			} else {
				/* initializing room data */
				const roomId = v4();
				const room = {
					id: roomId,
					owner: socketUsers[socket.id],
					players: [socketUsers[socket.id]],
					gameStarted: false,
					gameOver: false,
					winner: null,
					playerCount: 2,
					gameMode: "two_player",
					roomType: roomType,
					numbers: [null],
					guesses: [[]],
					viewers: [],
					numberCount: 0,
				};
				/* marking user as in a room */
				socketUsers[socket.id].inARoom = true;
				rooms[roomType][roomId] = room;
				socket.emit("room-data", room);
				io.emit("room-list", rooms);
				/* broadcast to all users */
			}
		}
	} catch (err) {
		logErrorMessage("createroom", err);
	}
};

const joinRoom = async (io, socket, socketUsers, rooms, body) => {
	try {
		let { roomId, roomType } = body;
		/* 
	checking if joining user has a socket entry,
	is not already in a room,
	and given room details are valid,
	 */
		if (!socketUsers[socket.id])
			socket.emit("room-error", "Unauthorized to join a room");
		else if (socketUsers[socket.id].inARoom)
			socket.emit("room-error", "Already in a room");
		else if (roomId && roomType) {
			const room = rooms[roomType][roomId];
			/* checking if room exists and if it is allowed to join or not */
			if (!room || room.gameOver || room.gameStarted)
				socket.emit("room-error", "Unable to join the room");
			else if (
				room.owner.user._id.toString() ===
				socketUsers[socket.id].user._id.toString()
			)
				/* cannot join your own room */
				socket.emit("room-error", "Cannot join your own room");
			else {
				/* add the player to the room */
				rooms[roomType][roomId] = {
					...room,
					players: [...room.players, socketUsers[socket.id]],
					numbers: [
						...room.numbers,
						null,
					] /* add a null entry to numbers list for the new player */,
					gameStarted:
						room.players.length + 1 === room.playerCount
							? true
							: false /* start the game if room is full */,
					guesses: [
						...room.guesses,
						[],
					] /* another empty entry for guesses */,
				};
				/* mark user as in a room */
				socketUsers[socket.id].inARoom = true;
				socket.emit("room-joined", roomType);
				/* sending room data */
				for (let i = 0; i < rooms[roomType][roomId].players.length; ++i)
					io.to(rooms[roomType][roomId].players[i].socketId).emit(
						"room-data",
						rooms[roomType][roomId]
					);
				for (let i = 0; i < room.viewers.length; ++i)
					io.to(room.viewers[i].socketId).emit("room-data", {
						...rooms[roomType][roomId],
						viewer: true,
					});
				io.emit("room-list", rooms);
			}
		}
	} catch (err) {
		logErrorMessage("joinroom", err);
	}
};

const viewRoom = async (io, socket, socketUsers, rooms, body) => {
	try {
		const { roomId, roomType } = body;
		/* 
	checking if joining user has a socket entry,
	is not already in a room,
	and given room details are valid,
	 */
		if (
			socketUsers[socket.id] &&
			!socketUsers[socket.id].inARoom &&
			roomId &&
			roomType
		) {
			const room = rooms[roomType][roomId];
			/* 
		checking if room is valid,
		the game is not over yet,
		and not letting a owner view his own room
		 */
			if (room && !room.gameOver) {
				if (
					room.owner.user._id.toString() ===
					socketUsers[socket.id].user._id.toString()
				)
					return socket.emit(
						"room-error",
						"Cannot view your own room"
					);
				/* adding the user to viewers list, marking as in a room */
				rooms[roomType][roomId].viewers.push(socketUsers[socket.id]);
				socketUsers[socket.id].inARoom = true;
				socket.emit("room-joined", roomType);
				/* sending room data */
				for (let i = 0; i < room.players.length; ++i)
					io.to(room.players[i].socketId).emit(
						"room-data",
						rooms[roomType][roomId]
					);
				for (let i = 0; i < room.viewers.length; ++i)
					io.to(room.viewers[i].socketId).emit("room-data", {
						...rooms[roomType][roomId],
						viewer: true,
					});
				io.emit("room-list", rooms);
			} else socket.emit("room-error", "Unable to join the room");
		}
	} catch (err) {
		logErrorMessage("viewroom", err);
	}
};

const getRooms = async (io, socket, socketUsers, rooms) => {
	try {
		if (socketUsers[socket.id]) socket.emit("room-list", rooms);
	} catch (err) {
		logErrorMessage("getrooms", err);
	}
};

const leaveRoom = async (io, socket, socketUsers, rooms, body) => {
	try {
		let { roomType, roomId } = body;
		if (!roomType || !roomId) return;
		const room = rooms[roomType][roomId];
		/* if room exists */
		if (room) {
			/* checking if the user leaving is a player or viewer */
			let playerLeft = false;
			for (let player of room.players) {
				if (player.user._id === socketUsers[socket.id].user._id) {
					playerLeft = true;
					break;
				}
			}
			/* if it is a player */
			if (playerLeft) {
				if(socketUsers[socket.id]) 
					socketUsers[socket.id].inARoom = false;
				for (let player of room.players) {
					/* mark all players as not in a room */
					if (socketUsers[player.socketId])
						socketUsers[player.socketId].inARoom = false;
					/* if room has not ended yet, announce winner and update stats */
					if (
						!room.gameOver &&
						socketUsers[socket.id].user._id !== player.user._id
					) {
						rooms[roomType][roomId].winner = player;
						await updateStats(room, player.user._id);
						break;
					}
				}
				/* mark all viewers as not in a room */
				for (let viewer of room.viewers)
					socketUsers[viewer.socketId].inARoom = false;
				/* game over */
				rooms[roomType][roomId].gameOver = true;
			} else {
				/* else if user left is a viewer */
				for (let viewer of room.viewers) {
					/* find the appropriate viewer */
					if (
						viewer.user._id.toString() ===
						socketUsers[socket.id].user._id.toString()
					) {
						/* mark as not in a room and remove from viewers list*/
						socket.emit("room-data", null);
						socketUsers[viewer.socketId].inARoom = false;
						rooms[roomType][roomId].viewers = room.viewers.filter(
							(_viewer) =>
								_viewer.user._id.toString() !==
								viewer.user._id.toString()
						);
					}
				}
			}
			/* sending room data */
			for (let i = 0; i < room.players.length; ++i) {
				let user = await getUser(room.players[i].user._id);
				io.to(room.players[i].socketId).emit("room-data", {
					...rooms[roomType][roomId],
					number: room.numbers[i],
					user,
				});
			}
			for (let viewer of room.viewers) {
				let user = await getUser(viewer.user._id);
				io.to(viewer.socketId).emit("room-data", {
					...rooms[roomType][roomId],
					viewer: true,
					user,
				});
			}
			if (playerLeft) delete rooms[roomType][roomId];
			io.emit("room-list", rooms);
		}
	} catch (err) {
		console.log(err);
		logErrorMessage("leaveroom", err);
	}
};

module.exports = { createRoom, joinRoom, getRooms, leaveRoom, viewRoom };
