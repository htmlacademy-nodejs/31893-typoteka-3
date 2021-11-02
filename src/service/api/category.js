'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryValidator = require(`../middlewares/category-validator`);

module.exports = async (app, categoryService) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {withCount} = req.query;
    const categories = await categoryService.findAll({withCount});
    res.status(HttpCode.OK).json(categories);
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    const category = await categoryService.create(req.body);
    return res.status(HttpCode.CREATED).json(category);
  });
};
