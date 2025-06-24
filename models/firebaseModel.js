const { get } = require("../routes/rutas");
const db = require("./conexion");

// Función para obtener el último registro de una colección
const getLastRecordFromFirebase = async (collectionName) => {
  try {
    // Como fechaInscripcion es string, obtenemos todos y ordenamos en código
    const snapshot = await db.collection(collectionName).get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    // Ordenar por fechaInscripcion (string) de forma descendente
    const sortedData = data.sort((a, b) => {
      // Convertir strings de fecha a Date objects para comparación correcta
      const dateA = new Date(a.fechaInscripcion);
      const dateB = new Date(b.fechaInscripcion);
      return dateB.getTime() - dateA.getTime();
    });
    
    return sortedData[0]; // Retornar el más reciente
  } catch (error) {
    console.error('Error getting last record:', error);
    throw error;
  }
};

// Función original para obtener todos los datos (mantener si la necesitas)
const getDataFromFirebase = async (collectionName) => {
  const snapshot = await db.collection(collectionName).get();
  const data = [];
  snapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};

module.exports = { getDataFromFirebase, getLastRecordFromFirebase };