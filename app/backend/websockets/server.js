const io = require('socket.io')();
// const cors = require("cors");

// app.use(cors());

const PORT = process.env.PORT || 5000;

let marcador_info = {};

io.on('connect', (socket) => {
  let room;
  let view;

  socket.on('join', (data) => {
    room = data.room;
    view = data.view;
    const { token } = data;

    if (view === 'marcador') {
      marcador_info[room] = { token, id: socket.id };
    } else {
      if (marcador_info.hasOwnProperty(room)) {
        io.to(marcador_info[room].id).emit('new spectator');
      } else {
        io.to(socket.id).emit('no marcador');
      }
    }

    socket.join(room);
  });

  socket.on('check if marcador in room', (info, callback) => {
    const { room, token } = info;

    const bool =
      !marcador_info.hasOwnProperty(room) ||
      marcador_info[room].token === token;

    if (marcador_info.hasOwnProperty(room)) {
      console.log(
        marcador_info[room].token,
        token,
        marcador_info.hasOwnProperty(room),
        marcador_info[room].token === token,
        !marcador_info.hasOwnProperty(room) ||
          marcador_info[room].token === token
      );
    }

    callback(bool);
  });

  socket.on('full battle info | server', (info) => {
    socket.broadcast.to(room).emit('full battle info | scoreboard', info);
  });

  socket.on('update | server', ({ cor, act, value }) => {
    if (cor) {
      socket.volatile.broadcast
        .to(room)
        .emit(`update | scoreboard | ${cor} | ${act.description}`, {
          act,
          value,
        });
    } else if (!cor) {
      const { running, goldenscore } = act;
      socket.volatile.broadcast
        .to(room)
        .emit('update | scoreboard | clock', { value, running, goldenscore });
    }
  });

  socket.on('disconnecta', () => {
    if (view === 'marcador') {
      if (
        marcador_info.hasOwnProperty(room) &&
        marcador_info[room].id === socket.id
      ) {
        delete marcador_info[room];
      }
    }
  });
});

io.listen(PORT);
