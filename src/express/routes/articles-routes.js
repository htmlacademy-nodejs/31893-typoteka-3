'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ensureArray} = require(`../../utils`);
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id: categoryId} = req.params;
  const [articles, categories] = await Promise.all([
    api.getArticles({withComments: true}),
    api.getCategories({withCount: false})
  ]);

  res.render(`articles-by-category`, {
    categories,
    articles,
    categoryId: Number(categoryId)
  });
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories({withCount: false});

  res.render(`new-post`, {categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle({id, withComments: false}),
    api.getCategories({withCount: false})
  ]);

  res.render(`post`, {article, categories});
});

articlesRouter.post(`/add`,
    upload.single(`upload`), // применяем middleware
    async (req, res) => {
      const {body, file} = req;

      const articleData = {
        picture: file && file.filename,
        publicationDate: body.date,
        title: body.title,
        fullText: body[`full-text`],
        categories: ensureArray(body.category).filter(Boolean),
        announce: body.announcement,
      };

      try {
        await api.createArticle(articleData);
        res.redirect(`/my`);
      } catch (e) {
        res.redirect(`back`);
      }
    }
);

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle({id, withComments: true}),
    api.getCategories({withCount: true})
  ]);

  res.render(`post`, {article, categories});
});

articlesRouter.post(`/:articleId/comments`, async (req, res) => {
  const {articleId} = req.params;
  const {comment} = req.body;

  const commentData = {
    text: comment
  };

  try {
    await api.createComment({id: articleId, data: commentData});
    res.redirect(`/articles/${articleId}`);
  } catch (errors) {
    throw errors;
  }
});

module.exports = articlesRouter;
