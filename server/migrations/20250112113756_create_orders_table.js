export async function up(knex) {
  await knex.schema.createTable("orders", function (table) {
    table.increments("id").primary();
    table.text("info").notNullable();
    table.float("weight").notNullable();
    table.float("length").notNullable();
    table.float("width").notNullable();
    table.float("height").notNullable();
    table.string("from").notNullable();
    table.string("to").notNullable();
    table.timestamp("create_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("date_start").notNullable();
    table.timestamp("date_end").notNullable();
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
