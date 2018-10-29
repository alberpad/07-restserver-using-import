"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const underscore_1 = __importDefault(require("underscore"));
const autenticacion_1 = require("../middlewares/autenticacion");
const categoria_1 = __importDefault(require("../models/categoria"));
let app = express_1.default();
app.get('/categoria', autenticacion_1.verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    categoria_1.default.find({}, 'descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        categoria_1.default.count({}, (err, conteo) => {
            res.json({
                ok: true,
                categorias,
                cuantos: conteo
            });
        });
    });
});
app.get('/categoria/:id', autenticacion_1.verificaToken, (req, res) => {
    let id = req.params.id;
    categoria_1.default.findById(id, {}, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
app.post('/categoria', [autenticacion_1.verificaToken], (req, res) => {
    let body = req.body;
    let categoria = new categoria_1.default({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
app.put('/categoria/:id', [autenticacion_1.verificaToken, autenticacion_1.verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = underscore_1.default.pick(req.body, ['descripcion']);
    categoria_1.default.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
app.delete('/categoria/:id', [autenticacion_1.verificaToken, autenticacion_1.verificaAdminRole], (req, res) => {
    let id = req.params.id;
    categoria_1.default.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Categoría borrada'
        });
    });
});
exports.default = app;
//# sourceMappingURL=categoria.js.map