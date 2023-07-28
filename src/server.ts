const dotenv = require('dotenv');
dotenv.config();

import { createServer } from 'http';
import mongoConnect from './db/mongoose';
import app from './app';
import Startup from './models/Startup';

const server = createServer(app);

mongoConnect()
  .then(() => {
    console.log('Mongoose connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server listening at ${PORT}`));
  })
  .catch((err: Error) =>
    console.log('Did not start up server: Mongoose failed to connect: ', err)
  );
