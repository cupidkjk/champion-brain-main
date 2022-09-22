const { Router } = require("express");
const {
	signup,
	refresh,
	login,
	logout,
} = require("../controllers/authController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", verifyAccessToken, refresh);

router.post("/logout", verifyAccessToken, logout);

module.exports = router;