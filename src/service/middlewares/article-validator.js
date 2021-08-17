'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [`category`, `title`, `announce`, `publucationDate`];
const TextLimit = {
  MAX: 250,
  MIN: 30,
  FULL_TEXT_MAX: 1000
};

const isValidTextLength = (text, min = 0, max = Infinity) => {
  const textLength = text.length;
  return textLength > min && textLength < max;
};

const isCategoryEmpty = (category) => {
  return !(category && category.length);
};

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (
    !keysExists ||
    !isValidTextLength(newArticle.title, TextLimit.MIN, TextLimit.MAX) ||
    !isValidTextLength(newArticle.announce, TextLimit.MIN, TextLimit.MAX) ||
    !isValidTextLength(newArticle.fullText, 0, TextLimit.FULL_TEXT_MAX) ||
    isCategoryEmpty(newArticle.category)
  ) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
