const Nightmare = require('nightmare');
const fs = require('fs');
const util = require('util');

const nightmare = Nightmare({ show: true });

nightmare
  .viewport(1500, 1500)
  .goto('http://www.baseball-reference.com/leagues/MLB/2016-standard-pitching.shtml')
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
        'wins': statArr[i][5],
        'losses': statArr[i][6],
        'era': statArr[i][8],
        'games_played': statArr[i][9],
        'games_started': statArr[i][10],
        'complete_games': statArr[i][12],
        'shutout': statArr[i][13],
        'saves': statArr[i][14],
        'ip': statArr[i][15],
        'fip': statArr[i][28],
        'whip': statArr[i][29],
        'hits_nine': statArr[i][30],
        'homeruns_nine': statArr[i][31],
        'walks_nine': statArr[i][32],
        'strikeouts_nine': statArr[i][33],
        'strikeout_walks': statArr[i][34]
      };
      arr.push(object);
    }
    return arr;
  })
  .end()
  .then((result) => {
    fs.writeFileSync('testPitchersData.js', util.inspect(result, { maxArrayLength: 1207 }));
  })
  .catch((error) => {
    fs.writeFileSync('Search failed:', error);
  });
