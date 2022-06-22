require('dotenv').config({ path: '.env' });
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

class Blog extends Model { }

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog',
});

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  blogs.forEach(({ author, title, likes }) => {
    console.log(`${author}: '${title}', ${likes} likes`);
  });
  res.json(blogs);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
