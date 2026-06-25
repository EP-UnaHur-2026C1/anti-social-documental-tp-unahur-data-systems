const PostImagen = require('../mongoSchemas/postImagenSchema');
const Post = require('../mongoSchemas/postSchema');
const Comentario = require('../mongoSchemas/comentarioSchema');


module.exports = {

  async allPosts(req, res) {
    try {
      const posts = await Post.find()
        .populate("usuarioId", "nickName")
        .populate("etiquetas")
        .populate("imagenes")
        .sort({ createdAt: -1 });

      return res.status(200).json(posts);

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async postById(req, res) {
    try {
      const post = await Post.findById(req.post._id)
        .populate("usuarioId", "nickName")
        .populate("etiquetas")
        .populate("imagenes");

      const comentarios = await Comentario.find({ postId: post._id })
        .populate("usuarioId", "nickName");

      const comentariosVisibles = comentarios.filter(comentario => comentario.visible);

      return res.status(200).json({ ...post.toObject(), comentarios: comentariosVisibles });
    } catch (error) {

      return res.status(500).json({ error: error.message });
    }
  },



  async crearPost(req, res) {
    try {
      const nuevoPost = await Post.create({
        descripcion: req.body.descripcion,
        usuarioId: req.usuario._id
      });

      return res.status(201).json(nuevoPost);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async actualizarPost(req, res) {
    try {
      req.post.descripcion = req.body.descripcion.trim();
      await req.post.save();

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: error.message });

    }
  },

  async borrarPost(req, res) {
    try {
      await Comentario.deleteMany({ postId: req.post._id });

      await PostImagen.deleteMany({ postId: req.post._id });

      await req.post.deleteOne();

      return res.status(200).json({ message: "Post eliminado correctamente." });
    } catch (error) {
      return res.status(500).json({
        error: error.message
      });

    }
  },


  async agregarImagen(req, res) {
    try {
      const nuevaImagen = await PostImagen.create({
        url: req.body.url,
        postId: req.post._id
      });

      return res.status(201).json(nuevaImagen);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async eliminarImagen(req, res) {
    try {
      await req.imagen.deleteOne();
      return res.status(200).json({ message: "Imagen eliminada correctamente." });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },


  async asociarEtiqueta(req, res) {
    try {
      req.post.etiquetas.push(req.etiqueta._id);

      await req.post.save();

      return res.status(200).json({
        message: `La etiqueta '${req.etiqueta.nombre}' fue asociada correctamente al post.`,
        post: req.post
      });

    } catch (error) {

      return res.status(500).json({ error: "Error al asociar la etiqueta al post: " + error.message });

    }
  },
  async desasociarEtiqueta(req, res) {
    try {

      req.post.etiquetas.pull(req.etiqueta._id);

      await req.post.save();

      return res.status(200).json({
        message: `La etiqueta '${req.etiqueta.nombre}' fue desasociada correctamente del post.`,
        post: req.post
      });

    } catch (error) {
      return res.status(500).json({ error: "Error al desasociar la etiqueta del post: " + error.message });

    }
  },
}