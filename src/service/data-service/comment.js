'use strict';

const {nanoid} = require(`nanoid`);

const {
  MAX_ID_LENGTH
} = require(`../../constants`);

class CommentService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article, comment) {
    const newComment = {id: nanoid(MAX_ID_LENGTH), text: comment.text};
    article.comments.push(newComment);

    this._articles = this._articles.filter((item) => item.id !== article.id);
    this._articles.push(article);

    return newComment;
  }

  drop(commmentId, articleId) {
    const article = this._articles.find((item) => item.id === articleId);
    const comment = article.comments.find((item) => item.id === commmentId);

    if (!comment) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== commmentId);

    this._articles = this._articles.filter((item) => item.id !== article.id);
    this._articles.push(article);

    return comment;
  }

  findAll(articleId) {
    return this._articles.find((item) => item.id === articleId).comments;
  }
}

module.exports = CommentService;
