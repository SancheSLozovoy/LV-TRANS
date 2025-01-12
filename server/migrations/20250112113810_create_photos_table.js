export async function up(knex) {
  await knex.schema.createTable("photos", function (table) {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table.binary("photo").notNullable();
  });
}

export async function down(knex) {
  await knex.schema.dropTable("photos");
}
