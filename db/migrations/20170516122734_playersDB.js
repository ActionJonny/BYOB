
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('players', (table) => {
      table.increments('id').primary();
      table.string('position');

      table.timestamps();
    }),

    knex.schema.createTable('batters', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('age');
      table.string('tm');
      table.string('games');
      table.string('pa');
      table.string('ab');
      table.string('runs');
      table.string('hits');
      table.string('doubles');
      table.string('triples');
      table.string('homers');
      table.string('rbi');
      table.string('sb');
      table.string('cs');
      table.string('bb');
      table.string('so');
      table.string('ba');
      table.string('obp');
      table.string('slg');
      table.string('ops');
      table.string('ops_plus');
      table.integer('player_id').unsigned();
      table.foreign('player_id')
        .references('players.id');

      table.timestamps();
    }),

    knex.schema.createTable('pitchers', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('age');
      table.string('tm');
      table.string('wins');
      table.string('losses');
      table.string('era');
      table.string('games_played');
      table.string('games_started');
      table.string('complete_games');
      table.string('shutout');
      table.string('saves');
      table.string('ip');
      table.string('fip');
      table.string('whip');
      table.string('hits_nine');
      table.string('homeruns_nine');
      table.string('walks_nine');
      table.string('strikeouts_nine');
      table.string('strikeout_walks');
      table.integer('player_id').unsigned();
      table.foreign('player_id')
        .references('players.id');

      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('batters'),
    knex.schema.dropTable('pitchers'),
    knex.schema.dropTable('players')
  ]);
};
