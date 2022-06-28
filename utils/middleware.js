const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');
const { User } = require('../models');

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

  return next();
}

const findUser = async (req, res, next) => {
  req.user = await User.findOne({
    where: { username: req.params.username },
  });
  return next();
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  return next();
}

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not permitted' });
  }

  return next();
}

module.exports = { tokenExtractor, findUser, blogFinder, isAdmin };
