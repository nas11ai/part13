const express = require('express');
const app = express();

const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');
const notesRouter = require('./controllers/blogs');

app.use(express.json());

app.use('/api/blogs', notesRouter);

const main = async () => {
  await connectToDatabase;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
