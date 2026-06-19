const express = require('express');
const router = express.Router();

const { verificarNickNameExistente,
        verificarUsuarioExistente, 
        validarNickName, 
        verificarAutoSeguimiento,
        verificarNoSigueUsuario,
        verificarUsuariosSeguimiento,
        verificarQueSigueAlUsuario } = require('../middlewares/usuarioMiddleware')

const usuarioController = require('../controllers/usuarioController');

//Rutas del CRUD
router.get('/', usuarioController.allUsuarios);
router.get('/:id', verificarUsuarioExistente, usuarioController.usuarioById);
router.post('/', validarNickName, verificarNickNameExistente, usuarioController.crearUsuario);
router.put('/:id',validarNickName, verificarNickNameExistente, verificarUsuarioExistente, usuarioController.actualizarUsuario);
router.delete('/:id', verificarUsuarioExistente, usuarioController.borrarUsuario);


//Rutas de la Red Social
// Seguir a un usuario (Recibe seguidorId y seguidoId en el body)
router.post('/seguir', verificarAutoSeguimiento, verificarUsuariosSeguimiento, verificarNoSigueUsuario,usuarioController.seguirUsuario);

// Dejar de seguir a un usuario (Recibe seguidorId y seguidoId en el body)
router.post('/dejar-seguir', verificarAutoSeguimiento, verificarUsuariosSeguimiento, verificarQueSigueAlUsuario, usuarioController.dejarDeSeguirUsuario);

// Obtener el Feed personalizado de un usuario por su ID
router.get('/:id/feed', verificarUsuarioExistente, usuarioController.getFeed);

module.exports = router;