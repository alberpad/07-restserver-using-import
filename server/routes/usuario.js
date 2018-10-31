"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const underscore_1 = __importDefault(require("underscore"));
const usuario_1 = __importDefault(require("../models/usuario"));
const autenticacion_1 = require("../middlewares/autenticacion");
const app = express_1.default();
app.get('/usuario', autenticacion_1.verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    usuario_1.default.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        usuario_1.default.count({ estado: true }, (err, conteo) => {
            res.json({
                ok: true,
                usuarios,
                cuantos: conteo
            });
        });
    });
});
app.post('/usuario', [autenticacion_1.verificaToken, autenticacion_1.verificaAdminRole], (req, res) => {
    let body = req.body;
    let usuario = new usuario_1.default({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt_1.default.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
app.put('/usuario/:id', [autenticacion_1.verificaToken, autenticacion_1.verificaAdminRole], function (req, res) {
    let id = req.params.id;
    let body = underscore_1.default.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    console.log(body);
    usuario_1.default.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
app.delete('/usuario/:id', [autenticacion_1.verificaToken, autenticacion_1.verificaAdminRole], function (req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    usuario_1.default.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});
exports.default = app;
//# sourceMappingURL=usuario.js.map