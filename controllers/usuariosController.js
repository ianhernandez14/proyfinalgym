const UsuariosModel = require('../models/usuariosModel');

//Crear usuario
exports.crearUsuario = async (req, res) => {
  try {
    const usuario = req.body;
    if (!usuario.email || !usuario.nombre_completo || !usuario.password || !usuario.tipo_usuario) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios: email, nombre_completo, password, tipo_usuario.' });
    }
    const nuevoUsuario = await UsuariosModel.crear(usuario);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear usuario.', error: error.message });
  }
};

//Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuariosModel.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios.', error: error.message });
  }
};

//Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await UsuariosModel.obtenerPorId(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario.', error: error.message });
  }
};

//Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const usuarioActualizado = await UsuariosModel.actualizar(id, data);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario.', error: error.message });
  }
};

//Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    await UsuariosModel.eliminar(id);
    res.json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario.', error: error.message });
  }
};