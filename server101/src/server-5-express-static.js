// use the Express.js framework https://expressjs.com/
import express from 'express';











// create an Express.js server (aka app)
const app = express();




// use the `static` middleware to serve files from the webpages directory
app.use(express.static('webpages'));

// make the server available on the network
app.listen(8080);
