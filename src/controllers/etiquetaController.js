const { Usuario, Post } = require('../mongoSchemas');
const Etiqueta = require('../mongoSchemas/etiquetaSchema');

const { verificarEtiquetaPorId } = require('../middlewares/etiquetaMiddleware')

module.exports={
    async allEtiquetas(req, res) {
    try {
      const etiquetas = await Etiqueta.find();
      return res.status(200).json(etiquetas);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las etiquetas: " + error.message });
    }
  },

    async etiquetaById(req, res){
        try {
            const etiqueta = req.etiqueta;
        } catch (error) {
            
        }
    }
}