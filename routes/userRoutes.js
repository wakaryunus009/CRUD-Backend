const express = require('express');
const { register, login, profile, updateProfile, deleteProfile } = require('../Controllers/userController');
const { isAuthenticated } = require('../middlewares/authentication');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", isAuthenticated, profile);
router.put("/update", isAuthenticated, updateProfile);
router.delete("/delete", isAuthenticated, deleteProfile);


module.exports = router;