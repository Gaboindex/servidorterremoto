const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Esto le dice a Express que sirva los archivos estáticos (como tu index.html)
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Ruta principal que carga tu index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Cuando alguien se conecta al servidor (ya sea la app o la web)
io.on('connection', (socket) => {
  console.log(`Un cliente se ha conectado: ${socket.id}`);

  // Escuchar cuando el celular mande el fotograma de la pantalla y reenviarlo a la web
  socket.on('frame-pantalla', (bytesImagen) => {
    socket.broadcast.emit('frame-pantalla', bytesImagen);
  });

  // Escuchar cuando des clic en los botones del panel web para enviarlo al celular
  socket.on('comando-remoto', (data) => {
    console.log('Comando remoto recibido:', data);
    socket.broadcast.emit('comando-remoto', data);
  });

  // NUEVO: Escuchar clics/toques desde la web para reenviarlos al celular
  socket.on('control-tactil', (data) => {
    console.log('Comando táctil recibido desde la web:', data);
    socket.broadcast.emit('control-tactil', data);
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
