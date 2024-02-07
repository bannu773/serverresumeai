const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        .then(()=>console.log('MongoDB Connected successfully'))
        .catch((err)=> console.log(err))
    }catch(err){
        console.log("Mongoose error while connecting to Mongo DB", err);
    }
}

 module.exports = connectDB