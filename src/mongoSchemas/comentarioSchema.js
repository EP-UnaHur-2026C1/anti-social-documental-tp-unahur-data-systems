const { mongoose } = require('../db/mongodb');
const { Schema, mongo, SchemaType } = require('mongoose');

const comentarioSchema = new mongoose.Schema(
    {
        contenido: {
            type: Schema.Types.String,
            require: true
        },

        fechaComentario: {
            type: mongoose.Schema.Types.Date,
            default: Date.now
        },

        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            require: true
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            require: true
        }
    },
);

comentarioSchema.set("toJSON", {
    virtuals: true,
    transform: (_,ret)=>{
        delete ret.__v
        delete ret._id
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