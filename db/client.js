const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/fitness2-dev");

module.exports = {
  client,
};
