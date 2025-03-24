// listen on port 8080 and log all incoming data
// to the console so the HTTP request can be seen
import * as net from 'net';
import { log } from 'console';

const server = net.createServer((socket) => {
  socket.on('data', data => log(data.toString()));
  socket.end();
});

server.listen(8080);