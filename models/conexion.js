require('dotenv').config(); //Cargar variables de entorno

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS))
});

const db = admin.firestore();

module.exports = db;