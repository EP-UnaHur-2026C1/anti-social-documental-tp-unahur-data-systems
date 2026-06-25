const { mongoose } = require('../db/mongodb');
const { Schema, mongo, SchemaType } = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        descripcion: {
            type: Schema.Types.String,
            required: true
        },

        fechaCreacion: {
            type: mongoose.Schema.Types.Date,
            default: Date.now
        },

        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },

        etiquetas: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Etiqueta"
        }]

    },
    {
        collection: 'posteos',
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

postSchema.virtual("imagenes", {
    ref: "PostImagen",
    localField: "_id",
    foreignField: "postId"
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;