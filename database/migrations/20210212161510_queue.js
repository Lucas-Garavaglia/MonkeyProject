const { schema } = require("../connection");

exports.up = function (knex) {
  return knex.schema.createTable("queue", function (t) {
    t.increments("ID").primary();
    t.string("Name");
    t.string("Description");
    t.string("AuthorID");
    t.string("GuildID");
    t.string("AuthorName");
    t.string("GuildName");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("queue");
};
