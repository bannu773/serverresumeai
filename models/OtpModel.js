const mongoose  =  require('mongoose');
const { sendMail } = require('../mailSender/MailSender');

const otpSchema =  new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 50, // The document will be automatically deleted after 5 minutes of its creation time
	},
})


async function sendverificationEmail(email,otp){
    try {
        const mailResponse = await sendMail(
            email,
            "Verification Email",
            otp
        )
    } catch (error) {
        console.log("Error occured while sending email:",error);
    }
}


otpSchema.pre('save',async function(next){
    if(this.isNew){
        await sendverificationEmail(this.email,this.otp)
    }
    next();
})

const OtpModel =  mongoose.model('OtpModel',otpSchema)
module.exports =  OtpModel