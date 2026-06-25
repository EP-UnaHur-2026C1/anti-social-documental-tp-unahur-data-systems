const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://admin:admin123@localhost:27017/antisocial?authSource=admin'

let isConnected = false;

const connectToDatabase = async() => {
    if(!isConnected){
        await mongoose.connect(MONGO_URL);
        console.log("Conexion con Mongo con Exito!");
        isConnected = true;
    }
}

module.exports = { mongoose, connectToDatabase };