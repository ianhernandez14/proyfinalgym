const db = require('./conexion');

const collection = db.collection('usuarios');

const UsuariosModel = 
{
  async obtenerSiguienteId()
  {
    //Obtener todos los usuarios ordenados por ID descendente
    const snapshot = await collection.orderBy('id', 'desc').limit(1).get();
    
    if (snapshot.empty) {
      //Si no hay usuarios, empezar con ID 1
      return 1;
    }
    
    //Obtener el ID más alto y sumar 1
    const ultimoUsuario = snapshot.docs[0].data();
    const ultimoId = parseInt(ultimoUsuario.id) || 0;
    return ultimoId + 1;
  },

  async crear(usuario)
  {
    //Generar ID secuencial
    const id = await this.obtenerSiguienteId();
    
    //Agregar el ID generado al objeto usuario
    const usuarioConId = {
      id: id,
      ...usuario
    };
    
    //Guardar el documento usando el ID como documento ID en Firestore
    await collection.doc(String(id)).set(usuarioConId);
    return usuarioConId;
  },

  async obtenerTodos()
  {
    const snapshot = await collection.orderBy('id', 'asc').get();
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