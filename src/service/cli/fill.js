'use strict';
const chalk = require(`chalk`);
const path = require(`path`);

const {
  getRandomInt,
  shuffle,
  formatDate
} = require(`../../utils`);
const fs = require(`fs`).promises;

const FILE_SENTENCES_PATH = `../../../data/sentences.txt`;
const FILE_TITLES_PATH = `../../../data/titles.txt`;
const FILE_CATEGORIES_PATH = `../../../data/categories.txt`;
const FILE_COMMENTS_PATH = `../../../data/comments.txt`;

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  }, {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const MOCKS_COUNT = {
  DEFAULT: 1,
  MAX: 1000,
};

const COMMENTS_COUNT = {
  MIN: 2,
  MAX: 4,
};

const PICTIRE_RESTRICT = {
  MIN: 1,
  MAX: 9,
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(path.join(__dirname, filePath), `utf8`);
    return content.split(`\n`).filter((item) => item.trim() !== ``);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getPictureFileName = (pictureNumber) => {
  if (pictureNumber < 10) {
    pictureNumber = `0${pictureNumber}`;
  }
  return `item${pictureNumber}.jpg`;
};

const getCreatedDate = () => {
  const createDate = new Date();

  createDate.setDate(createDate.getDate() - getRandomInt(0, 90));
  createDate.setHours(getRandomInt(0, 24), getRandomInt(0, 60), getRandomInt(0, 60));

  return formatDate(createDate);
};

const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, categories, sentences, comments, userCount) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    publicationDate: getCreatedDate(),
    createdDate: getCreatedDate(),
    announce: shuffle(sentences).slice(getRandomInt(1, 5), 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
    picture: getPictureFileName(getRandomInt(PICTIRE_RESTRICT.MIN, PICTIRE_RESTRICT.MAX)),
    category: [getRandomInt(1, categories.length)],
    comments: generateComments(getRandomInt(COMMENTS_COUNT.MIN, COMMENTS_COUNT.MAX), index + 1, userCount, comments),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || MOCKS_COUNT.DEFAULT;

    if (countArticles > MOCKS_COUNT.MAX) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(1);
    }

    const articles = generateArticles(countArticles, titles, categories, sentences, commentSentences, users.length);
    const comments = articles.flatMap((article) => article.comments);
    const articlesCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

    const userValues = users.map(({email, passwordHash, firstName, lastName, avatar}) =>
      `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(({title, publicationDate, announce, fullText, picture, userId}) =>
      `('${title}', '${publicationDate}', '${announce}', '${fullText}', '${picture}', ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articlesCategories.map(({articleId, categoryId}) =>
      `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(({text, userId, articleId}) =>
      `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const content = `
      INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
      ${userValues};
      INSERT INTO categories(name) VALUES
      ${categoryValues};
      ALTER TABLE articles DISABLE TRIGGER ALL;
      INSERT INTO articles(title, publication_date, announce, full_text, picture, user_id) VALUES
      ${articleValues};
      ALTER TABLE articles ENABLE TRIGGER ALL;
      ALTER TABLE articles_categories DISABLE TRIGGER ALL;
      INSERT INTO articles_categories(article_id, category_id) VALUES
      ${articleCategoryValues};
      ALTER TABLE articles_categories ENABLE TRIGGER ALL;
      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO COMMENTS(text, user_id, article_id) VALUES
      ${commentValues};
      ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(`fill-db.sql`, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
