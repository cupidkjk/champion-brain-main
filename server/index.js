require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");

const authRouter = require('./app/routers/authRouter');
const userRouter = require('./app/routers/userRouter');
const messageRouter = require('./app/routers/messageRouter');
const socketConnection = require('./app/socket');

/* central server setup */

const app = express()
const port = process.env.PORT || 10000;

/* middlewares */

app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://game-test-nu.vercel.app"
		],
		credentials: true,
		sameSite: "None",
		secure: true,
	})
);

/* mongodb database connection */

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.connection.on("error", () => {
	console.log("Error connecting to database");
});
mongoose.connection.on("open", () => {
	console.log("Connected to database");
});

/* api */

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

/* making the app listen to a port */

const server = app.listen(port, () => {
	console.log(`App listening port ${port}`);
});

/* socket */

const io = socketIo(server, {
	cors: {
		origin: ["http://localhost:3000", "https://game-test-nu.vercel.app"],
		credentials: true,
		sameSite: "None",
		secure: true,
	},
});
socketConnection(io);

module.exports = app;