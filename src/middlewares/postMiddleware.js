const Post = require('../mongoSchemas/postSchema')
const { mongoose } = require('../db/mongodb');


const validarDescripcion = (req, res, next) => {

    const { descripcion } = req.body;

    if (!descripcion || descripcion.trim() === "") {
        return res.status(400).json({
            error: "La descripción es obligatoria."
        });
    }

    next();
}


const verificarPostExistente = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post no encontrado." });
        }
        req.post = post;

        next();

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
}

const validarPostId = async (req, res, next) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({
            error: "ID de post inválido."
        });
    }
    next();
}

module.exports = {
    verificarPostExistente,
    validarDescripcion,
    validarPostId,

}