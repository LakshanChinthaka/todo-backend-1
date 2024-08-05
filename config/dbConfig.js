const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const DB_URI = process.env.DB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully..');
    } catch (err) {
        console.error("MongoDb connection error : ", err.message);
    }
};

module.exports = connectDB;
