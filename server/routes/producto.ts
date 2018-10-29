// const express = require('express');
// const { verificaToken } = require('../middlewares/autenticacion');

import express from 'express';
import { verificaToken } from '../middlewares/autenticacion';
let app = express();
// let Producto = require('../models/producto');
import Producto from '../models/producto';
// Obtener todos los productos
app.get('/productos', verificaToken, (req: any, res: any) => {
  // traer todos los productos
  // paginado
  // populate: usuario y categoria
});

// Obtener un producto por id
app.get('/productos/:id', verificaToken, (req: any, res: any) => {});

// Crear un nuevo producto
app.post('/productos', (req: any, res: any) => {
  // grabar el usuario
  // grabar una categoria del listado
});

// Actualizar el producto
app.put('/productos/:id', (req: any, res: any) => {});

app.delete('/productos/:id', (req: any, res: any) => {
  // pasar dispnible a false
});

// module.exports = app;
export default app;
