"use strict";
process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.CADUCIDAD_TOKEN = '30d';
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cursonode-restserver';
}
else {
    urlDB = process.env.MONGO_URI;
}
process.env.MIURLDB = urlDB;
process.env.CLIENT_ID =
    process.env.CLIENT_ID || '789858548935-mh6bhth29599lpq8pmfq5e5p0lpnurk2.apps.googleusercontent.com';
//# sourceMappingURL=config.js.map