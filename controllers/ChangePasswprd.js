
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const userModel = require("../models/UserModel");
const { sendMail } = require("../mailSender/MailSender");

module.exports.generateResetLink = async (req, res) => {
  try {
    const { email } = req.body;
    const existuser = await userModel.findOne({ email });
    if (!existuser) {
      return res.status(200).json({
        success: false,
        message: "user  not existed",
      });
    }
    const salt = crypto.randomBytes(10).toString("hex");
    const url = `http://localhost:8080/api/v1/resetpassword/${salt}`;
    const message = `Reset your password link`;
    await userModel.findOneAndUpdate(
      { email },
      { token: salt, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }
    );

    await sendMail(email, message,url);
    return res.status(200).json({
      success: true,
      message: "reset mail sent successfull",
      url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const {email, password, confirmpassword } = req.body;
    if (!email || !password || !confirmpassword ) {
      return res.status(200).json({
        success: false,
        message: "All feilds are required ",
      });
    }
    
    if (password !== confirmpassword) {
      return res.status(200).json({
        success: false,
        message: "password and confirm password must  be equal",
      });
    }
    console.log("hello");
    const user = await userModel.findOne({ email });
    if (Date.now() > user.resetPasswordExpires) {
      return res.status(200).json({
        success: false,
        message: "Link is expired ",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { password: hashPassword },
      { new: true }
    );
    return res.status(500).json({
      success: true,
      message: "password haas been changed successfull",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
