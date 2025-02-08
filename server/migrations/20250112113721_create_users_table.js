export async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("login").notNullable().unique();
    table.string("phone").notNullable();
    table.string("password").notNullable();
    table
      .integer("role_id")
      .unsigned()
      .references("id")
      .inTable("roles")
      .onDelete("CASCADE")
      .defaultTo(2);
  });
}

export async function down(knex) {
  await knex.schema.dropTable("users");
}
