"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Schema = mongoose_1.default.Schema;
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesaria'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
exports.default = mongoose_1.default.model('Categoria', categoriaSchema);
//# sourceMappingURL=categoria.js.map