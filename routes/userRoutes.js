const express = require('express');
const { sendOtp, signUp, logIn } = require('../controllers/authController')

const { generateResetLink, resetPassword } = require("../controllers/ChangePasswprd");

const router = express.Router();

router.post("/sendotp", sendOtp)
    .post('/signup', signUp)
    .post('/login', logIn)
    .post('/resetpasswordtoken', generateResetLink)
    .post('/resetpassword/:id', resetPassword)

module.exports = router;