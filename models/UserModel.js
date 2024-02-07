const mongoose = require('mongoose');

const UserModel = mongoose.Schema({
    firstName:{
        type : String,
        required : true
    },
    lastName :{
        type : String,
        required : true
    },
    email :{
        type:String,
        required : true,
    },
    password :{
        type : String,
        required : true
    },
    token:{
        type : String,
    },
    resetPasswordExpires : {
        type : Date,
       
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdditionalDetails",
    },

})

const userModel = mongoose.model("userModel", UserModel);

module.exports = userModel;