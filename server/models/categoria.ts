// const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

import mongoose from 'mongoose';
// import uniqueValidator from 'mongoose-unique-validator';
// let rolesValidos = {
//   values: ['ADMIN_ROLE', 'USER_ROLE'],
//   message: '{VALUE} no es un rol válido'
// };
let Schema = mongoose.Schema;

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

// Borramos el campo password al regresar la petición al usuario
// categoriaSchema.methods.toJSON = function() {
//   let user = this;
//   let userObject = user.toObject();
//   delete userObject.password;
//   return userObject;
// };

//categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

// module.exports = mongoose.model('Categoria', categoriaSchema);
export default mongoose.model('Categoria', categoriaSchema);
