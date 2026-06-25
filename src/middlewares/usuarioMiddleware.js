const Usuario = require('../mongoSchemas/usuarioSchema')
const { mongoose } = require('../db/mongodb');

const validarNickName = (req, res, next) => {
    const { nickName } = req.body;

    if (!nickName || nickName.trim() === "") {
        return res.status(400).json({ error: "El campo nickName es obligatorio" });
    }
    next()
}

const verificarNickNameExistente = async (req, res, next) => {
    try {
        const { nickName } = req.body;
        const usuarioIdActual = req.params.id;

        const existeUsuario = await Usuario.findOne({nickName: nickName.trim()});

        if (existeUsuario && existeUsuario._id.toString() !== usuarioIdActual) {
            return res.status(400).json({
                error: `El nickName '${nickName}' ya se encuentra registrado`
            });
        }
        next();

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const verificarUsuarioExistente = async (req, res, next) =>{
    const id = req.params.id || req.params.usuarioId || req.body.usuarioId || req.body.id;

    if (!id) {
        return res.status(400).json({
            error: "Se requiere un id de usuario"
        });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "Id inválido"
        });
    }

    const usuario = await Usuario.findById(id);

    if (!usuario) {
        return res.status(404).json({
            error: "Usuario no encontrado"
        });
    }

    req.usuario = usuario;

    next();
}

const verificarAutoSeguimiento = (req, res, next) => {
    const { seguidorId, seguidoId } = req.body;

    if (seguidorId === seguidoId) {
        return res.status(400).json({
            error: "No podés seguirte a vos mismo."
        });
    }

    next();
}

const verificarUsuariosSeguimiento = async(req, res, next) => {
    const { seguidorId, seguidoId } = req.body;

    const seguidor = await Usuario.findById(seguidorId);
    const seguido = await Usuario.findById(seguidoId);

    if (!seguidor) {
        return res.status(404).json({
            error: "Usuario seguidor no encontrado."
        });
    }

    if (!seguido) {
        return res.status(404).json({
            error: "Usuario seguido no encontrado."
        });
    }

    req.seguidor = seguidor;
    req.seguido = seguido;

    next();
}

const verificarNoSigueUsuario = async(req, res, next) =>{
    const yaLoSigue = req.seguidor.seguidos.some(
        id => id.toString() === req.seguido._id.toString()
    );

    if (yaLoSigue) {
        return res.status(409).json({
            error: "Ya seguís a este usuario."
        });
    }

    next();
}

const verificarQueSigueAlUsuario = (req, res, next) => {

    const loSigue = req.seguidor.seguidos.some(
        id => id.toString() === req.seguido._id.toString()
    );

    if (!loSigue) {
        return res.status(400).json({
            error: "No seguís a este usuario."
        });
    }

    next();
}





module.exports = {validarNickName,
                  verificarNickNameExistente,
                  verificarUsuarioExistente,
                  verificarAutoSeguimiento,
                  verificarNoSigueUsuario,
                  verificarUsuariosSeguimiento,
                  verificarQueSigueAlUsuario};