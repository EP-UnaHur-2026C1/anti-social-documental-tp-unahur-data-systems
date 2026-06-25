const { mongoose } = require('../db/mongodb');
const { Schema, mongo, SchemaType } = require('mongoose');

const comentarioSchema = new mongoose.Schema(
    {
        contenido: {
            type: Schema.Types.String,
            required: true
        },

        fechaComentario: {
            type: mongoose.Schema.Types.Date,
            default: Date.now
        },

        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    {
        collection: "comentarios",
        timestamps: true
    }
);

comentarioSchema.set("toJSON", {
    virtuals: true,
    transform: (_, ret) => {
        delete ret.__v
    }
});


comentarioSchema.virtual("visible").get(function () {

    const mesesConfigurados = Number(process.env.TIEMPO_MAX_COMENTARIO) || 6;

    const fechaLimite = new Date();

    fechaLimite.setMonth(
        fechaLimite.getMonth() - mesesConfigurados
    );

    return this.fechaComentario >= fechaLimite;
});

const Comentario = mongoose.model('Comentario', comentarioSchema);
module.exports = Comentario;