const db = require('./conexion');

const collection = db.collection('formularioContacto'); 

const MensajesModel = {
  async crear(data) {
    const docRef = await collection.add(data);
    return { id: docRef.id, ...data };
  },

  async obtenerTodos() {
    const snapshot = await collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async obtenerPorId(id) {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async actualizar(id, data) {
    const docRef = collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    await docRef.update(data);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  },

  async eliminar(id) {
    const docRef = collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    await docRef.delete();
    return true;
  }
};

module.exports = MensajesModel;
