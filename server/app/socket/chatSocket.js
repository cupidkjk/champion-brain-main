const { Message } = require("../schema/models");

const sendGlobalMessage = async (io, socket, socketUsers, body) => {
	const {text} = body;
	/* sending message only if user has a socket entry */
	if (socketUsers[socket.id]) {
		let message = new Message({
			from: socketUsers[socket.id].user._id,
			private: false,
			dateTime: new Date(),
			text,
		});
		message = await message.save();
		/* populate the from field which is a reference to the user schema */
		const _message = await Message.findById(message._id).populate(
			"from"
		);
		io.emit("global-message", _message);
	}
};

module.exports = {sendGlobalMessage};