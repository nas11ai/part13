const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/user');

const { SECRET } = require('../utils/config');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: { username },
  });

  const passwordExists = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!(user && passwordExists)) {
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET);

  res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
