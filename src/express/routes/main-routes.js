'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();
const {ARTICLES_PER_PAGE} = require(`../../constants`);

mainRouter.get(`/`, async (req, res) => {
  try {
    // получаем номер страницы
    let {page = 1} = req.query;
    page = +page;

    // количество запрашиваемых объявлений равно количеству объявлений на странице
    const limit = ARTICLES_PER_PAGE;

    // количество объявлений, которое нам нужно пропустить - это количество объявлений на предыдущих страницах
    const offset = (page - 1) * ARTICLES_PER_PAGE;

    const [
      {count, articles},
      categories
    ] = await Promise.all([
      api.getArticles({limit, offset, withComments: true}),
      api.getCategories({withCount: true})
    ]);

    // количество страниц — это общее количество объявлений, поделённое на количество объявлений на странице (с округлением вверх)
    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

    // передадим все эти данные в шаблон
    res.render(`main`, {articles, page, totalPages, categories});
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
