import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { verificaTokenImg } from '../middlewares/autenticacion';

const app: express.Application = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req: Request, res: Response) => {
  let tipo = req.params.tipo;
  let img = req.params.img;
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    res.sendFile(noImagePath);
  }
});

export default app;
