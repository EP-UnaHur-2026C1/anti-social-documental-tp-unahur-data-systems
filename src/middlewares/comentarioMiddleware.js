const Comentario = require('../mongoSchemas/comentarioSchema')
const { mongoose } = require('../db/mongodb');


const validarContenido = (req, res, next) => {
    const { contenido } = req.body;

    if (!contenido) {
        return res.status(400).json({ error: "El contenido es obligatorio." });
    }

    if (typeof contenido !== "string") {
        return res.status(400).json({ error: "El contenido debe ser texto." });
    }

    if (!contenido.trim()) {
        return res.status(400).json({ error: "El contenido no puede estar vacío." });
    }

    next();
}
const verificarComentarioExistente = async(req, res, next) => {
    try {
        const { comentarioId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(comentarioId)) {
            return res.status(400).json({ error: "ID de comentario inválido." });
        }

        const comentario = await Comentario.findById(comentarioId);

        if (!comentario) {
            return res.status(404).json({ error: "Comentario no encontrado." });
        }

        req.comentario = comentario;

        next();
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

module.exports = { validarContenido, verificarComentarioExistente }