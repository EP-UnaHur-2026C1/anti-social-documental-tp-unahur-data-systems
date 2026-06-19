const { mongoose } = require('../db/mongodb');
const { Schema, mongo, SchemaType } = require('mongoose');

const etiquetaSchema = new mongoose.Schema({
    nombre: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    }
});

const Etiqueta = mongoose.model('Etiqueta', etiquetaSchema);
module.exports = Etiqueta;