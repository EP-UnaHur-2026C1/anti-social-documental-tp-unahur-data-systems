const express = require("express");
const router = express.Router();

const etiquetaController = require("../controllers/etiquetaController");

const {
    verificarEtiquetaPorId,
    validarNombreEtiqueta,
    verificarEtiquetaExistente,
    verificarEtiquetaYPost,
    verificarEtiquetaNoAsociada,
    verificarEtiquetaAsociada
} = require("../middlewares/etiquetaMiddleware");

// Obtener todas las etiquetas
router.get("/", etiquetaController.allEtiquetas);

// Obtener una etiqueta por id
router.get("/:id", verificarEtiquetaPorId, etiquetaController.etiquetaById);

// Crear etiqueta
router.post("/", validarNombreEtiqueta,
                 verificarEtiquetaExistente,
                 etiquetaController.crearEtiqueta);

// Actualizar etiqueta
router.put("/:id",  verificarEtiquetaPorId,
                    validarNombreEtiqueta,
                    etiquetaController.actualizarEtiqueta);

// Eliminar etiqueta
router.delete("/:id", verificarEtiquetaPorId, etiquetaController.borrarEtiqueta);

// Asociar etiqueta a un post
// router.post("/:etiquetaId/posts/:postId", verificarEtiquetaYPost, verificarEtiquetaNoAsociada, etiquetaController.asociarPost);

// // Desasociar etiqueta de un post
// router.delete("/:etiquetaId/posts/:postId", verificarEtiquetaYPost, verificarEtiquetaAsociada, etiquetaController.desasociarPost);

// Obtener todos los posts de una etiqueta
router.get("/:etiquetaId/posts", verificarEtiquetaPorId, etiquetaController.obtenerPostsDeEtiqueta);

module.exports = router;