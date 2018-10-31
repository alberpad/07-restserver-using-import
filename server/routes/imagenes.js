"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const autenticacion_1 = require("../middlewares/autenticacion");
const app = express_1.default();
app.get('/imagen/:tipo/:img', autenticacion_1.verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs_1.default.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    }
    else {
        let noImagePath = path_1.default.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
});
exports.default = app;
//# sourceMappingURL=imagenes.js.map