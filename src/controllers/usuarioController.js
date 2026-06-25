const Usuario = require('../mongoSchemas/usuarioSchema');
const Post = require('../mongoSchemas/postSchema');

module.exports = {
  // Obtener todos los usuarios
  async allUsuarios(req, res) {
    try {
      const usuarios = await Usuario.find();
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los usuarios: " + error.message });
    }
  },

  // Obtener un usuario por ID
  async usuarioById(req, res) {
    try {
      const usuario = req.usuario;
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el usuario: " + error.message });
    }
  },

  // Crear un nuevo usuario (Validando unicidad de nickName)
  async crearUsuario(req, res) {
    try {
      const { nickName } = req.body;

      const nuevoUsuario = await Usuario.create({ nickName: nickName.trim() });
      return res.status(201).json(nuevoUsuario);
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el usuario: " + error.message });
    }
  },

  // Actualizar un usuario
  async actualizarUsuario(req, res) {
    try {
      const { nickName } = req.body;
      const usuario = req.usuario;

      usuario.nickName = nickName.trim();
      await usuario.save();

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar el usuario: " + error.message });
    }
  },

  // Eliminar un usuario
  async borrarUsuario(req, res) {
    try {
      const usuario = req.usuario;

      await usuario.deleteOne();
      return res.status(200).json({ message: `Usuario '${usuario.nickName}' eliminado correctamente.` });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el usuario: " + error.message });
    }
  },

 //Funciones de Red Social.

  // Seguir a un usuario
  async seguirUsuario(req, res) {
    try {

      req.seguidor.seguidos.push(req.seguido._id);

      await req.seguidor.save();

      return res.status(200).json({message: `Ahora seguís a '${req.seguido.nickName}' correctamente.`});

    } catch (error) {
      return res.status(500).json({error: "Error al seguir usuario: " + error.message});
    }
  },

  // Dejar de seguir a un usuario
  async dejarDeSeguirUsuario(req, res) {
    try {

      req.seguidor.seguidos.pull(req.seguido._id);

      await req.seguidor.save();

      return res.status(200).json({message: `Dejaste de seguir a '${req.seguido.nickName}'.`});

    } catch (error) {
      return res.status(500).json({error: "Error al dejar de seguir usuario: " + error.message});
    }
  },

  // Obtener el Feed personalizado (Publicaciones de los usuarios seguidos)
  async getFeed(req, res) {
    try {
      const usuario = req.usuario; // ya cargado por verificarUsuarioExistente

      if (usuario.seguidos.length === 0) {
        return res.status(200).json([]);
      }

      const feed = await Post.find({ usuarioId: { $in: usuario.seguidos } })
        .populate('usuarioId', 'nickName')
        .populate('imagenes')          // virtual del schema
        .populate('etiquetas')
        .sort({ fechaCreacion: -1 });

      return res.status(200).json(feed);
    } catch (error) {
      return res.status(500).json({error: "Error al cargar el feed: " + error.message});
    }
  }
};