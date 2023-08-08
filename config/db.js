const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to mongodb database ${mongoose.connection.host}`.bgMagenta.white);
    }catch(error){
        console.log(`MongoDB Database error ${error}`.bgRed.white);
    }
}

module.exports = connectDB