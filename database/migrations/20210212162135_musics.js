exports.up = function (knex) {
  return knex.schema.createTable("musics", function (t) {
    t.increments("ID").primary();
    t.string("AuthorID");
    t.string("AuthorName");
    t.string("URL");
    t.string("Title");
    t.string("queueID").references("ID").inTable("queue");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("musics");
};
