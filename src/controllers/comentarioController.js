const Comentario = require('../mongoSchemas/comentarioSchema');

module.exports = {
    async allComentarios(req, res) {
        try {
            const comentarios = await Comentario.find()
                .populate("usuarioId", "nickName")
                .populate("postId");

            return res.status(200).json(comentarios);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    async comentarioById(req, res) {
        try {
            return res.status(200).json(req.comentario);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    async crearComentario(req, res) {
        try {
            const comentario = await Comentario.create({
                contenido: req.body.contenido.trim(),
                usuarioId: req.usuario._id,
                postId: req.post._id
            });
            return res.status(201).json(comentario);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    async actualizarComentario(req, res) {
        try {
            req.comentario.contenido = req.body.contenido;
            await req.comentario.save();

            return res.status(200).json(req.comentario);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    async borrarComentario(req, res) {
        try {
            await req.comentario.deleteOne();
 
            return res.status(200).json({message:"Comentario eliminado correctamente."});

        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}