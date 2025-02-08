import request from "supertest";
import app from "../src/server.js";
import * as UserModel from "../src/models/userModel.js";

describe("User API", () => {
  let userId;

  describe("POST /users", () => {
    it("should create a user and return 201", async () => {
      const res = await request(app)
        .post("/users")
        .send({
          login: "testuser",
          phone: "89381000000",
          password: "password123",
        })
        .expect(201);
      userId = res.body.userId;
      expect(res.body.message).toBe("User created");
      expect(res.body.userId).toBeDefined();
    });

    it("should return 400 for missing required fields", async () => {
      const res = await request(app)
        .post("/users")
        .send({ login: "testuser" })
        .expect(400);
      expect(res.body.message).toBe("Missing required fields");
    });
  });

  describe("GET /users", () => {
    it("should return 200 and a list of users", async () => {
      const res = await request(app).get("/users").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 404 if no users are found", async () => {
      jest.spyOn(UserModel, "getUsers").mockResolvedValue([]);
      const res = await request(app).get("/users").expect(404);
      expect(res.body.message).toBe("Users not found");
    });
  });

  describe("GET /users/:id", () => {
    it("should return 200 and the user data", async () => {
      const res = await request(app).get(`/users/${userId}`).expect(200);
      expect(res.body.id).toBe(userId);
    });

    it("should return 400 if the ID is invalid", async () => {
      const res = await request(app).get("/users/invalidID").expect(400);
      expect(res.body.message).toBe("Invalid user ID");
    });

    it("should return 404 if the user is not found", async () => {
      const res = await request(app).get("/users/99999").expect(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("PUT /users/:id", () => {
    it("should update the user and return 200", async () => {
      const res = await request(app)
        .put(`/users/${userId}`)
        .send({
          login: "updateduser",
          phone: "89281234567",
          password: "newpassword123",
          role_id: 1,
        })
        .expect(200);
      expect(res.body.message).toBe("User updated");
    });

    it("should return 404 if the user is not found", async () => {
      const res = await request(app)
        .put("/users/99999")
        .send({
          login: "updateduser",
          phone: "89281234567",
          password: "newpassword123",
          role_id: 1,
        })
        .expect(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete the user and return 200", async () => {
      const res = await request(app).delete(`/users/${userId}`).expect(200);
      expect(res.body.message).toBe("User deleted");
    });

    it("should return 404 if the user is not found", async () => {
      const res = await request(app).delete("/users/99999").expect(404);
      expect(res.body.message).toBe("User not found");
    });
  });
});
