const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");

require("dotenv").config();

module.exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missisng",
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.isUser = async (req, res, next) => {
  try {
    const userDetails = await userModel.findOne({ email: req.user.email });
    if (userDetails.userType !== "user") {
      return res.status(401).json({
        success: false,
        message: "this is a protected route for user",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await userModel.findOne({ email: req.user.email });
    if (userDetails.userType !== "admin") {
      return res.status(401).json({
        success: false,
        message: "this is a protected route for Admin",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
