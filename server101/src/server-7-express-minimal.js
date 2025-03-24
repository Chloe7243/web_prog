import express from 'express';
import { nextMessage } from './messages.js';

function sendMessage(req, res) {
  const message = nextMessage();
  const date = new Date().toLocaleTimeString();
  res.send(`${message} ${date}`);
}

const app = express();
app.get('/dyn1', sendMessage);
app.use(express.static('webpages'));
app.listen(8080);
