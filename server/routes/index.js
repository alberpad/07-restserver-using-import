"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const usuario_1 = __importDefault(require("./usuario"));
const login_1 = __importDefault(require("./login"));
const categoria_1 = __importDefault(require("./categoria"));
const producto_1 = __importDefault(require("./producto"));
app.use(usuario_1.default);
app.use(login_1.default);
app.use(categoria_1.default);
app.use(producto_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map