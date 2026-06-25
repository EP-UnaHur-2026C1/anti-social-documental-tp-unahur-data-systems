const Post = require('../mongoSchemas/postSchema');
const Etiqueta = require('../mongoSchemas/etiquetaSchema');


module.exports = {
  async allEtiquetas(req, res) {
    try {
      const etiquetas = await Etiqueta.find();
      return res.status(200).json(etiquetas);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las etiquetas: " + error.message });
    }
  },

  etiquetaById (req, res) {
    try {
      const etiqueta = req.etiqueta;
      return res.status(200).json(etiqueta)
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la etiqueta: " + error.message });
    }
  },

  async crearEtiqueta(req, res) {
    try {
      const { nombre } = req.body;

      const nuevaEtiqueta = await Etiqueta.create({ nombre: nombre.trim() });
      return res.status(201).json(nuevaEtiqueta);
    } catch (error) {
      return res.status(500).json({ error: "Error al crear la etiqueta: " + error.message });
    }
  },

  async actualizarEtiqueta(req, res) {
    try {
      const { nombre } = req.body;
      const etiqueta = req.etiqueta;

      etiqueta.nombre = nombre.trim();
      await etiqueta.save();

      return res.status(200).json(etiqueta);
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar la etiqueta: " + error.message });
    }
  },

  async borrarEtiqueta(req, res) {
    try {
      const etiqueta = req.etiqueta;

      await etiqueta.deleteOne();
      return res.status(200).json({ message: `Etiqueta '${etiqueta.nombre}' eliminada correctamente.` });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar la etiqueta: " + error.message });
    }
  },

  async obtenerPostsDeEtiqueta(req, res) {
    try {

      const posts = await Post.find({
        etiquetas: req.etiqueta._id
      })
        .populate("usuarioId")
        .populate("etiquetas");

      return res.status(200).json(posts);

    } catch (error) {

      return res.status(500).json({error: "Error al obtener los posts: " + error.message});
    }
  }
}