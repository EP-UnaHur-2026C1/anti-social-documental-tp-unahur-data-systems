const { mongoose } = require('../db/mongodb');
const { Schema } = require('mongoose');

const usuarioSchema = new mongoose.Schema(
    {
        nickName: {
            type: Schema.Types.String,
            required: [true, "El nickName es obligatorio!"],
            unique: true,
            trim: true
        },
        seguidos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        }],
        seguidores: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        }]
    },
    {
        collection: 'usuarios',
        timestamps: true
    }
);

usuarioSchema.set("toJSON", {
    transform: (_, ret) => {
        delete ret.__v
        delete ret._id
    }
})

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;