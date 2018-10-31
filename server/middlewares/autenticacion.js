"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verificaToken = (req, res, next) => {
    let token = req.get('token');
    jsonwebtoken_1.default.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
exports.verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jsonwebtoken_1.default.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
exports.verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    }
    else {
        return res.json({
            ok: false,
            message: 'El usuario no es adminsitrador'
        });
    }
};
exports.default = { verificaToken: exports.verificaToken, verificaAdminRole: exports.verificaAdminRole, verificaTokenImg: exports.verificaTokenImg };
//# sourceMappingURL=autenticacion.js.map