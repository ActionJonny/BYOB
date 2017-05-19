const cityData = require('../../../cityData');
const playerData = require('../../../playerData');

exports.seed = function(knex, Promise) {
  return knex('players').del()
    .then(() => knex('teams').del())
    .then(() => {
      return Promise.all([
        knex('teams').insert(cityData),
        knex('players').insert(playerData)
      ]);
    });
};
