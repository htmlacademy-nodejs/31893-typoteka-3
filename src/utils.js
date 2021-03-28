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

  let mm = date.getMonth() + 1;
  if (mm < 10) {
    mm = `0` + mm;
  }

  let dd = date.getDate();
  if (dd < 10) {
    dd = `0` + dd;
  }

  let hh = date.getHours();
  if (hh < 10) {
    hh = `0` + hh;
  }

  let MM = date.getMinutes();
  if (MM < 10) {
    MM = `0` + MM;
  }

  let ss = date.getSeconds();
  if (ss < 10) {
    ss = `0` + ss;
  }

  return `${yyyy}-${mm}-${dd} ${hh}:${MM}:${ss}`;
};
