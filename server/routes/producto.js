"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const autenticacion_1 = require("../middlewares/autenticacion");
let app = express_1.default();
app.get('/productos', autenticacion_1.verificaToken, (req, res) => {
});
app.get('/productos/:id', autenticacion_1.verificaToken, (req, res) => { });
app.post('/productos', (req, res) => {
});
app.put('/productos/:id', (req, res) => { });
app.delete('/productos/:id', (req, res) => {
});
exports.default = app;
//# sourceMappingURL=producto.js.map