'use strict';
const chalk = require(`chalk`);
const path = require(`path`);
const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);

const logger = getLogger({name: `api`});

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

const PICTIRE_NAMES = [
  `skyscraper`,
  `sea`,
  `forest`
];

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(path.join(__dirname, filePath), `utf8`);
    return content.split(`\n`).filter((item) => item.trim() !== ``);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getPictureFileName = () => {
  const pictureName = PICTIRE_NAMES[getRandomInt(0, PICTIRE_NAMES.length - 1)];

  return `${pictureName}@2x.jpg`;
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
      .join(` `)
  }))
);

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateArticles = (count, titles, categories, sentences, comments, userCount) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    publicationDate: getCreatedDate(),
    createdDate: getCreatedDate(),
    announce: shuffle(sentences).slice(getRandomInt(1, 5), 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
    picture: getPictureFileName(),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(COMMENTS_COUNT.MIN, COMMENTS_COUNT.MAX), index + 1, userCount, comments),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

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

    const articles = generateArticles(
        countArticles,
        titles,
        categories,
        sentences,
        commentSentences,
        users.length
    );

    return initDatabase(sequelize, {articles, categories});
  }
};
