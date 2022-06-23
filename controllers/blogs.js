const router = require('express').Router();

const { Blog } = require('../models');

router.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(blog.toJSON());
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete('/api/blogs/:id', async (req, res) => {
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

module.exports = router;
