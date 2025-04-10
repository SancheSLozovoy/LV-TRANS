export async function up(knex) {
  await knex.schema.createTable("orders", function (table) {
    table.increments("id").primary();
    table.text("info").notNullable();
    table.float("weight").notNullable();
    table.string("from").notNullable();
    table.string("to").notNullable();
    table.timestamp("create_at").defaultTo(knex.fn.now());
    table.timestamp("date_start");
    table.timestamp("date_end");
    table
      .integer("status_id")
      .unsigned()
      .references("id")
      .inTable("status")
      .onDelete("SET NULL")
      .defaultTo(1);
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  await knex.schema.dropTable("orders");
}
