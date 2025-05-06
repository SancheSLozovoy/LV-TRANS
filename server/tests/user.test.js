import request from "supertest";
import app from "../src/server.js";
import * as UserModel from "../src/models/userModel.js";
import jwt from "jsonwebtoken";
import { pool } from "../src/db.js";

describe("User API", () => {
  let adminToken;
  let userToken;
  let userId;
  let newUserId;
  let resetToken;

  beforeAll(async () => {
    await UserModel.createUser("admin@test.com", "89991112233", "admin123");
    await UserModel.createUser("user@test.com", "89994445566", "user123");

    await pool.query("UPDATE users SET role_id = 1 WHERE email = ?", [
      "admin@test.com",
    ]);
    await pool.query("UPDATE users SET role_id = 2 WHERE email = ?", [
      "user@test.com",
    ]);

    const admin = await UserModel.getUserByEmail("admin@test.com");
    const user = await UserModel.getUserByEmail("user@test.com");

    adminToken = jwt.sign(
      { id: admin.id, email: admin.email, role_id: admin.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    userToken = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    userId = user.id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE '%@test.com'");
  });

  describe("Authentication", () => {
    describe("POST /users", () => {
      it("should register a new user and return 201", async () => {
        const res = await request(app)
          .post("/users")
          .send({
            email: "newuser@test.com",
            phone: "89997778899",
            password: "newpass123",
          })
          .expect(201);

        expect(res.body.message).toBe("Успешная регистрация");
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
        newUserId = jwt.verify(
          res.body.refreshToken,
          process.env.JWT_SECRET,
        ).id;
      });

      it("should return 400 for missing fields", async () => {
        await request(app)
          .post("/users")
          .send({ email: "incomplete@test.com" })
          .expect(400);
      });

      it("should return 400 for existing email", async () => {
        await request(app)
          .post("/users")
          .send({
            email: "user@test.com",
            phone: "89991112233",
            password: "pass123",
          })
          .expect(400);
      });
    });

    describe("POST /login", () => {
      it("should login user and return token", async () => {
        const res = await request(app)
          .post("/users/login")
          .send({
            email: "user@test.com",
            password: "user123",
          })
          .expect(200);

        expect(res.body.message).toBe("Успешный вход");
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
      });

      it("should return 400 for invalid credentials", async () => {
        await request(app)
          .post("/users/login")
          .send({
            email: "user@test.com",
            password: "wrongpass",
          })
          .expect(400);
      });
    });
  });

  describe("Password Reset", () => {
    describe("POST /forgot-password", () => {
      it("should send reset email for existing user", async () => {
        const res = await request(app)
          .post("/users/forgot-password")
          .send({ email: "user@test.com" })
          .expect(200);

        expect(res.body.message).toBe(
          "Если пользователь существует, письмо для сброса пароля было отправлено",
        );

        const user = await UserModel.getUserByEmail("user@test.com");
        resetToken = jwt.sign(
          { id: user.id, email: user.email, purpose: "password-reset" },
          process.env.JWT_SECRET,
          { expiresIn: "30m" },
        );
      });

      it("should return 200 even for non-existing email", async () => {
        await request(app)
          .post("/users/forgot-password")
          .send({ email: "nonexisting@test.com" })
          .expect(200);
      });
    });

    describe("POST /reset-password", () => {
      it("should reset password with valid token", async () => {
        const res = await request(app)
          .post("/users/reset-password")
          .send({
            token: resetToken,
            password: "newpassword123",
          })
          .expect(200);

        expect(res.body.message).toBe("Пароль успешно обновлен");
      });

      it("should return 400 for invalid token", async () => {
        await request(app)
          .post("/users/reset-password")
          .send({
            token: "invalid.token.here",
            password: "newpassword123",
          })
          .expect(400);
      });
    });
  });

  describe("User Management", () => {
    describe("GET /users", () => {
      it("should return 403 for non-admin users", async () => {
        await request(app)
          .get("/users")
          .set("Authorization", `Bearer ${userToken}`)
          .expect(403);
      });

      it("should return users list for admin", async () => {
        const res = await request(app)
          .get("/users")
          .set("Authorization", `Bearer ${adminToken}`)
          .expect(200);

        expect(res.body.users).toBeInstanceOf(Array);
        expect(res.body.total).toBeDefined();
      });
    });

    describe("GET /users/:id", () => {
      it("should return user data for owner", async () => {
        const res = await request(app)
          .get(`/users/${userId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .expect(200);

        expect(res.body.id).toBe(userId);
      });

      it("should return 403 when accessing other user data", async () => {
        const otherUser = await UserModel.getUserByEmail("admin@test.com");
        await request(app)
          .get(`/users/${otherUser.id}`)
          .set("Authorization", `Bearer ${userToken}`)
          .expect(403);
      });

      it("should allow admin to view any user", async () => {
        await request(app)
          .get(`/users/${userId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .expect(200);
      });
    });

    describe("PUT /users/:id", () => {
      it("should update user data for owner", async () => {
        await request(app)
          .put(`/users/${userId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            email: "updated@test.com",
            phone: "89998887766",
            password: "updatedpass123",
            role_id: 2,
          })
          .expect(200);
      });

      it("should prevent role change by non-admin", async () => {
        const res = await request(app)
          .put(`/users/${userId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            email: "updated@test.com",
            phone: "89998887766",
            password: "updatedpass123",
            role_id: 1,
          })
          .expect(403);
      });
    });

    describe("PUT /users/:id/role", () => {
      it("should allow admin to change roles", async () => {
        await request(app)
          .put(`/users/${userId}/role`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ role_id: 1 })
          .expect(200);
      });

      it("should prevent role change by non-admin", async () => {
        await request(app)
          .put(`/users/${userId}/role`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ role_id: 1 })
          .expect(403);
      });
    });

    describe("DELETE /users/:id", () => {
      it("should allow user to delete own account", async () => {
        await request(app)
          .delete(`/users/${userId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .expect(200);
      });

      it("should prevent deleting other users", async () => {
        const otherUser = await UserModel.createUser(
          "other@test.com",
          "89993334455",
          "other123",
        );

        const getOtherUser = await UserModel.getUserByEmail("other@test.com");
        await request(app)
          .delete(`/users/${getOtherUser.id}`)
          .set("Authorization", `Bearer ${userToken}`)
          .expect(403);
      });
    });
  });
});
