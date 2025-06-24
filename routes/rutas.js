const express = require('express');
const router = express.Router();

const datosController = require('../controllers/usuariosController');
const mensajesController = require('../controllers/mensajesController');
const inscripcionesController = require('../controllers/inscripcionesController');
const correoController = require('../controllers/correoController');
const { validarUsuario } = require('../validations/datosValidation');
const firebaseController = require('../controllers/firebaseController');

// Rutas para usuarios
router.post('/usuarios', validarUsuario, datosController.crearUsuario);
router.get('/usuarios', datosController.obtenerUsuarios);
router.get('/usuarios/:id', datosController.obtenerUsuarioPorId);
router.put('/usuarios/:id', datosController.actualizarUsuario);
router.delete('/usuarios/:id', datosController.eliminarUsuario);

// Rutas para mensajes
router.post('/mensajes', mensajesController.crearMensaje);
router.get('/mensajes', mensajesController.obtenerMensajes);
router.get('/mensajes/:id', mensajesController.obtenerMensajePorId);
router.put('/mensajes/:id', mensajesController.actualizarMensaje);
router.delete('/mensajes/:id', mensajesController.eliminarMensaje);

//Rutas para inscripciones
router.post('/inscripciones', inscripcionesController.crear);
router.get('/inscripciones', inscripcionesController.obtenerTodas);
router.get('/inscripciones/:id', inscripcionesController.obtenerUna);
router.put('/inscripciones/:id', inscripcionesController.actualizar);
router.delete('/inscripciones/:id', inscripcionesController.eliminar);

//Ruta para enviar correo
router.post('/enviar-correo', correoController.enviarCorreo);

// Ruta para obtener todos los datos de Firebase
router.get('/firebase/:collection', firebaseController.obtenerDatos);

// Ruta para obtener el último registro
router.get('/firebase/:collection/last', firebaseController.obtenerUltimoRegistro);

module.exports = router;
