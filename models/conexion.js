const admin = require('firebase-admin');

const serviceAccount = require('../../proyfinalgym-firebase-adminsdk-fbsvc-f628cf0077.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

module.exports = db;