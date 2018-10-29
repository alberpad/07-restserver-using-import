// require('./config/config');
import './config/config';
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
//const path = require('path');
import express from 'express';
const app = express();
import mongoose from 'mongoose';
//import path from 'path';

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

// habilitar la carpeta public
//app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static('public'));

// Configuración global de rutas
import index from './routes/index';
// app.use(require('./routes/index'));
app.use(index);

// app.get('/', function(req: any, res: any) {
//   res.json('Hola Mundo');
// });

mongoose.connect(
  <string>process.env.MIURLDB,
  (err: any) => {
    if (err) {
      console.log('No se pudo conectar con la base de datos', err);
    }
    console.log('Base de datos ONLINE');
  }
);

app.listen(process.env.PORT, () => {
  console.log('Escuchando en el puerto 3000...');
});
