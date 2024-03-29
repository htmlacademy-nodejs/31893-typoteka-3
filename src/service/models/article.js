'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(250),
    allowNull: false
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  announce: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(250),
    allowNull: false
  },
  fullText: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000)
  },
  picture: DataTypes.STRING
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
