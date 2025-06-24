const { getDataFromFirebase, getLastRecordFromFirebase } = require('../models/firebaseModel');

// Controlador para obtener datos de Firebase
const obtenerDatos = async (req, res) => {
  const { collection } = req.params;
  try {
    const data = await getDataFromFirebase(collection);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
    res.status(500).json({ error: 'Error fetching data from Firebase' });
  }
};

// Controlador para obtener el último registro
const obtenerUltimoRegistro = async (req, res) => {
  const { collection } = req.params;
  try {
    const lastRecord = await getLastRecordFromFirebase(collection);
    if (!lastRecord) {
      return res.status(404).json({ message: 'No records found' });
    }
    res.status(200).json(lastRecord);
  } catch (error) {
    console.error('Error fetching last record from Firebase:', error);
    res.status(500).json({ error: 'Error fetching last record from Firebase' });
  }
};

module.exports = { obtenerDatos, obtenerUltimoRegistro };