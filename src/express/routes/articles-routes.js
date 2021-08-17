'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ensureArray} = require(`../../utils`);
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();

  res.render(`new-post`, {categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  res.render(`post`, {article, categories});
});

articlesRouter.post(`/add`,
    upload.single(`upload`), // применяем middleware
    async (req, res) => {
      const {body, file} = req;

      const articleData = {
        picture: file && file.filename,
        publucationDate: body.date,
        title: body.title,
        fullText: body[`full-text`],
        category: ensureArray(body.category).filter(Boolean),
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
    api.getArticle(id),
    api.getCategories()
  ]);

  res.render(`post`, {article, categories});
});

module.exports = articlesRouter;
