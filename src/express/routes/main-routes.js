'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  try {
    const [articles, categories] = await Promise.all([
      api.getArticles({withComments: true}),
      api.getCategories({withCount: true})
    ]);

    res.render(`main`, {articles, categories});
  } catch (error) {
    console.log(`/ route error`, error);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search`, {
      results
    });
  } catch (error) {
    res.render(`search`, {
      results: []
    });
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  try {
    const categories = await api.getCategories();
    res.render(`all-categories`, {categories});
  } catch (error) {
    console.log(`/categories get route error`, error);
  }
});

mainRouter.post(`/categories`, async (req, res) => {
  const categoryData = {
    name: req.body.category
  };

  try {
    await api.createArticle(categoryData);
    res.redirect(`/categories`);
  } catch (error) {
    console.log(`/categories post route error`, error);
  }
});

module.exports = mainRouter;
