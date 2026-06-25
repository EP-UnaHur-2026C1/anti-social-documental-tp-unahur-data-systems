const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const comentarioController = require('../controllers/comentarioController');
//Importacion de Middlewares de Post.
const { validarDescripcion,
        verificarPostExistente,
        validarPostId } = require('../middlewares/postMiddleware')

//Importacion de Middlewares de Usuario.
const { verificarUsuarioExistente } = require('../middlewares/usuarioMiddleware');

//Importacion de Middlewares de Etiqueta.
const { validarNombreEtiqueta,
        verificarEtiquetaNoAsociada,
        verificarOCrearEtiqueta,
        verificarEtiquetaPorId,
        verificarEtiquetaAsociada } = require('../middlewares/etiquetaMiddleware');

//Importacion de Middlewares de PostImagen.
const { validarUrlImagen,
        verificarImagenExistente,
        verificarImagenPerteneceAlPost } = require('../middlewares/postImagenMiddleware')

const { validarContenido } = require('../middlewares/comentarioMiddleware')
const uploadMiddleware = require('../middlewares/uploadMiddleware');



/////////////////////////////////RUTAS/////////////////////////////////////////////////

//Obtiene todos los posts.
router.get('/', postController.allPosts);

//Obtiene el post que seleccionamos con el ID.
router.get('/:postId', validarPostId, verificarPostExistente, postController.postById);

//Crea un post.
router.post('/', validarDescripcion, verificarUsuarioExistente, postController.crearPost);

//Actualizar post.
router.put('/:postId', validarPostId, verificarPostExistente, validarDescripcion, postController.actualizarPost)

//Elimina un post.
router.delete('/:postId', validarPostId, verificarPostExistente, postController.borrarPost);

//Asocia etiqueta a un post.
router.post('/:postId/etiquetas', validarPostId, verificarPostExistente,
        validarNombreEtiqueta,
        verificarOCrearEtiqueta,
        verificarEtiquetaNoAsociada,
        postController.asociarEtiqueta);

//Desasocia una etiqueta de un post
router.delete('/:postId/etiquetas/:etiquetaId', validarPostId, verificarPostExistente,
        verificarEtiquetaPorId,
        verificarEtiquetaAsociada,
        postController.desasociarEtiqueta);

//Agrega una imagen al post.
router.post('/:postId/imagenes', validarPostId, verificarPostExistente,
        validarUrlImagen,
        postController.agregarImagen);

//Obtiene todas las imagenes de un post.
router.get('/:postId/imagenes', validarPostId, verificarPostExistente,
        postController.allImagenes);

//Obtiene una imagen de un post por ID.
router.get('/:postId/imagenes/:imagenId', validarPostId,
        verificarPostExistente,
        verificarImagenExistente,
        verificarImagenPerteneceAlPost,
        postController.imagenById);

//Actualiza una imagen del post.
router.put('/:postId/imagenes/:imagenId', validarPostId,
        verificarPostExistente,
        verificarImagenExistente,
        verificarImagenPerteneceAlPost,
        validarUrlImagen,
        postController.actualizarImagen);

//Sube una imagen al servidor y la asocia al post.
router.post('/:postId/imagenes/upload', validarPostId, verificarPostExistente,
        uploadMiddleware.single('imagen'),
        postController.subirImagen);

//Eliminar una imagen del post.
router.delete('/:postId/imagenes/:imagenId', validarPostId,
        verificarPostExistente,
        verificarImagenExistente,
        verificarImagenPerteneceAlPost,
        postController.eliminarImagen);

//Crear y aagregar un comentario a un post.
router.post('/:postId/comentarios', validarPostId, verificarPostExistente,
        validarContenido,
        verificarUsuarioExistente,
        comentarioController.crearComentario);

module.exports = router;