// const express = require('express');
// const _ = require('underscore');

import express, { Request, Response } from 'express';
import _ from 'underscore';

// let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
// let Categoria = require('../models/categoria');

import { verificaToken, verificaAdminRole } from '../middlewares/autenticacion';
import Categoria, { ICategoriaDocument } from '../models/categoria';

let app = express();

// Mostrar todas las categorías
app.get('/categoria', verificaToken, (req: Request, res: Response) => {
  let desde: number = Number(req.query.desde) || 0;
  let limite: number = Number(req.query.limite) || 5;

  Categoria.find({}, 'descripcion')
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .skip(desde)
    .limit(limite)
    .exec((err: any, categorias: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      Categoria.count({}, (err: any, conteo: any) => {
        res.json({
          ok: true,
          categorias,
          cuantos: conteo
        });
      });
    });
});

// Mostrar una categoría por ID
app.get('/categoria/:id', verificaToken, (req: Request, res: Response) => {
  let id = req.params.id;
  Categoria.findById(id, {}, (err: any, categoriaDB: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'El Id no es correcto'
        }
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// Crear nueva categoría
app.post('/categoria', [verificaToken], (req: Request, res: Response) => {
  //regresa la nueva categoria
  //req.usuario._id
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: (<any>req).usuario._id
  });

  categoria.save((err: any, categoriaDB: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    // usuarioDB.password = null;
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// Actualizar el nombre de la categoría
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req: any, res: any) => {
  let id = req.params.id;
  //la función pick de underscore permite seleccionar unos parámetros de un objeto
  //con la ventaja de que si no existe no se incluyen
  //Si fueramos a hacer esto con destructuración, los parámetros que no existieran en el objeto padre
  //serían destructurados como undefined, siempre y cuando se nombre claro
  let body = _.pick(req.body, ['descripcion']);
  // console.log(body);
  Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err: any, categoriaDB: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// Eliminar una categoría
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req: any, res: any) => {
  // solo un administrador puede borrar categorias
  // CAtegoria.findByIdAndRemove
  let id = req.params.id;
  Categoria.findByIdAndRemove(id, (err: any, categoriaBorrada: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaBorrada) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Categoría no encontrada'
        }
      });
    }
    res.json({
      ok: true,
      categoria: categoriaBorrada,
      message: 'Categoría borrada'
    });
  });
});

// module.exports = app;
export default app;
