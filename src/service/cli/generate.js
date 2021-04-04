'use strict';
const chalk = require(`chalk`);
const path = require(`path`);

const {
  FILE_NAME,
} = require(`../../constants`);

const {
  getRandomInt,
  shuffle,
  formatDate
} = require(`../../utils`);
const fs = require(`fs`).promises;

const FILE_SENTENCES_PATH = `../../../data/sentences.txt`;
const FILE_TITLES_PATH = `../../../data/titles.txt`;
const FILE_CATEGORIES_PATH = `../../../data/categories.txt`;

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

const generatePublications = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getCreatedDate(),
    announce: shuffle(sentences).slice(getRandomInt(0, 5), 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(0, sentences.length - 1)).join(` `),
    category: [categories[getRandomInt(0, categories.length - 1)]],
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || MOCKS_COUNT.DEFAULT;

    if (countPublications > MOCKS_COUNT.MAX) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(1);
    }

    const content = JSON.stringify(generatePublications(countPublications, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
