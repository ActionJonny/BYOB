const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/players', (request, response) => {
  database('players').select()
  .then(players => {
    response.status(200).json(players);
  })
  .catch(() => {
    response.status(404).send('We cannot find the url you were looking for.');
  });
});

app.get('/api/v1/teams', (request, response) => {
  if(!request.query.team) {
    database('teams').select()
    .then(teams => {
      response.status(200).json(teams);
    })
    .catch(() => {
      response.status(404).send('We cannot find the url you were looking for.');
    });
  } else {
    database('teams').where('team', request.query.team).select('id')
    .then(team_id => {
      database('players').where('team_id', team_id[0].id).select()
      .then(players => {
        response.status(200).json(players);
      });
    });
  }
});

app.get('/api/v1/teams/:id/players', (request, response) => {
  database('players').where('team_id', request.params.id).select()
  .then(team => {
    response.status(200).json(team);
  })
  .catch(() => {
    response.status(404).send('We cannot find the data you were looking for.');
  });
});

app.get('/api/v1/teams/:id', (request, response) => {
  database('teams').where('id', request.params.id).select()
  .then(teams => {
    response.status(200).json(teams);
  })
  .catch(() => {
    response.status(404).send('We cannot find the data you were looking for.');
  });
});

app.get('/api/v1/players/:id', (request, response) => {
  database('players').where('id', request.params.id).select()
  .then(players => {
    response.status(200).json(players);
  })
  .catch(() => {
    response.status(404).send('We cannot find the url you were looking for.');
  });
});

app.post('/api/v1/teams', (request, response) => {
  database('teams').insert(request.body)
  .then(() => {
    response.status(201).json(request.body);
  })
  .catch(() => {
    response.status(422).send('You are missing some data');
  });
});

app.post('/api/v1/players', (request, response) => {
  database('players').insert(request.body)
  .then(() => {
    response.status(201).json(request.body);
  })
  .catch(() => {
    response.status(422).send('You are missing some data');
  });
});

app.patch('/api/v1/teams/:id', (request, response) => {
  database('teams').update(request.body)
  .then(() => {
    response.status(200).json(request.body);
  })
  .catch(() => {
    response.status(404).send('ID not found or invalid.');
  });
});

app.patch('/api/v1/players/:id', (request, response) => {
  database('players').update(request.body)
  .then(() => {
    response.status(200).json(request.body);
  })
  .catch(() => {
    response.status(404).send('ID not found or invalid.');
  });
});

app.delete('/api/v1/players/:id', (request, response) => {
  database('players').where('id', request.params.id).del()
  .then(() => {
    database('players').select()
    .then(player => {
      response.status(200).send(player[0].name + ' ' + 'was removed from the database');
    });
  })
  .catch(() => {
    response.status(404).send('ID was not found');
  });
});

app.delete('/api/v1/teams/:id', (request, response) => {
  database('teams').where('id', request.params.id).select()
  .then((team) => {
    if(!team.length) {
      response.status(404).send('ID was not found');
    } else {
      database('players').where('team_id', request.params.id)
      .update({ team_id: null })
      .then(() => {
        return database('teams').where('id', request.params.id).del();
      })
      .then(() => {
        response.status(200).send('your team has been removed');
      });
    }
  });
});

app.listen(app.get('port'), () => {
  (`port is running on ${app.get('port')}`);
});

module.exports = app;
