const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://root:example@localhost:27017/libros?authSource=admin'

let isConnected

const connectToDatabase = async() => {
    if(!isConnected){
        await mongoose.connect(MONGO_URL);
        console.log("Conexion con Mongo con Exito!");
        isConnected = true;
    }
}

module.exports = { mongoose, connectToDatabase }