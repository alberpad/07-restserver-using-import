// const express = require('express');
import express from 'express';
const app = express();

// RUTAS
import usuario from './usuario';
import login from './login';
import categoria from './categoria';
import producto from './producto';

app.use(usuario);
app.use(login);
app.use(categoria);
app.use(producto);

// module.exports = app;
export default app;
