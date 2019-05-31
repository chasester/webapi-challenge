require('dotenv').config();



// code away!
// implement your API here
const express = require('express'); // built in node.js module to handle http traffic
//const hostname = 'localhost'; // the local computer where the server is running
const port = process.env.PORT || 5000; // a port we'll use to watch for traffic
const server = express();
const actionRoutes = require('./routes/Actions');
const projectRoutes = require('./routes/Projects');
server.use(express.json());
//server.use(logger);

server.use('/api/actions', actionRoutes);
//server.use('/api/projects', projectRoutes);

server.use('/', (req, res) => { res.send(`api is up and running <br/>${process.env.MOTD}`)});

server.listen(port, () => {
    // start watching for connections on the port specified
    console.log(`Server running at http://localhost:${port}/`);
  });

  function logger(req,res,next)
  {
    console.log(`${req.method} is being used at ${req.url} at ${Date.now()}`);
    next();
  }