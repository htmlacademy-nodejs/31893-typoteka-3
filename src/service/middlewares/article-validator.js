'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [`categories`, `title`, `announce`, `publicationDate`];
const TextLimit = {
  MAX: 250,
  MIN: 30,
  FULL_TEXT_MAX: 1000
};

const isValidTextLength = (text, min = 0, max = Infinity) => {
  const textLength = text.length;
  return textLength > min && textLength < max;
};

const isCategoriesEmpty = (categories) => {
  return !(categories && categories.length);
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
    isCategoriesEmpty(newArticle.categories)
  ) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
