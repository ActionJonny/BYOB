const Nightmare = require('nightmare');
const fs = require('fs');
const util = require('util');

const nightmare = Nightmare({ show: true });

nightmare
  .viewport(1500, 1500)
  .goto('http://www.baseball-reference.com/leagues/MLB/2019-standard-fielding.shtml')
  .evaluate(() => {
    let statArr = [];
    let arr = [];
    let arrayLength = document.querySelectorAll('.full_table').length;
    for(var i = 0; i < arrayLength; i++) {
      let text = document.querySelectorAll('.full_table')[i].innerText;
      statArr.push(text.split('\t', 35));
      let object = {
        'name': statArr[i][1],
        'age': statArr[i][2],
        'tm': statArr[i][3],
        'games': statArr[i][5],
        'positions': statArr[i][21]
      };
      arr.push(object);
    }
    return arr;
  })
  .end()
  .then((result) => {
    fs.writeFileSync('playerData.js', util.inspect(result, { maxArrayLength: 1600 }));
  })
  .catch((error) => {
    fs.writeFileSync('Search failed:', error);
  });
