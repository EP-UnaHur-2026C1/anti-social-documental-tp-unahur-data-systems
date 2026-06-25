const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const { verificarComentarioExistente,
        validarContenido} = require('../middlewares/comentarioMiddleware')

/////////////////////////Rutas para los comentarios///////////////////////////////////

//Devuelve todos los comentarios.
router.get('/', comentarioController.allComentarios);

//Devuelve el comentario con ID otorgado.
router.get('/:comentarioId', verificarComentarioExistente,
    comentarioController.comentarioById);

//Actualiza el comentario.
router.put('/:comentarioId', verificarComentarioExistente,
    validarContenido,
    comentarioController.actualizarComentario);

//Elimina un comentario.
router.delete('/:comentarioId', verificarComentarioExistente,
    comentarioController.borrarComentario);
module.exports = router;