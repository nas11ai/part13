const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { Blog, User } = require('../models');
const { SECRET } = require('../utils/config');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  return next();
}

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(auth.substring(7))
      req.decodedToken = jwt.verify(auth.substring(7), SECRET);
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: 'Token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }

  next();
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  console.log(user.toJSON());
  const blog = await Blog.create({ ...req.body, userId: user.id });
  console.log(blog.toJSON());
  return res.json(blog);
});

router.get('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).end();
  }
  console.log(req.blog.toJSON());
  return res.json(req.blog);
});

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (!req.blog) {
    return res.status(404).end();
  }

  if (user.id !== req.blog.userId) {
    return res.status(401).json({ error: 'You\'re unauthorized to delete this blog' });
  }

  console.log(req.blog.toJSON());
  await req.blog.destroy();
  return res.status(204).end();
});

router.put('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (!req.blog) {
    return res.status(404).end();
  }

  if (user.id !== req.blog.userId) {
    return res.status(401).json({ error: 'You\'re unauthorized to edit this blog' });
  }

  req.blog.likes = req.body.likes;
  await req.blog.save();
  console.log(req.blog.toJSON());
  return res.json(req.blog);
});

module.exports = router;
