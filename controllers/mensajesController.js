const MensajesModel = require('../models/mensajesModel');

const mensajesController = {
  async crearMensaje(req, res) {
    try {
      const data = req.body;
      const nuevoMensaje = await MensajesModel.crear(data);
      res.status(201).json(nuevoMensaje);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerMensajes(req, res) {
    try {
      const mensajes = await MensajesModel.obtenerTodos();
      res.json(mensajes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerMensajePorId(req, res) {
    try {
      const id = req.params.id;
      const mensaje = await MensajesModel.obtenerPorId(id);
      if (!mensaje) return res.status(404).json({ error: 'Mensaje no encontrado' });
      res.json(mensaje);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarMensaje(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const actualizado = await MensajesModel.actualizar(id, data);
      if (!actualizado) return res.status(404).json({ error: 'Mensaje no encontrado para actualizar' });
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarMensaje(req, res) {
    try {
      const id = req.params.id;
      const eliminado = await MensajesModel.eliminar(id);
      if (!eliminado) return res.status(404).json({ error: 'Mensaje no encontrado para eliminar' });
      res.json({ message: 'Mensaje eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = mensajesController;
