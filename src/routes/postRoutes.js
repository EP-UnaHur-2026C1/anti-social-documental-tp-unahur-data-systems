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



/////////////////////////////////RUTAS/////////////////////////////////////////////////

//Obtiene todos los posts.
router.get('/', postController.allPosts);

//Obtiene el post que seleccionamos con el ID.
router.get('/:postId', validarPostId, verificarPostExistente, postController.postById);

//Crea un post.
router.post('/', validarDescripcion, verificarUsuarioExistente, postController.crearPost);

//Actualizar post.
router.put('/:postId', verificarPostExistente, validarDescripcion, postController.actualizarPost)

//Elimina un post.
router.delete('/:postId', validarPostId, verificarPostExistente, postController.borrarPost);

//Asocia etiqueta a un post.
router.post("/:postId/etiquetas", verificarPostExistente,
        validarNombreEtiqueta,
        verificarOCrearEtiqueta,
        verificarEtiquetaNoAsociada,
        postController.asociarEtiqueta);

//Desaocia una etiqueta de un post
router.delete("/:postId/etiquetas/:etiquetaId", verificarPostExistente,
        verificarEtiquetaPorId,
        verificarEtiquetaAsociada,
        postController.desasociarEtiqueta);

//Agrega una imagen al post.
router.post('/:postId/imagenes', verificarPostExistente,
        validarUrlImagen,
        postController.agregarImagen);

//Eliminar una imagen del post.
router.delete('/:postId/imagenes/:imagenId', validarPostId,
        verificarPostExistente,
        verificarImagenExistente,
        verificarImagenPerteneceAlPost,
        postController.eliminarImagen);

//Crear y aagregar un comentario a un post.
router.post('/:postId/comentarios', verificarPostExistente,
        validarContenido,
        verificarUsuarioExistente,
        comentarioController.crearComentario);

module.exports = router;