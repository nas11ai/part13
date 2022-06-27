const express = require('express');
require('express-async-errors');
const app = express();

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors')

const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorsRouter);

const main = async () => {
  await connectToDatabase;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
