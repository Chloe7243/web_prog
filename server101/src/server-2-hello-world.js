import * as http from 'http';
//                     ^^^^  https://nodejs.org/api/http.html





// send "hello world" in response to requests for /hello-world.txt
// for other requests, send 404 not found
function requestHandler(req, res) {

  if (req.url === '/hello-world.txt') {
    send(res, 'Hello World!');
  } else {
    send(res, 'not found', 404);
  }
}

// all responses go through this function
function send(res, msg='', code=200) {
  res.statusCode = code;
  res.end(msg);
}

// create a server that uses our requestHandler
const server = http.createServer(requestHandler);

// make the server available on the network
server.listen(8080);
