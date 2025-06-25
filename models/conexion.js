require('dotenv').config(); // Cargar variables de entorno

const admin = require('firebase-admin');

// Convertir el contenido del JSON desde una variable de entorno
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

const db = admin.firestore();

module.exports = db;