import * as http from 'http';
import { readFile } from './files.js';
import { nextMessage } from './messages.js';

// where web pages are stored
const WEB_ROOT = 'webpages';

// send files in response to requests that match filenames
// for other requests, send 404 not found
async function sendFile(req, res) {
  const fileContents = await readFile(req, WEB_ROOT);
  if (fileContents) {
    send(res, fileContents);
  } else {
    send(res, 'not found', 404);
  }
}

// all responses go through this function
function send(res, msg = '', code = 200) {
  res.statusCode = code;
  res.end(msg);
}

// load and send the requested file
function requestHandler(req, res) {
  if (req.url === '/dyn1') return sendMessage(res);
  sendFile(req, res);
}

function sendMessage(res) {
  const message = nextMessage();
  const date = new Date().toLocaleTimeString();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(`${message} ${date}`);
  res.end();
}

const server = http.createServer(requestHandler);

// make the server available on the network
server.listen(8080);
