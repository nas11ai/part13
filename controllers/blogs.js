const router = require('express').Router();
const { Op } = require('sequelize');

const { Blog, User } = require('../models');
const { tokenExtractor, blogFinder } = require('../utils/middleware');

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search,
          },
        },
        {
          author: {
            [Op.substring]: req.query.search,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    order: [
      ['likes', 'DESC'],
    ],
    where,
  });

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
