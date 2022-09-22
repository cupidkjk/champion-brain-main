const { Message } = require("../schema/models");

const getGlobalMessages = async (req, res) => {
	const messages = await Message.find({}).sort('dateTime').populate('from');
	return res.json({
		success: true,
		body: { message: `${messages.length} message(s) fetched`, messages },
	});
};

module.exports = {
	getGlobalMessages,
};