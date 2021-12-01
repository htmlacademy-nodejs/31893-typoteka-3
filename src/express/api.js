'use strict';

const axios = require(`axios`);

const {HttpMethod} = require(`../constants`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    try {
      const response = await this._http.request({url, ...options});
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  getArticles({offset, limit, withComments} = {}) {
    return this._load(`/articles`, {params: {offset, limit, withComments}});
  }

  // TODO вероятно понадобится такая ручка. Или надо будет обрабатывать параметр прямо в ручке /articles
  getArticlesByCategory({categoryId}) {
    return this._load(`/articles-by-category`, {params: {categoryId}});
  }

  getArticle({id, withComments}) {
    return this._load(`/articles/${id}`, {params: {withComments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories({withCount} = {}) {
    return this._load(`/categories`, {params: {withCount}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  createComment({id, data}) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createCategory({data}) {
    console.log(4444444, data);
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }
}

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
