import dotenv from "dotenv";

dotenv.config();

export async function up(knex) {
  await knex.raw(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);

  await knex.raw(`USE \`${process.env.DB_NAME}\``);
}

export async function down(knex) {
  await knex.raw(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\``);
}
