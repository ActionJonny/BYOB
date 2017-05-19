process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();
const chaiHttp = require('chai-http');

const server = require('../server.js');

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('BYOB', () => {
  beforeEach((done) => {
    database.migrate.latest()
    .then(() => {
      return database.seed.run();
    })
    .then(() => {
      done();
    });
  });

  afterEach((done) => {
    database.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('GET', () => {

    it('GET should find teams in the database', (done) => {
      chai.request(server)
      .get('/api/v1/teams')
      .end((err, response) => {
        response.should.have.status(200);
        response.body[0].id.should.equal(1);
        response.body[0].team.should.equal('Turing');
        response.body[0].city.should.equal('Alan');
        response.body[0].state.should.equal('Bletchley Park');
        response.body[0].league.should.equal('Allies');
        done();
      });
    });

    it('GET should not find a team url', (done) => {
      chai.request(server)
      .get('/api/v1/team')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });

    it('GET should return all players if they pass in a teams query name', (done) => {
      chai.request(server)
      .get('/api/v1/teams?team=Turing')
      .end((err, response) => {
        response.body.length.should.equal(2);
        response.body[0].name.should.equal('Enigma');
        response.body[1].name.should.equal('Other');
        done();
      });
    });

    it('GET should return an individual team', (done) => {
      chai.request(server)
      .get('/api/v1/teams/1')
      .end((err, response) => {
        response.body[0].id.should.equal(1);
        response.body[0].team.should.equal('Turing');
        response.body[0].city.should.equal('Alan');
        response.body[0].state.should.equal('Bletchley Park');
        response.body[0].league.should.equal('Allies');
        done();
      });
    });

    it('GET should not find a team that does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/teams/hello')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });

    it('GET should be able to look up every player on his team', (done) => {
      chai.request(server)
      .get('/api/v1/teams/1/players')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(2);
        response.body[0].id.should.equal(1);
        response.body[1].id.should.equal(2);
        done();
      });
    });

    it('GET should not find a player that does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/teams/1/thing')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });

    it('GET should return all players in the database', (done) => {
      chai.request(server)
      .get('/api/v1/players')
      .end((err, response) => {
        response.should.have.status(200);
        response.body[0].id.should.equal(1);
        response.body[0].age.should.equal('78');
        response.body[0].games.should.equal('99');
        response.body[0].name.should.equal('Enigma');
        response.body[0].positions.should.equal('P');
        response.body[0].team_id.should.equal(1);
        done();
      });
    });

    it('GET should not find the players database', (done) => {
      chai.request(server)
      .get('/api/v1/player')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });

    it('GET should return individual players', (done) => {
      chai.request(server)
      .get('/api/v1/players/1')
      .end((err, response) => {
        response.should.have.status(200);
        response.body[0].id.should.equal(1);
        response.body[0].age.should.equal('78');
        response.body[0].games.should.equal('99');
        response.body[0].name.should.equal('Enigma');
        response.body[0].positions.should.equal('P');
        response.body[0].team_id.should.equal(1);
        done();
      });
    });

    it('GET should return individual players', (done) => {
      chai.request(server)
      .get('/api/v1/players/4/4')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe('POST', () => {

    it('POST should be able to create a new team', (done) => {
      chai.request(server)
      .post('/api/v1/teams')
      .send({
        team: 'team name',
        city: 'some city',
        state: 'some state',
        league: 'another league',
        id: 2
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.id.should.equal(2);
        response.body.team.should.equal('team name');
        response.body.city.should.equal('some city');
        response.body.state.should.equal('some state');
        response.body.league.should.equal('another league');
        done();
      });
    });

    it('POST should not be allowed to post a team that does not have all the information filled in', (done) => {
      chai.request(server)
      .post('/api/v1/teams')
      .send({
        team: 'team name',
        city: 'some city',
        state: 'some state',
        id: 2
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.text.should.equal('You are missing some data');
        done();
      });
    });

    it('POST should be able to add players to the database', (done) => {
      chai.request(server)
      .post('/api/v1/players')
      .send({
        age: '45',
        games: '2333',
        name: 'Malachi Constant',
        positions: 'Martian',
        team_id: 1
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.age.should.equal('45');
        response.body.games.should.equal('2333');
        response.body.name.should.equal('Malachi Constant');
        response.body.positions.should.equal('Martian');
        response.body.team_id.should.equal(1);
        done();
      });
    });

    it('POST should return an error when the player is missing data', (done) => {
      chai.request(server)
      .post('/api/v1/players')
      .send({
        age: '23',
        name: 'Winston Niles Rumfoord',
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.text.should.equal('You are missing some data');
        done();
      });
    });
  });

  describe('PATCH', () => {

    it('PATCH should allow you to edit teams', (done) => {
      chai.request(server)
      .patch('/api/v1/teams/1')
      .send({
        city: 'some change'
      })
      .end((err, response) => {
        response.should.have.status(200);
        response.body.city.should.equal('some change');
        done();
      });
    });

    it('PATCH will not update if it cannot find the teams id', (done) => {
      chai.request(server)
      .patch('/api/v1/teams/hello')
      .send({
        age: 'some change'
      })
      .end((err, response) => {
        response.should.have.status(404);
        response.text.should.equal('ID not found or invalid.');
        done();
      });
    });

    it('PATCH should allow you to edit players', (done) => {
      chai.request(server)
      .patch('/api/v1/players/1')
      .send({
        age: 'some change'
      })
      .end((err, response) => {
        response.should.have.status(200);
        response.body.age.should.equal('some change');
        done();
      });
    });

    it('PATCH should not allow you to edit a player with wrong information', (done) => {
      chai.request(server)
      .patch('/api/v1/players/hello')
      .send({
        city: 'some change'
      })
      .end((err, response) => {
        response.should.have.status(404);
        response.text.should.equal('ID not found or invalid.');
        done();
      });
    });
  });

  describe('DELETE', () => {

    it('should be able to remove a player from the database', (done) => {
      chai.request(server)
      .delete('/api/v1/players/2')
      .end((err, response) => {
        response.should.have.status(200);
        response.text.should.equal('Enigma was removed from the database');
        done();
      });
    });

    it('should not remove a player that is not in the database', (done) => {
      chai.request(server)
      .delete('/api/v1/players/hello')
      .end((err, response) => {
        response.should.have.status(404);
        response.text.should.equal('ID was not found');
        done();
      });
    });

    it('should be able to remove a team from the database', (done) => {
      chai.request(server)
      .delete('/api/v1/teams/1')
      .end((err, response) => {
        response.should.have.status(200);
        response.text.should.equal('your team has been removed');
        done();
      });
    });

    it('should return an error if you try to delete a team that does not exist', (done) => {
      chai.request(server)
      .delete('/api/v1/teams/7')
      .end((err, response) => {
        response.should.have.status(404);
        response.text.should.equal('ID was not found');
        done();
      });
    });
  });
});
