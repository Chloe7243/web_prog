import * as http from 'http';
import { readFile } from './files.js';


// where web pages are stored
const WEB_ROOT = 'webpages';

// send files in response to requests that match filenames
// for other requests, send 404 not found
async function requestHandler(req, res) {
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

// create a server that uses our requestHandler
const server = http.createServer(requestHandler);

// make the server available on the network
server.listen(8080);
