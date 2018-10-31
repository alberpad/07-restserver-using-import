import express, { Request, Response } from 'express';
import fileUpload, { FileArray, UploadedFile } from 'express-fileupload';
import Usuario, { IUsuarioDocument } from '../models/usuario';
import Producto, { IProductoDocument } from '../models/producto';
import fs from 'fs';
import path from 'path';

const app: express.Application = express();

// Middleware fileUpload con default options
// Al invocar fileUpload() todos los archivos que se carguen iran a req.files
app.use(fileUpload());
app.put('/upload/:tipo/:id', (req: Request, res: Response) => {
  let tipo: string = req.params.tipo;
  let id: string = req.params.id;
  if (Object.keys(<FileArray>req.files).length == 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha seleccionado ningún archivo'
      }
    });
  }
  // Valida tipos
  let tiposValidos: string[] = ['productos', 'usuarios'];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Los tipos permitidos son ${tiposValidos}`
      }
    });
  }

  // Extensiones permitidas
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpg'];

  let archivo: UploadedFile | UploadedFile[] = (<FileArray>req.files).archivo;
  let archivoSplit: string[] = (<UploadedFile>archivo).name.split('.');
  let extension: string = archivoSplit[archivoSplit.length - 1];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Las extensiones permitidas son ${extensionesValidas}`,
        ext: extension
      }
    });
  }

  // Cambiar nombre al archivo
  let nombreArchivo: string = `${id}-${new Date().getMilliseconds()}.${extension}`;
  // Subimos el archivo
  (<UploadedFile>archivo).mv(`uploads/${tipo}/${nombreArchivo}`, (err: any) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'Error al subir el archivo'
        }
      });
    }
    // Aquí la imagen ya está cargada
    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }
  });
});

function imagenUsuario(id: string, res: express.Response, nombreArchivo: string) {
  Usuario.findById(id, (err, usuarioDB: IUsuarioDocument) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Ususario no existe'
        }
      });
    }
    borrarArchivo(usuarioDB.img, 'usuarios');
    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioDB) => {
      res.json({
        ok: true,
        usuario: usuarioDB
        //img: nombreArchivo
      });
    });
  });
}

function imagenProducto(id: string, res: express.Response, nombreArchivo: string) {
  Producto.findById(id, (err, productoDB: IProductoDocument) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      borrarArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existe'
        }
      });
    }
    borrarArchivo(productoDB.img, 'productos');
    productoDB.img = nombreArchivo;
    productoDB.save((err, productoDB) => {
      res.json({
        ok: true,
        producto: productoDB
        //img: nombreArchivo
      });
    });
  });
}

function borrarArchivo(nombreImagen: string, tipo: string) {
  // Comprueba si ya hay una imagen en el servidor y si la hay la borra
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

export default app;
