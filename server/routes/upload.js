"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const usuario_1 = __importDefault(require("../models/usuario"));
const producto_1 = __importDefault(require("../models/producto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(express_fileupload_1.default());
app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son ${tiposValidos}`
            }
        });
    }
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpg'];
    let archivo = req.files.archivo;
    let archivoSplit = archivo.name.split('.');
    let extension = archivoSplit[archivoSplit.length - 1];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son ${extensionesValidas}`,
                ext: extension
            }
        });
    }
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al subir el archivo'
                }
            });
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }
        else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});
function imagenUsuario(id, res, nombreArchivo) {
    usuario_1.default.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Ususario no existe'
                }
            });
        }
        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });
    });
}
function imagenProducto(id, res, nombreArchivo) {
    producto_1.default.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }
        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB) => {
            res.json({
                ok: true,
                producto: productoDB
            });
        });
    });
}
function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs_1.default.existsSync(pathImagen)) {
        fs_1.default.unlinkSync(pathImagen);
    }
}
exports.default = app;
//# sourceMappingURL=upload.js.map