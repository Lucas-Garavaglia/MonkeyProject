const knex = require("knex");
const configuration = require("../knexfile");
const config = configuration.development;
config.connection.filename = `${__dirname}` + "/" + config.connection.filename;
const connection = knex(config);

module.exports = connection;
