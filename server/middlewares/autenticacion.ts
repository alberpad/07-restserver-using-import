// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
// Verificar Token
export let verificaToken = (req: any, res: any, next: any) => {
  let token = req.get('token');
  jwt.verify(token, <string>process.env.SEED, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

// Verificar Token para imagen
export let verificaTokenImg = (req: any, res: any, next: any) => {
  let token = req.query.token;

  jwt.verify(token, <string>process.env.SEED, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'token no válido'
        }
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

//Verifica AdminRole
export let verificaAdminRole = (req: any, res: any, next: any) => {
  let usuario = req.usuario;
  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      message: 'El usuario no es adminsitrador'
    });
  }
};

export default { verificaToken, verificaAdminRole, verificaTokenImg };

//export default { verificaToken, verificaAdminRole };
// module.exports = {
//   verificaToken,
//   verificaAdminRole
// };
