import { generateToken } from "../src/middleware/generateToken.js";
import request from "supertest";
import app from "../src/server.js";
import { pool } from "../src/db.js";

const testImage = `${__dirname}/test.jpg`;
describe("File API", () => {
  let orderId;
  let fileId;
  let userToken, adminToken, strangerToken;

  beforeAll(() => {
    adminToken = generateToken({ id: 1, role_id: 1 });
    userToken = generateToken({ id: 2, role_id: 2 });
    strangerToken = generateToken({ id: 999, role_id: 2 });
  });

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .field("info", "Order for file tests")
      .field("weight", 1234)
      .field("length", 10000)
      .field("width", 20000)
      .field("height", 30000)
      .field("from", "A")
      .field("to", "B")
      .field("date_start", "2024-01-01")
      .field("date_end", "2024-01-10")
      .field("user_id", 2)
      .attach("files", testImage)
      .expect(201);

    orderId = res.body.orderId;

    const fileRes = await request(app)
      .get(`/api/orders/${orderId}/files`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    fileId = fileRes.body[0].id;
  });

  describe("GET /orders/:orderId/files", () => {
    it("should return files for order (admin access)", async () => {
      const res = await request(app)
        .get(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("file_name");
      expect(res.body[0]).toHaveProperty("file_base64");
    });

    it("should return files for order (owner access)", async () => {
      const res = await request(app)
        .get(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should return 403 if not owner or admin", async () => {
      const res = await request(app)
        .get(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${strangerToken}`)
        .expect(403);

      expect(res.body.message).toBe("Доступ запрещен");
    });

    it("should return 404 if order not found", async () => {
      const res = await request(app)
        .get(`/api/orders/999999/files`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.message).toBe("Заказ не найден");
    });

    it("should return 404 if no files", async () => {
      const newOrderRes = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .field("info", "No files here")
        .field("weight", 123)
        .field("length", 10000)
        .field("width", 20000)
        .field("height", 30000)
        .field("from", "X")
        .field("to", "Y")
        .field("date_start", "2024-01-01")
        .field("date_end", "2024-01-02")
        .field("user_id", 2)
        .attach("files", testImage)
        .expect(201);

      const newOrderId = newOrderRes.body.orderId;

      await pool.query("DELETE FROM files WHERE order_id = ?", [newOrderId]);

      const res = await request(app)
        .get(`/api/orders/${newOrderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);

      expect(res.body.message).toBe("Файлы для этого заказа не найдены");
    });
  });

  describe("GET /orders/files/:id", () => {
    it("should download file (admin)", async () => {
      const res = await request(app)
        .get(`/api/orders/files/${fileId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("file_base64");
      expect(res.body).toHaveProperty("file_name");
    });

    it("should download file (owner)", async () => {
      const res = await request(app)
        .get(`/api/orders/files/${fileId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.file_type).toBeDefined();
    });

    it("should return 403 for stranger", async () => {
      const res = await request(app)
        .get(`/api/orders/files/${fileId}`)
        .set("Authorization", `Bearer ${strangerToken}`)
        .expect(403);

      expect(res.body.message).toBe("Доступ запрещен");
    });

    it("should return 404 for unknown file", async () => {
      const res = await request(app)
        .get(`/api/orders/files/999999`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.message).toBe("Файл не найден");
    });
  });

  describe("POST /orders/:orderId/files", () => {
    it("should upload file to order (owner access)", async () => {
      const res = await request(app)
        .post(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .attach("file", testImage)
        .expect(201);

      expect(res.body.message).toBe("Файл загружен");
    });

    it("should return 403 if user not owner", async () => {
      const res = await request(app)
        .post(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${strangerToken}`)
        .attach("file", testImage)
        .expect(403);

      expect(res.body.message).toBe("Доступ запрещен");
    });

    it("should return 404 if order not found", async () => {
      const res = await request(app)
        .post(`/api/orders/999999/files`)
        .set("Authorization", `Bearer ${adminToken}`)
        .attach("file", testImage)
        .expect(404);

      expect(res.body.message).toBe("Заказ не найден");
    });

    it("should return 400 if no file provided", async () => {
      const res = await request(app)
        .post(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(400);

      expect(res.body.message).toBe("Файлы не были загружены");
    });
  });

  describe("DELETE /files/:id", () => {
    let fileToDeleteId;

    beforeAll(async () => {
      const uploadRes = await request(app)
        .post(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .attach("file", testImage)
        .expect(201);

      const filesRes = await request(app)
        .get(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      fileToDeleteId = filesRes.body.at(-1).id; // Последний загруженный
    });

    it("should delete file (admin access)", async () => {
      const res = await request(app)
        .delete(`/api/orders/files/${fileToDeleteId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.message).toBe("Файл успешно удален");
    });

    it("should delete file (owner access)", async () => {
      const uploadRes = await request(app)
        .post(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .attach("file", testImage)
        .expect(201);

      const filesRes = await request(app)
        .get(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      const ownerFileId = filesRes.body.at(-1).id;

      const res = await request(app)
        .delete(`/api/orders/files/${ownerFileId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.message).toBe("Файл успешно удален");
    });

    it("should return 403 if not owner or admin", async () => {
      const uploadRes = await request(app)
        .post(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .attach("file", testImage)
        .expect(201);

      const filesRes = await request(app)
        .get(`/api/orders/${orderId}/files`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      const fileId = filesRes.body.at(-1).id;

      const res = await request(app)
        .delete(`/api/orders/files/${fileId}`)
        .set("Authorization", `Bearer ${strangerToken}`)
        .expect(403);

      expect(res.body.message).toBe("Доступ запрещен");
    });

    it("should return 404 for non-existing file", async () => {
      const res = await request(app)
        .delete(`/api/orders/files/999999`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.message).toBe("Файл не найден");
    });
  });
});
