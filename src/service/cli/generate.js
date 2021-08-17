'use strict';
const chalk = require(`chalk`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {
  FILE_NAME,
  MAX_ID_LENGTH
} = require(`../../constants`);

const {
  getRandomInt,
  shuffle,
  formatDate
} = require(`../../utils`);
const fs = require(`fs`).promises;

const MAX_COMMENTS = 4;
const FILE_SENTENCES_PATH = `../../../data/sentences.txt`;
const FILE_TITLES_PATH = `../../../data/titles.txt`;
const FILE_CATEGORIES_PATH = `../../../data/categories.txt`;
const FILE_COMMENTS_PATH = `../../../data/comments.txt`;

const MOCKS_COUNT = {
  DEFAULT: 1,
  MAX: 1000,
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

const getCreatedDate = () => {
  const createDate = new Date();

  createDate.setDate(createDate.getDate() - getRandomInt(0, 90));
  createDate.setHours(getRandomInt(0, 24), getRandomInt(0, 60), getRandomInt(0, 60));

  return formatDate(createDate);
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePublications = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    publicationDate: getCreatedDate(),
    createdDate: getCreatedDate(),
    announce: shuffle(sentences).slice(getRandomInt(0, 5), 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(0, sentences.length - 1)).join(` `),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || MOCKS_COUNT.DEFAULT;

    if (countPublications > MOCKS_COUNT.MAX) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(1);
    }

    const content = JSON.stringify(generatePublications(countPublications, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
