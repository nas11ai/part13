const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

const main = async () => {
  await connectToDatabase;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
