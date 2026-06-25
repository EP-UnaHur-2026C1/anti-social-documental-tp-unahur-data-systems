const Usuario = require('../mongoSchemas/usuarioSchema');
const Post = require('../mongoSchemas/postSchema');
const Comentario = require('../mongoSchemas/comentarioSchema');
const PostImagen = require('../mongoSchemas/postImagenSchema');
const { getCachedValue, setCachedValue, clearCache } = require('../utils/cache');

module.exports = {
  // Obtener todos los usuarios
  async allUsuarios(req, res) {
    try {
      const cacheKey = 'usuarios:all';
      const cached = getCachedValue(cacheKey);

      if (cached) {
        return res.status(200).json(cached);
      }

      const usuarios = await Usuario.find().populate('seguidores', 'nickName').populate('seguidos', 'nickName');
      setCachedValue(cacheKey, usuarios, 30000);
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los usuarios: " + error.message });
    }
  },

  // Obtener un usuario por ID
  async usuarioById(req, res) {
    try {
      const usuario = await Usuario.findById(req.usuario._id).populate('seguidores', 'nickName').populate('seguidos', 'nickName');
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

      const postsDelUsuario = await Post.find({ usuarioId: usuario._id }).select('_id');
      const postIds = postsDelUsuario.map(post => post._id);

      if (postIds.length > 0) {
        await Comentario.deleteMany({ postId: { $in: postIds } });
        await PostImagen.deleteMany({ postId: { $in: postIds } });
        await Post.deleteMany({ _id: { $in: postIds } });
      }

      await Comentario.deleteMany({ usuarioId: usuario._id });

      await Usuario.updateMany(
        {},
        {
          $pull: {
            seguidos: usuario._id,
            seguidores: usuario._id
          }
        }
      );

      await usuario.deleteOne();
      clearCache();
      return res.status(200).json({ message: `Usuario '${usuario.nickName}' eliminado correctamente.` });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el usuario: " + error.message });
    }
  },

 //Funciones de Red Social.

  // Seguir a un usuario
  async seguirUsuario(req, res) {
    try {

      if (!req.seguidor.seguidos.some(id => id.toString() === req.seguido._id.toString())) {
        req.seguidor.seguidos.push(req.seguido._id);
      }

      if (!req.seguido.seguidores.some(id => id.toString() === req.seguidor._id.toString())) {
        req.seguido.seguidores.push(req.seguidor._id);
      }

      await req.seguidor.save();
      await req.seguido.save();
      clearCache();

      return res.status(200).json({message: `Ahora seguís a '${req.seguido.nickName}' correctamente.`});

    } catch (error) {
      return res.status(500).json({error: "Error al seguir usuario: " + error.message});
    }
  },

  // Dejar de seguir a un usuario
  async dejarDeSeguirUsuario(req, res) {
    try {

      req.seguidor.seguidos.pull(req.seguido._id);
      req.seguido.seguidores.pull(req.seguidor._id);

      await req.seguidor.save();
      await req.seguido.save();
      clearCache();

      return res.status(200).json({message: `Dejaste de seguir a '${req.seguido.nickName}'.`});

    } catch (error) {
      return res.status(500).json({error: "Error al dejar de seguir usuario: " + error.message});
    }
  },

  // Obtener el Feed personalizado (Publicaciones de los usuarios seguidos)
  async getFeed(req, res) {
    try {
      const usuario = req.usuario; // ya cargado por verificarUsuarioExistente

      const cacheKey = `feed:${usuario._id}`;
      const cached = getCachedValue(cacheKey);

      if (cached) {
        return res.status(200).json(cached);
      }

      if (usuario.seguidos.length === 0) {
        return res.status(200).json([]);
      }

      const feed = await Post.find({ usuarioId: { $in: usuario.seguidos } })
        .populate('usuarioId', 'nickName')
        .populate('imagenes')          // virtual del schema
        .populate('etiquetas')
        .sort({ fechaCreacion: -1 });

      setCachedValue(cacheKey, feed, 30000);

      return res.status(200).json(feed);
    } catch (error) {
      return res.status(500).json({error: "Error al cargar el feed: " + error.message});
    }
  }
};