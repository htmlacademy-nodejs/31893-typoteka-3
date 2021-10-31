'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const article = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Деревья`,
  `Программирование`,
  `Жиры`
];

const mockArticles = [
  {
    title: `Лучше рок-музыканты 20-века`,
    createdDate: `2021-04-04 17:02:27`,
    publicationDate: `2021-03-29 13:01:23`,
    announce: `lalal`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    categories: [
      `Деревья`,
      `Программирование`
    ],
    comments: [
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Совсем немного...`
      },
      {
        text: `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Это где ж такие красоты?`
      },
      {
        text: `Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    title: `Что такое золотое сечение`,
    createdDate: `2021-04-07 09:36:54`,
    publicationDate: `2021-03-29 13:01:23`,
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Минздрав заявил о возможности третьей волны пандемии COVID-19 в России. В Екатеринбурге рассказали о создании обложки с Анастасией Ивлеевой для Playboy. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    categories: [
      `Программирование`
    ],
    comments: [
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то? Совсем немного...`
      },
      {
        text: `Мне кажется или я уже читал это где-то?`
      },
      {
        text: `Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором!`
      }
    ]
  },
  {
    title: `Что такое золотое сечение`,
    createdDate: `2021-03-29 13:01:23`,
    publicationDate: `2021-03-29 13:01:23`,
    announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Минздрав заявил о возможности третьей волны пандемии COVID-19 в России. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов. В Екатеринбурге рассказали о создании обложки с Анастасией Ивлеевой для Playboy.`,
    categories: [
      `Жиры`
    ],
    comments: [
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        text: `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`
      },
      {
        text: `Планируете записать видосик на эту тему? Совсем немного...`
      }
    ]
  }
];

const createAPI = async () => {
  try {
    const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
    await initDB(mockDB, {categories: mockCategories, articles: mockArticles});
    const app = express();
    app.use(express.json());
    article(app, new ArticleService(mockDB), new CommentService(mockDB));
    return app;
  } catch (e) {
    return console.log(111111, e);
  }
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 3 articles`, () => expect(response.body.length).toBe(3));

  test(
      `First article's title equals "Лучше рок-музыканты 20-века"`,
      () => expect(response.body[0].title).toBe(`Лучше рок-музыканты 20-века`)
  );
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`article's title is "Лучше рок-музыканты 20-века"`, () => expect(response.body.title).toBe(`Лучше рок-музыканты 20-века`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    categories: [1],
    title: `Дам погладить котика Дам погладить котика Дам погладить котика Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф Дам погладить котика Дам погладить котика Дам погладить котика`,
    announce: `Дорого. Не гербалайф Дорого. Не гербалайф Дорого. Не гербалайф Дорого. Не гербалайф`,
    publicationDate: `2021-03-29 13:01:23`
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    categories: [1],
    title: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    publicationDate: `2021-03-29 13:01:23`,
    announce: `Дорого. Не гербалайф`
  };
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    categories: [1],
    title: `Дам погладить котика Дам погладить котика Дам погладить котика Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф Дам погладить котика Дам погладить котика Дам погладить котика`,
    announce: `Дорого. Не гербалайф Дорого. Не гербалайф Дорого. Не гербалайф Дорого. Не гербалайф`,
    publicationDate: `2021-03-29 13:01:23`
  };
  let response;

  beforeAll(async () => {
    const app = await createAPI();

    response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.text).toBe(`Updated`));
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const validArticle = {
    categories: [1],
    title: `Дам погладить котика Дам погладить котика Дам погладить котика Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф Дам погладить котика Дам погладить котика Дам погладить котика`,
    announce: `Дорого. Не гербалайф Дорого. Не гербалайф Дорого. Не гербалайф Дорого. Не гербалайф`,
    publicationDate: `2021-03-29 13:01:23`
  };

  const app = await createAPI();

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    categories: `Это`,
    title: `невалидный`,
    fullText: `объект`,
  };

  const app = await createAPI();

  return request(app)
    .put(`/articles/1`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`Deletes an article`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Success deletes an article`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);

    const responsearticles = await request(app).get(`/articles`);
    expect(responsearticles.body.length).toBe(2);
  });

  test(`API refuses to delete non-existent article`, async () => {
    return request(app)
      .delete(`/articles/NOEXST`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API returns a list of comments to given article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 comment`, () => expect(response.body.length).toBe(3));

  test(`Comment's text is "Мне кажется или я уже читал это где-то?"`,
      () => expect(response.body[1].text).toBe(`Мне кажется или я уже читал это где-то?`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этих полей`
  };
  let response; let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/2/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/2/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const invalidComment = {
    NOEXST: `Не указан text`
  };

  const app = await createAPI();

  return request(app)
    .post(`/articles/2/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`article comments count is 2 now`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/2/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
