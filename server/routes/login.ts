// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.CLIENT_ID);
// const _ = require('underscore');
// const Usuario = require('../models/usuario');

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
import _ from 'underscore';
import Usuario from '../models/usuario';

const app = express();
app.post('/login', (req: any, res: any) => {
  let body = req.body; //aquí tenemos email y password
  Usuario.findOne({ email: body.email }, (err: any, usuarioDB: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorrectos'
        }
      });
    }
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      });
    }
    let token = jwt.sign(
      {
        usuario: usuarioDB //Esto es el payload
      },
      <string>process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );

    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    });
  });
});

// Configuraciones de Google
async function verify(token: any) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

//verify(token).catch(console.error);

app.post('/google', async (req: any, res: any) => {
  let token = req.body.idtoken;
  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      err: e
    });
  });
  Usuario.findOne({ email: googleUser.email }, (err: any, usuarioDB: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (usuarioDB) {
      if (!usuarioDB.google) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe de usar autenticación normal'
          }
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioDB //Esto es el payload
          },
          <string>process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        });
      }
    } else {
      //Si el usuario no existe en la base de datos
      let usuario = new Usuario();
      usuario.set('nombre', googleUser.nombre);
      usuario.set('email', googleUser.email);
      usuario.set('img', googleUser.img);
      usuario.set('google', true);
      usuario.set('password', ':)');

      // usuario.nombre = googleUser.nombre;
      // usuario.email = googleUser.email;
      // usuario.img = googleUser.img;
      // usuario.google = true;
      // usuario.password = ':)'; //esto es solo para pasar la validación de la BD
      usuario.save((err: any, usuarioDB: any) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
        let token = jwt.sign(
          {
            usuario: usuarioDB //Esto es el payload
          },
          <string>process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        });
      });
    }
  });
});
export default app;
//module.exports = app;
