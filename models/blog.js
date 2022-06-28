const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

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
    validate: {
      notNull: {
        msg: 'Please enter blog\'s title',
      },
    },
  },
  author: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter blog\'s url',
      },
    },
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1991,
      max: 2022,
    },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog',
});

module.exports = Blog;
