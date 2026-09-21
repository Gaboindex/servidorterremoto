const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Ruta de prueba para saber si el servidor responde
app.get('/', (req, res) => {
  res.send('Servidor de control de pantalla activo 🚀');
});

// Cuando alguien se conecta al servidor
io.on('connection', (socket) => {
  console.log(`Un cliente se ha conectado: ${socket.id}`);

  // Escuchar cuando el celular mande señal de iniciar transmisión
  socket.on('iniciar-transmision', (data) => {
    console.log('Señal de transmisión recibida desde el celular');
    socket.broadcast.emit('transmitir-pantalla', data);
  });

  // Escuchar cuando muevas algo en el servidor web para enviarlo al celular
  socket.on('mover-pantalla', (coordenadas) => {
    console.log('Coordenadas recibidas:', coordenadas);
    socket.broadcast.emit('ejecutar-toque', coordenadas);
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});