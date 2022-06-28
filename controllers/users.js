const bcrypt = require('bcrypt');
const router = require('express').Router();

const { User, Blog } = require('../models');
const { tokenExtractor, findUser, isAdmin } = require('../utils/middleware');


router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    }
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({ username, name, passwordHash });
  res.json(user);
});

router.put('/:username', tokenExtractor, findUser, isAdmin, async (req, res) => {
  if (!req.user) {
    return res.status(404).end();
  }

  req.user.username = req.body.username;
  await req.user.save();
  return res.json(req.user);
});

module.exports = router;
