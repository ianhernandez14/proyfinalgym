const db = require("./conexion");

const collection = db.collection("formularioInscripciones");

const InscripcionesModel = {
  async crear(data) {
    const docRef = await collection.add(data);
    return { id: docRef.id, ...data };
  },

  async obtenerTodos() {
    const snapshot = await collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  async obtener(id) {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async actualizar(id, data) {
    await collection.doc(id).set(data, { merge: true });
    return { id, ...data };
  },

  async eliminar(id) {
    await collection.doc(id).delete();
    return { message: "Inscripción eliminada" };
  }
};

module.exports = InscripcionesModel;
