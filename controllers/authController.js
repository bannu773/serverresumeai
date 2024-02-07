
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");
const OtpModel = require("../models/OtpModel");
require("dotenv").config();

module.exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(200).json({
        success: false,
        message: "Please enter email",
      });
    }
    const isuser = await userModel.findOne({ email });
    if (isuser) {
      return res.status(200).json({
        success: false,
        message: "User already existed",
      });
    }
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otpsent = await OtpModel.create({ email, otp });
    return res.status(200).json({
      message: "Otp has sent successfully",
      success: true,
      otpsent,
    });
  } catch (error) {
    return res.status(200).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports.signUp = async (req, res) => {
  try {
    const { email, firstName, lastName, password, otp } = req.body;
    console.log(email,firstName,lastName,password,otp);
    if (!email || !firstName || !lastName || !password  ) {
      return res.status(200).json({
        message: "Enter all Details",
        success: false,
      });
    }
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(200).json({
        message: "User already existed",
        success: false,
      });
    }
    
    const dbotp = await OtpModel.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(dbotp[0],"dbotp");
    if (otp != dbotp[0].otp) {
      return res.status(200).json({
        message: "Invalid otp",
        success: false,
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashpassword,
    });
    return res.status(200).json({
      success: true,
      message: "Registration Successfull",
      newuser,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existuser = await userModel.findOne({ email });
    if (!existuser) {
      return res.status(200).json({
        success: false,
        message: "User Not Existed  please SignUp",
      });
    }
    const result = await bcrypt.compare(password, existuser.password);
    if (!result) {
      return res.status(200).json({
        success: false,
        message: "Password Incorrect",
      });
    }
    const token = await jwt.sign(
      {
        id: existuser._id,
        email: existuser.email,
      },
      process.env.SECRET_KEY,
      {expiresIn: '1d'}
    );
    // existuser.token = token;
    return res.status(200).cookie("token",token).json({
        success : true,
        message : "Login Successfull",
        token
    })
  } catch (error) {
    return res.status(200).json({
        success : false,
        message : error.message
    })
  }
};
