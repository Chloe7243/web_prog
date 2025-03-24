// use the Express.js framework https://expressjs.com/
import express from 'express';

// use our dynamic message generator seen in `server-3-dynaimc.mjs`
import { nextMessage } from './messages.js';

// handle message sending
function sendMessage(req, res) {
  const message = nextMessage();
  const date = new Date().toLocaleTimeString();
  res.send(`${message} ${date}`);
}

// create an Express.js server (aka app)
const app = express();

// connect the dyn1 route to the sendMessage function
app.get('/dyn1', sendMessage);

// use the `static` middleware to serve files from the webpages directory
app.use(express.static('webpages'));

// make the server available on the network
app.listen(8080);
