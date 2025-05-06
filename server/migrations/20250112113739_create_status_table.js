export async function up(knex) {
  await knex.schema.createTable("status", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
  });

  await knex("status").insert([
    { name: "NOT ACCEPTED" },
    { name: "ACCEPT" },
    { name: "ON TRANSIT" },
    { name: "DELIVERED" },
  ]);
}

export async function down(knex) {
  await knex.schema.dropTable("status");
}
