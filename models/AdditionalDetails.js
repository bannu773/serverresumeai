const mongoose =  require('mongoose')

const additionaldetails  = new mongoose.Schema({
    gender : String,

    mobileNumber : String,

    dob  : String,

})
const AdditionalDetails = mongoose.model('AdditionalDetails',additionaldetails)
module.exports = AdditionalDetails