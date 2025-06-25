const InscripcionesModel = require("../models/inscripcionesModel");
const db = require('../firebase');

const inscripcionesController = {
  async getInscripcionesPorActividad(req, res) {
    try {
     const snapshot = await db.collection('formularioInscripciones').get();

      const conteo = {};

      snapshot.forEach(doc => {
        const actividad = doc.data().activity;
        if (actividad) {
          conteo[actividad] = (conteo[actividad] || 0) + 1;
        }
      });

      res.json(conteo);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      res.status(500).json({ error: 'Error al obtener datos' });
    }
  },

  async crear(req, res) {
    try {
      const data = req.body;
      const nueva = await InscripcionesModel.crear(data);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerTodas(req, res) {
    try {
      const inscripciones = await InscripcionesModel.obtenerTodos();
      res.json(inscripciones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerUna(req, res) {
    try {
      const { id } = req.params;
      const inscripcion = await InscripcionesModel.obtener(id);
      if (!inscripcion) {
        return res.status(404).json({ error: "Inscripción no encontrada" });
      }
      res.json(inscripcion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const actualizada = await InscripcionesModel.actualizar(id, data);
      res.json(actualizada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await InscripcionesModel.eliminar(id);
      res.json({ message: "Inscripción eliminada" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = inscripcionesController;