const express = require('express');
const { validationResult } = require('express-validator');
const cors = require('cors');
const rutas = require('./routes/rutas');
const estadisticasRoutes = require('./routes/estadisticas');

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
const corsOptions = {
  origin: 'https://proyfinalgym.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());

//Validación
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
app.use(manejarErroresValidacion);

//Rutas
app.use('/api', rutas);
app.use('/api/estadisticas', estadisticasRoutes);

//Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Firestore funcionando');
});

//Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
