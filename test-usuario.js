const axios = require('axios');

// URL del endpoint
const url = 'http://localhost:3000/api/usuarios';

// Datos de prueba para crear múltiples usuarios
const usuariosPrueba = [
  {
    email: "usuario1@example.com",
    password: "password123",
    nombre_completo: "Usuario Uno",
    tipo_usuario: "estudiante"
  },
  {
    email: "usuario2@example.com",
    password: "password123",
    nombre_completo: "Usuario Dos",
    tipo_usuario: "profesor"
  },
  {
    email: "usuario3@example.com",
    password: "password123",
    nombre_completo: "Usuario Tres",
    tipo_usuario: "admin"
  }
];

async function probarCrearUsuariosSecuenciales() {
  console.log('🧪 Probando creación de usuarios con IDs secuenciales...\n');
  
  for (let i = 0; i < usuariosPrueba.length; i++) {
    const usuario = usuariosPrueba[i];
    
    try {
      console.log(`📝 Creando usuario ${i + 1}:`, usuario.email);
      
      const response = await axios.post(url, usuario, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Usuario ${i + 1} creado exitosamente:`);
      console.log(`   ID: ${response.data.id}`);
      console.log(`   Email: ${response.data.email}`);
      console.log(`   Nombre: ${response.data.nombre_completo}`);
      console.log(`   Tipo: ${response.data.tipo_usuario}\n`);
      
    } catch (error) {
      console.log(`❌ Error al crear usuario ${i + 1}:`);
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Error:', error.response.data);
      } else {
        console.log('   Error:', error.message);
      }
      console.log('');
    }
    
    // Pequeña pausa entre creaciones
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🎯 Prueba completada. Verifica en Firebase que los IDs sean: 1, 2, 3...');
}

// Ejecutar la prueba
probarCrearUsuariosSecuenciales(); 