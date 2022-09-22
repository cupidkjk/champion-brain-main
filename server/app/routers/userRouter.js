const { Router } = require("express");
const { uploadProfilePicture, getAllUsers, updateUser, makeAdmin } = require("../controllers/userController");
const { verifyAccessToken, verifyAdmin } = require("../utils/auth");
const { storageUpload } = require("../utils/mediaStorage");

const router = Router();

router.get("/getAllUsers", getAllUsers);
router.put('/uploadProfilePicture/:_id', verifyAccessToken, storageUpload.single("profilePicture"), uploadProfilePicture);
router.put('/updateUser/:_id', verifyAccessToken, updateUser);
router.put('/makeAdmin', verifyAccessToken, makeAdmin);

module.exports = router;