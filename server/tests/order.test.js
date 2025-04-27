import request from "supertest";
import app from "../src/server.js";
import * as OrderModel from "../src/models/orderModel.js";
import { generateToken } from "../src/middleware/generateToken.js";

const testImage = `${__dirname}/test.jpg`;

describe("Order API", () => {
  let orderId;
  let userToken, adminToken;

  beforeAll(() => {
    userToken = generateToken({ id: 2, role_id: 2 });
    adminToken = generateToken({ id: 1, role_id: 1 });
  });

  describe("POST /orders", () => {
    it("should create an order and return 201", async () => {
      const res = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .field("info", "Test order")
        .field("weight", 10000)
        .field("from", "City A")
        .field("to", "City B")
        .field("date_start", "2024-01-01")
        .field("date_end", "2024-01-10")
        .field("user_id", 2)
        .attach("files", testImage)
        .expect(201);

      expect(res.body.message).toBe("Order created with files");
      orderId = res.body.orderId;
    });

    it("should return 400 if no files uploaded", async () => {
      const res = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .field("info", "Test order")
        .field("weight", 10000)
        .field("from", "City A")
        .field("to", "City B")
        .field("date_start", "2024-01-01")
        .field("date_end", "2024-01-10")
        .field("user_id", 2)
        .expect(400);

      expect(res.body.message).toBe("No files uploaded");
    });
  });

  describe("GET /orders", () => {
    it("should return 200 and list of orders for admin", async () => {
      const res = await request(app)
        .get("/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body.orders)).toBe(true);
      expect(typeof res.body.total).toBe("number");
    });

    it("should return 403 if not admin", async () => {
      const res = await request(app)
        .get("/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.message).toBe("Access denied");
    });

    it("should return 404 if no orders", async () => {
      jest
        .spyOn(OrderModel, "getOrders")
        .mockResolvedValue({ orders: [], total: 0 });

      const res = await request(app)
        .get("/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.message).toBe("No orders found");
    });
  });

  describe("GET /orders/:id", () => {
    it("should return 200 for admin", async () => {
      const res = await request(app)
        .get(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.id).toBe(orderId);
    });

    it("should return 200 for owner", async () => {
      const res = await request(app)
        .get(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.id).toBe(orderId);
    });

    it("should return 403 for other user", async () => {
      const anotherUserToken = generateToken({ id: 999, role_id: 2 });

      const res = await request(app)
        .get(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .expect(403);

      expect(res.body.message).toBe("Access denied");
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app)
        .get("/orders/abc")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.message).toBe("Invalid order ID");
    });
  });

  describe("PUT /orders/:id", () => {
    it("should update the order for admin", async () => {
      const res = await request(app)
        .put(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          info: "Updated",
          weight: 2000,
          from: "City A",
          to: "City C",
          date_start: "2024-02-01",
          date_end: "2024-02-10",
          status_id: 2,
          user_id: 2,
        })
        .expect(200);

      expect(res.body.message).toBe("Order updated");
    });

    it("should return 403 for non-owner user", async () => {
      const anotherUserToken = generateToken({ id: 999, role_id: 2 });

      const res = await request(app)
        .put(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          info: "Try",
          weight: 1000,
          from: "X",
          to: "Y",
          date_start: "2024-02-01",
          date_end: "2024-02-10",
          status_id: 1,
          user_id: 2,
        })
        .expect(403);

      expect(res.body.message).toBe("Access denied");
    });
  });

  describe("GET /orders/user/:userId", () => {
    it("should return orders of current user", async () => {
      const res = await request(app)
        .get("/orders/user/2")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(res.body.orders)).toBe(true);
    });

    it("should return 403 if trying to access another user", async () => {
      const res = await request(app)
        .get("/orders/user/3")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.message).toBe("Access denied");
    });
  });

  describe("DELETE /orders/:id", () => {
    it("should delete order for owner", async () => {
      const res = await request(app)
        .delete(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.message).toBe("Order deleted");
    });

    it("should return 404 for nonexistent order", async () => {
      const res = await request(app)
        .delete(`/orders/99999`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.message).toBe("Order not found");
    });
  });
});
