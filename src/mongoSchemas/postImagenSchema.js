const { mongoose } = require('../db/mongodb');
const { Schema, mongo, SchemaType } = require('mongoose');

const postImagenSchema = new mongoose.Schema(
    {
        url: {
            type: mongoose.Schema.Types.String,
            required: true,
            trim: true
        },

        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    {
        collection: 'postImagenes',
        timestamps: true
    }
);



const PostImagen = mongoose.model('PostImagen', postImagenSchema);
module.exports = PostImagen;