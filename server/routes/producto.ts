// const express = require('express');
// const { verificaToken } = require('../middlewares/autenticacion');

import express from 'express';
import _ from 'underscore';
import { verificaToken } from '../middlewares/autenticacion';
let app = express();
// let Producto = require('../models/producto');
import Producto from '../models/producto';

//*****************************//
// Obtener todos los productos //
//*****************************//
app.get('/producto', verificaToken, (req: any, res: any) => {
  let desde: number = Number(req.query.desde) || 0;
  let limite: number = Number(req.query.limite) || 5;

  // Producto.find({ disponible: true }, 'nombre precioUni categoria disponible')

  Producto.find({ disponible: true }, 'nombre precioUni')
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .skip(desde)
    .limit(limite)
    .exec((err: any, productos: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      Producto.count({}, (err: any, conteo: any) => {
        res.json({
          ok: true,
          cuantos: `Hay ${conteo} registro/s`,
          productos
        });
      });
    });
});

//*******************************************//
// Obtener todos los productos dados de baja //
//*******************************************//
app.get('/producto/baja', verificaToken, (req: any, res: any) => {
  // let desde: number = Number(req.query.desde) || 0;
  // let limite: number = Number(req.query.limite) || 5;

  Producto.find({ disponible: false })
    // .populate('usuario', 'nombre email')
    // .populate('categoria', 'descripcion')
    // .skip(desde)
    // .limit(limite)
    .exec((err: any, productos: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      Producto.count({ disponible: false }, (err: any, conteo: any) => {
        res.json({
          ok: true,
          cuantos: `Hay ${conteo} registro/s`,
          productos
        });
      });
    });
});

// Obtener un producto por id
app.get('/producto/:id', verificaToken, (req: any, res: any) => {
  let id = req.params.id;
  Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre')
    .exec((err: any, productoDB: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err: {
            message: 'El Id no es correcto'
          }
        });
      }
      if (!productoDB || !productoDB.disponible) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'ID no existe'
          }
        });
      }
      res.json({
        ok: true,
        producto: productoDB
      });
    });
});

// Buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
  let termino = req.params.termino;
  // para una búsqueda más flexible usamos expresiones regulares
  let regex = new RegExp(termino, 'i');
  Producto.find({ nombre: regex, disponible: true })
    .populate('categoria', 'nombre')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        productos
      });
    });
});

// Crear un nuevo producto
app.post('/producto', verificaToken, (req: any, res: any) => {
  // grabar el usuario
  // grabar una categoria del listado
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    descripcion: body.descripcion,
    precioUni: body.precioUni,
    categoria: body.categoria,
    disponible: body.disponible,
    usuario: req.usuario._id
  });

  producto.save((err: any, productoDB: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    // usuarioDB.password = null;
    res.status(201).json({
      ok: true,
      producto: productoDB
    });
  });
});

// Actualizar el producto
app.put('/producto/:id', verificaToken, (req: any, res: any) => {
  let id = req.params.id;
  //la función pick de underscore permite seleccionar unos parámetros de un objeto
  //con la ventaja de que si no existe no se incluyen
  //Si fueramos a hacer esto con destructuración, los parámetros que no existieran en el objeto padre
  //serían destructurados como undefined, siempre y cuando se nombre claro
  let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
  // console.log(body);
  Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err: any, productoDB: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no existe en la BD'
        }
      });
    }
    res.json({
      ok: true,
      producto: productoDB
    });
  });
});

app.delete('/producto/:id', verificaToken, (req: any, res: any) => {
  // pasar disponible a false
  // Eliminación mediante bandera en la base de datos
  let id = req.params.id;
  let cambiaDisponible = {
    disponible: false
  };

  Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err: any, productoBorrado: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no encontrado'
        }
      });
    }
    res.json({
      ok: true,
      producto: productoBorrado
    });
  });
});

// module.exports = app;
export default app;
