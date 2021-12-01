'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);

    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll({withComments}) {
    const options = {
      include: [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `ASC`]
      ]
    };

    if (withComments) {
      options.include.push(Aliase.COMMENTS);
      options.order.push([
        {model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`
      ]);
    }

    let articles = await this._Article.findAll(options);

    if (withComments) {
      articles = articles.filter((article) => article.comments.length > 0);
    }

    return articles;
  }

  async findOne({articleId, withComments}) {
    const options = {
      include: [
        Aliase.CATEGORIES
      ],
      where: {
        id: articleId
      }
    };

    if (withComments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS
      });

      options.order = [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ];
    }

    return await this._Article.findOne(options);
  }

  async findPage({limit, offset, withComments}) {
    const options = {
      limit,
      offset,
      include: [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    };

    if (withComments) {
      options.include.push(Aliase.COMMENTS);
      options.order.push([
        {model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`
      ]);
    }

    const {count, rows} = await this._Article.findAndCountAll(options);

    return {count, articles: rows};
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });

    return !!affectedRows;
  }
}

module.exports = ArticleService;
