export async function up(knex) {
  await knex.schema.createTable("files", function (table) {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table.binary("file").notNullable();
    table.string("file_name").notNullable();
    table.string("file_type").notNullable();
  });

  await knex.raw("ALTER TABLE files MODIFY COLUMN file LONGBLOB;");
}

export async function down(knex) {
  await knex.schema.dropTable("files");
}
