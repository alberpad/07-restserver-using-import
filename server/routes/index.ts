// const express = require('express');
import express from 'express';
const app = express();

// RUTAS
import usuario from './usuario';
import login from './login';
import categoria from './categoria';
import producto from './producto';
import upload from './upload';
import imagen from './imagenes';

app.use(usuario);
app.use(login);
app.use(categoria);
app.use(producto);
app.use(upload);
app.use(imagen);

// module.exports = app;
export default app;
