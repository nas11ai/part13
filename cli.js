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
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(blog.toJSON());
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.destroy({
      where: {
        id: req.params.id,
      },
    });
    console.log(deletedBlog.toJSON());
    return res.json(deletedBlog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
