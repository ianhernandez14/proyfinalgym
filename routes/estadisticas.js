const express = require('express');
const router = express.Router();
const db = require('./models/conexion');

router.get('/inscripciones-por-actividad', async (req, res) => {
  try {
    const snapshot = await db.collection('inscripciones').get();
    const conteo = {};

    snapshot.forEach(doc => {
      const actividad = doc.data().actividad || 'Desconocida';
      conteo[actividad] = (conteo[actividad] || 0) + 1;
    });

    res.json(conteo);
  } catch (error) {
    console.error('Error al contar inscripciones por actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
