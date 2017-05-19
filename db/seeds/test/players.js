exports.seed = function(knex, Promise) {
  return knex('players').del()
    .then(() => knex('teams').del())
    .then(() => {
      return Promise.all([
        knex('teams').insert({
          team: 'Turing',
          city: 'Alan',
          state: 'Bletchley Park',
          league: 'Allies',
          id: 1
        })
        .then(() => {
          return knex('players').insert([
            {
              age: '78',
              games: '99',
              name: 'Enigma',
              positions: 'P',
              team_id: 1
            },
            {
              age: '23',
              games: '45',
              name: 'Other',
              positions: '1B',
              team_id: 1
            }
          ]);
        })
      ]);
    });
};
