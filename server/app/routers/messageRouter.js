const { Router } = require("express");
const { getGlobalMessages } = require("../controllers/messageController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.get('/getGlobalMessages', verifyAccessToken, getGlobalMessages);

module.exports = router;