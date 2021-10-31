'use strict';

const {HttpCode} = require(`../../constants`);

const categoryKeys = [`name`];

module.exports = (req, res, next) => {
  const category = req.body;
  const keys = Object.keys(category);
  const keysExists = categoryKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
