const Etiqueta = require('../mongoSchemas/etiquetaSchema')
const Post = require('../mongoSchemas/postSchema')
const { mongoose } = require('../db/mongodb');

const verificarEtiquetaPorId = async(req, res, next) => {
    try {
        const id = req.params.id || req.params.etiquetaId;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: "Id inválido"});
        }
    
        const etiqueta = await Etiqueta.findById(id);
    
        if (!etiqueta) {
            return res.status(404).json({error: "Etiqueta no encontrada"});
        }
    
        req.etiqueta = etiqueta;
    
        next();
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }

}

const validarNombreEtiqueta = (req, res, next) => {
        const { nombre } = req.body;
    
        if (!nombre) {
            return res.status(400).json({error: "El nombre de la etiqueta es obligatorio."});
        }
    
        if (nombre.trim().length === 0) {
            return res.status(400).json({error: "El nombre no puede estar vacío."});
        }
        next();
}

const verificarEtiquetaExistente = async (req, res, next) => {
    try {
        const { nombre } = req.body;
    
        const etiqueta = await Etiqueta.findOne({nombre: nombre.trim()});
    
        if (etiqueta) {
            return res.status(409).json({error: `La etiqueta '${nombre}' ya existe.`});
        }
    
        next();
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}


const verificarEtiquetaYPost = async (req, res, next) => {
    try {
        const { etiquetaId, postId } = req.params;
        if (
            !mongoose.Types.ObjectId.isValid(etiquetaId) ||
            !mongoose.Types.ObjectId.isValid(postId)
        ) {
            return res.status(400).json({error: "Al menos un id es inválidos."});
        }
    
        const etiqueta = await Etiqueta.findById(etiquetaId);
        const post = await Post.findById(postId);
    
        if (!etiqueta) {
            return res.status(404).json({error: "Etiqueta no encontrada."});
        }
    
        if (!post) {
            return res.status(404).json({error: "Post no encontrado."});
        }
    
        req.etiqueta = etiqueta;
        req.post = post;
    
        next();
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const verificarEtiquetaNoAsociada = async (req, res, next) => {
    try {
        const existe = req.post.etiquetas.some(
            id => id.toString() === req.etiqueta._id.toString()
        );
    
        if (existe) {
            return res.status(409).json({error: "La etiqueta ya está asociada al post."});
        }
    
        next();
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const verificarEtiquetaAsociada = (req, res, next) => {
    try {
        const estaAsociada = req.post.etiquetas.some(
            id => id.toString() === req.etiqueta._id.toString()
        );
    
        if (!estaAsociada) {
            return res.status(404).json({error: "La etiqueta no está asociada al post."});
        }
        next();
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }


}

const verificarOCrearEtiqueta = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        let etiqueta = await Etiqueta.findOne({ nombre: nombre.trim() });

        if (!etiqueta) {

            etiqueta = await Etiqueta.create({nombre: nombre.trim()});
        }
        req.etiqueta = etiqueta;
        next();
    } catch (error) {

        return res.status(500).json({error: error.message});
    }
}


module.exports = {
    verificarEtiquetaExistente,
    verificarEtiquetaNoAsociada,
    verificarEtiquetaPorId,
    verificarEtiquetaYPost,
    validarNombreEtiqueta,
    verificarEtiquetaAsociada,
    verificarOCrearEtiqueta
}