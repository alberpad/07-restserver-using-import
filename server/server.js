"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/config");
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const mongoose_1 = __importDefault(require("mongoose"));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
const index_1 = __importDefault(require("./routes/index"));
app.use(index_1.default);
mongoose_1.default.connect(process.env.MIURLDB, (err) => {
    if (err) {
        console.log('No se pudo conectar con la base de datos', err);
    }
    console.log('Base de datos ONLINE');
});
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto 3000...');
});
//# sourceMappingURL=server.js.map