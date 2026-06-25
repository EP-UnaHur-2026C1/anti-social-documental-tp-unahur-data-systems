const PostImagen = require('../mongoSchemas/postImagenSchema')
const { mongoose } = require('../db/mongodb');

const validarUrlImagen = (req, res, next) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "La URL es obligatoria." });
    }

    if (typeof url !== "string") {
        return res.status(400).json({ error: "La URL debe ser texto." });
    }
    next();
}
const verificarImagenExistente = async(req, res, next) => {
    try {
        const { imagenId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(imagenId)) {
            return res.status(400).json({ error: "ID de imagen inválido." });
        }

        const imagen = await PostImagen.findById(imagenId);

        if (!imagen) {
            return res.status(404).json({ error: "Imagen no encontrada." });
        }

        req.imagen = imagen;
        next();

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
const verificarImagenPerteneceAlPost = (req, res, next) => {
    if (req.imagen.postId.toString() !== req.post._id.toString()) {

        return res.status(400).json({ error: "La imagen no pertenece al post indicado." });

    }
    next();
}

module.exports = {
    validarUrlImagen,
    verificarImagenPerteneceAlPost,
    verificarImagenExistente
}