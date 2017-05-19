
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
      table.integer('age');
      table.string('tm');
      table.integer('games');
      table.integer('pa');
      table.integer('ab');
      table.integer('runs');
      table.integer('hits');
      table.integer('doubles');
      table.integer('triples');
      table.integer('homers');
      table.integer('rbi');
      table.integer('sb');
      table.integer('cs');
      table.integer('bb');
      table.integer('so');
      table.integer('ba');
      table.integer('obp');
      table.integer('slg');
      table.integer('ops');
      table.integer('ops_plus');
      table.integer('player_id').unsigned();
      table.foreign('player_id')
        .references('players.id');

      table.timestamps();
    }),

    knex.schema.createTable('pitchers', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.integer('age');
      table.string('tm');
      table.integer('wins');
      table.integer('losses');
      table.integer('era');
      table.integer('games_played');
      table.integer('games_started');
      table.integer('complete_games');
      table.integer('shutout');
      table.integer('saves');
      table.integer('ip');
      table.integer('fip');
      table.integer('whip');
      table.integer('hits_nine');
      table.integer('homeruns_nine');
      table.integer('walks_nine');
      table.integer('strikeouts_nine');
      table.integer('strikeouts_walks');
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
