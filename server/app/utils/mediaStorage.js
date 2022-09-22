const multer = require("multer");
const { unlink } = require("fs");
const ImageKit = require("imagekit");
const { readFileSync } = require("fs");

const imageKit = new ImageKit({
	publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
	privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
	urlEndpoint: process.env.IMAGE_KIT_URL,
});

const storage = multer.diskStorage({
	destination: "public/",
	filename: (req, file, cb) => {
		const type = file.mimetype.split("/");
		cb(null, `${Date.now()}.${type[1]}`);
	},
});

const storageUpload = multer({ storage: storage });

const deleteMedia = async (fileName) => {
	unlink(`./public/${fileName}`, (err) => {
		if (err) return;
	});
};

module.exports = {
	imageKit,
	storageUpload,
	deleteMedia,
};
