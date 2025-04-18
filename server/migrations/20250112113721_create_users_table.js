import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
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
      email: "alex.lozovoy05@bk.ru",
      phone: "1234567890",
      password: hashedPassword,
      role_id: 1,
    },
    {
      email: "user@example.com",
      phone: "2222222222",
      password: hashedPassword,
      role_id: 2,
    },
  ]);
}

export async function down(knex) {
  await knex.schema.dropTable("users");
}
