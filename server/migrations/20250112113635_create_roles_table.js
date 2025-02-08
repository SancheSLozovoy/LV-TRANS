export async function up(knex) {
  await knex.schema.createTable("roles", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
  });

  await knex("roles").insert([{ name: "ADMIN" }, { name: "USER" }]);
}

export async function down(knex) {
  await knex.schema.dropTable("roles");
}
