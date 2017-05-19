
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('teams', (table) => {
      table.increments('id').primary();
      table.string('team').notNullable();
      table.string('city').notNullable();
      table.string('state').notNullable();
      table.string('league').notNullable();

      table.timestamps(true, true);
    }),
    knex.schema.createTable('players', (table) => {
      table.increments('id').primary();
      table.string('age').notNullable();
      table.string('games').notNullable();
      table.string('name').notNullable();
      table.string('positions').notNullable();
      table.integer('team_id').unsigned();
      table.foreign('team_id')
        .references('teams.id');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('players'),
    knex.schema.dropTable('teams')
  ]);
};
