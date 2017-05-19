module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/byob',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true,
    seeds: {
      directory: './db/seeds/dev'
    }
  },
  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true,
    seeds: {
      directory: './db/seeds/dev'
    }
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/byobtestdb',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true
  }

};
