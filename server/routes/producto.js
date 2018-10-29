"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const underscore_1 = __importDefault(require("underscore"));
const autenticacion_1 = require("../middlewares/autenticacion");
let app = express_1.default();
const producto_1 = __importDefault(require("../models/producto"));
app.get('/producto', autenticacion_1.verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    producto_1.default.find({ disponible: true }, 'nombre precioUni')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        producto_1.default.count({}, (err, conteo) => {
            res.json({
                ok: true,
                cuantos: `Hay ${conteo} registro/s`,
                productos
            });
        });
    });
});
app.get('/producto/baja', autenticacion_1.verificaToken, (req, res) => {
    producto_1.default.find({ disponible: false })
        .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        producto_1.default.count({ disponible: false }, (err, conteo) => {
            res.json({
                ok: true,
                cuantos: `Hay ${conteo} registro/s`,
                productos
            });
        });
    });
});
app.get('/producto/:id', autenticacion_1.verificaToken, (req, res) => {
    let id = req.params.id;
    producto_1.default.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }
        if (!productoDB || !productoDB.disponible) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
app.get('/producto/buscar/:termino', autenticacion_1.verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    producto_1.default.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos
        });
    });
});
app.post('/producto', autenticacion_1.verificaToken, (req, res) => {
    let body = req.body;
    let producto = new producto_1.default({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});
app.put('/producto/:id', autenticacion_1.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = underscore_1.default.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    producto_1.default.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe en la BD'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
app.delete('/producto/:id', autenticacion_1.verificaToken, (req, res) => {
    let id = req.params.id;
    let cambiaDisponible = {
        disponible: false
    };
    producto_1.default.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});
exports.default = app;
//# sourceMappingURL=producto.js.map