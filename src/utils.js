'use strict';

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.formatDate = (date) => {
  const yyyy = date.getFullYear();

  const mm = (date.getMonth() + 1).toString().padStart(2, `0`);
  const dd = date.getDate().toString().padStart(2, `0`);
  const hh = date.getHours().toString().padStart(2, `0`);
  const MM = date.getMinutes().toString().padStart(2, `0`);
  const ss = date.getSeconds().toString().padStart(2, `0`);

  return `${yyyy}-${mm}-${dd} ${hh}:${MM}:${ss}`;
};
