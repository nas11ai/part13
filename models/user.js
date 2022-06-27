const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class User extends Model { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: {
      args: true,
      msg: 'Username has been taken',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your username',
      },
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your name',
      },
    },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your password',
      },
    },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user',
});

module.exports = User;
