const express = require('express');
const cors = require('cors');
const { validationResult } = require('express-validator');
const rutas = require('./routes/rutas');

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware para manejar errores de validación
const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ 
      mensaje: 'Datos de entrada inválidos',
      errores: errores.array() 
    });
  }
  next();
};

//Middlewares
app.use(cors());
app.use(express.json());

//Aplicar middleware de validación globalmente
app.use(manejarErroresValidacion);

//Rutas
app.use('/api', rutas);

//Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Firestore funcionando');
});

//Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});