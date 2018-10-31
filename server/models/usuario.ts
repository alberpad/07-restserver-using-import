// const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
};
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  password: {
    type: String,
    required: [true, 'El password es obligatoria']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

// Borramos el campo password al regresar la petición al usuario
usuarioSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

export interface IUsuarioDocument extends mongoose.Document {
  nombre: string;
  email: string;
  password: string;
  img: string;
  role: string;
  estado: boolean;
  google: boolean;
}

//module.exports = mongoose.model('Usuario', usuarioSchema);
export default mongoose.model('Usuario', usuarioSchema);
