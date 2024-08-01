const mongoose = require('mongoose');

const connectionDB = async () =>{
    try{
        db = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected Database Successfully...");
    } catch (error) {
     console.log(error);
    }
}

module.exports = connectionDB;