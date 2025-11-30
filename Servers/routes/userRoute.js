const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// user controllers
const { register, login, checkUser } = require('../controller/userController');

// register route 
router.post("/register", register);

// login user (no authMiddleware needed here)
router.post("/login", login);

// check user (requires auth)
router.get("/check", authMiddleware, checkUser);

module.exports = router;  
