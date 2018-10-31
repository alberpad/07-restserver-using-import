// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
let productoSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
  descripcion: { type: String, required: false },
  img: { type: String, required: false },
  disponible: { type: Boolean, required: true, default: true },
  categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

export interface IProductoDocument extends mongoose.Document {
  nombre: string;
  precioUni: Number;
  descripcion: string;
  img: string;
  categoria: mongoose.Schema.Types.ObjectId;
  usuario: mongoose.Schema.Types.ObjectId;
  disponible: boolean;
}

// module.exports = mongoose.model('Producto', productoSchema);
export default mongoose.model('Producto', productoSchema);
