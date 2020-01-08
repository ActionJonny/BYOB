const Nightmare = require('nightmare');
const fs = require('fs');
const util = require('util');

const nightmare = Nightmare({ show: true });

nightmare
  .viewport(1500, 1500)
  .goto('http://www.baseball-reference.com/leagues/MLB/2019-standard-batting.shtml')
  .evaluate(() => {
    let statArr = [];
    let arr = [];
    let arrayLength = document.querySelectorAll('.full_table.non_qual').length;
    for(var i = 0; i < arrayLength; i++) {
      let text = document.querySelectorAll('.full_table.non_qual')[i].innerText;
      statArr.push(text.split('\t', 35));
      let object = {
        'name': statArr[i][1],
        'age': statArr[i][2],
        'tm': statArr[i][3],
        'games': statArr[i][5],
        'pa': statArr[i][6],
        'ab': statArr[i][7],
        'runs': statArr[i][8],
        'hits': statArr[i][9],
        'doubles': statArr[i][10],
        'triples': statArr[i][11],
        'homers': statArr[i][12],
        'rbi': statArr[i][13],
        'sb': statArr[i][14],
        'cs': statArr[i][15],
        'bb': statArr[i][16],
        'so': statArr[i][17],
        'ba': statArr[i][18],
        'obp': statArr[i][19],
        'slg': statArr[i][20],
        'ops': statArr[i][21],
        'ops_plus': statArr[i][22]
      };
      arr.push(object);
    }
    return arr;
  })
  .end()
  .then((result) => {
    fs.writeFileSync('testBatterData.js', util.inspect(result, { maxArrayLength: 1600 }));
  })
  .catch((error) => {
    fs.writeFileSync('Search failed:', error);
  });
