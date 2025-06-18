const db = require('./conexion');

const collection = db.collection('usuarios');

const UsuariosModel = 
{
  async crear(usuario)
  {
    //usuario debe tener: id, email, nombre_completo, password, tipo_usuario
    //Usamos el campo 'id' como ID del documento en Firestore
    await collection.doc(String(usuario.id)).set(usuario);
    return usuario;
  },

  async obtenerTodos()
  {
    const snapshot = await collection.get();
    return snapshot.docs.map(doc => doc.data());
  },

  async obtenerPorId(id)
  {
    const doc = await collection.doc(String(id)).get();
    if (!doc.exists) return null;
    return doc.data();
  },

  async actualizar(id, data)
  {
    await collection.doc(String(id)).update(data);
    const doc = await collection.doc(String(id)).get();
    return doc.data();
  },

  async eliminar(id)
  {
    await collection.doc(String(id)).delete();
    return { id };
  }
};

module.exports = UsuariosModel;