import bcrypt from "bcryptjs";

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

  const saltRounds = 10;
  const password = "65843asdfG";

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await knex("users").insert([
    {
      login: "admin",
      phone: "1234567890",
      password: hashedPassword,
      role_id: 1,
    },
  ]);
}

export async function down(knex) {
  await knex.schema.dropTable("users");
}
