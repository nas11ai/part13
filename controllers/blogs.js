const router = require('express').Router();

const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  return next();
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(blog.toJSON());
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).end();
  }
  console.log(req.blog.toJSON());
  return res.json(req.blog);
});

router.delete('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).end();
  }
  console.log(req.blog.toJSON());
  await req.blog.destroy();
  return res.status(204).end();
});

router.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).end();
  }
  req.blog.likes = req.body.likes;
  await req.blog.save();
  console.log(req.blog.toJSON());
  return res.json(req.blog);
});

module.exports = router;
