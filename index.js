const express = require('express');
const cors = require('cors');
const rutas = require('./routes/rutas');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', rutas);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Firestore funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});