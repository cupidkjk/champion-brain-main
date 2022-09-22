const cookie = require("cookie");
const { verifySocket } = require("../utils/auth");
const { User } = require("../schema/models");
const { sendGlobalMessage } = require("./chatSocket");
const {
	createRoom,
	joinRoom,
	getRooms,
	leaveRoom,
	viewRoom,
} = require("./gameJoinSocket");
const { setNumber, makeGuess } = require("./gamePlaySocket");
const { roomTypes } = require("../utils/data");
const { logErrorMessage, getUser, updateStats } = require("../utils/utils");

const socketUsers = {}; /* stores every connected socket mapped to the user */
/* rooms mapped with the format : rooms[roomType][roomId] */
const rooms = {
	3: {},
	4: {},
	5: {},
};

const socketConnection = (io) => {
	io.on("connection", async (socket) => {
		/* on connection to the socket, validate the user by the access token */
		/* and then add to the socket mapping */
		const accessToken = cookie.parse(
			socket.handshake.headers.cookie || ""
		).accessToken;
		if (accessToken) {
			let user = verifySocket(accessToken);
			user = await User.findById(user._id).exec();
			socketUsers[socket.id] = {
				socketId: socket.id,
				user,
				inARoom: false,
			};
		}

		socket.on("disconnect", async () => {
			try {
				/* going through all rooms */
				for (let roomType of roomTypes) {
					for (let room of Object.values(rooms[roomType])) {
						/* checking if a player has left or a viewer */
						let playerLeft = false;
						for (let player of room.players) {
							if (
								player.user._id.toString() ===
								socketUsers[socket.id]?.user._id.toString()
							) {
								playerLeft = true;
								break;
							}
						}
						if (playerLeft) {
							for (let i = 0; i < room.players.length; ++i) {
								/* if a player has left, mark all room players as not in the room */
								if (socketUsers[room.players[i].socketId])
									socketUsers[
										room.players[i].socketId
									].inARoom = false;
								/* announce the other player as winner if there is one */
								if (
									room.players[i].user._id.toString() ===
									socketUsers[socket.id]?.user._id.toString()
								) {
									const winner =
										room.players[i === 0 ? 1 : 0];
									rooms[roomType][room.id].winner = winner;
									/* update stats if not updated already */
									if (
										!room.gameOver &&
										room.playerCount === 2 &&
										winner
									)
										await updateStats(
											room,
											winner.user._id
										);
									/* the same function may run for multiple users
									so it is important to make these checks
								 */
								}
							}
							/* room ends */
							rooms[roomType][room.id].gameOver = true;
							/* send data to all players and viewers */
							for (let i = 0; i < room.players.length; ++i) {
								const user = await getUser(
									room.players[i].user._id
								);
								io.to(room.players[i].socketId).emit(
									"room-data",
									{
										...rooms[roomType][room.id],
										user,
									}
								);
							}
							for (let viewer of room.viewers) {
								const user = await getUser(viewer.user._id);
								/* mark the viewers as not in a room too */
								socketUsers[viewer.socketId].inARoom = false;
								io.to(viewer.socketId).emit("room-data", {
									...rooms[roomType][room.id],
									viewer: true,
									user,
								});
							}
							io.emit("room-list", rooms);
							socketUsers[socket.id] = null;
							delete rooms[roomType][room.id];
							/* at the end, delete the room and socket entry */
							return;
						}
						/* if the disconnected user is not a player
							below part will run
					 	*/
						for (let viewer of room.viewers) {
							/* finding which viewer has left */
							if (
								viewer.user._id ===
								socketUsers[socket.id].user._id
							) {
								/* deleting socket entry */
								socketUsers[socket.id] = null;
								/* removing viewer from viewers list */
								rooms[roomType][room.id].viewers = rooms[
									roomType
								][room.id].viewers.filter(
									(_viewer) =>
										_viewer.user._id !== viewer.user._id
								);
								/* sending the room data back */
								for (let i = 0; i < room.players.length; ++i) {
									io.to(room.players[i].socketId).emit(
										"room-data",
										rooms[roomType][room.id]
									);
								}
								for (let _viewer of room.viewers) {
									socketUsers[
										_viewer.socketid
									].inARoom = false;
									io.to(_viewer.socketId).emit("room-data", {
										...rooms[roomType][room.id],
										viewer: true,
									});
								}
								return;
							}
						}
					}
				}
			} catch (err) {
				logErrorMessage("disconnect", err);
			}
		});

		socket.on("global-message", (text) =>
			sendGlobalMessage(io, socket, socketUsers, { text })
		);

		socket.on("create-room", (roomType) =>
			createRoom(io, socket, socketUsers, rooms, { roomType })
		);
		socket.on("join-room", (body) =>
			joinRoom(io, socket, socketUsers, rooms, body)
		);
		socket.on("view-room", (body) => {
			viewRoom(io, socket, socketUsers, rooms, body);
		});
		socket.on("leave-room", (body) =>
			leaveRoom(io, socket, socketUsers, rooms, body)
		);

		socket.on("get-rooms", () => getRooms(io, socket, socketUsers, rooms));

		socket.on("set-number", (body) =>
			setNumber(io, socket, socketUsers, rooms, body)
		);
		socket.on("make-guess", (body) =>
			makeGuess(io, socket, socketUsers, rooms, body)
		);
	});
};

module.exports = socketConnection;
