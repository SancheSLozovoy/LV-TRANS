import request from "supertest";
import app from "../src/server.js";
import * as OrderModel from "../src/models/orderModel.js";

const testImage = `${__dirname}/test.jpg`;

describe("Order API", () => {
  let orderId;

  describe("POST /orders", () => {
    it("should create an order and return 201", async () => {
      const res = await request(app)
        .post("/orders")
        .field("info", "Test order")
        .field("weight", 10000)
        .field("from", "City A")
        .field("to", "City B")
        .field("date_start", "2024-01-01")
        .field("date_end", "2024-01-10")
        .field("user_id", 3)
        .attach("photos", testImage)
        .expect(201);

      orderId = res.body.orderId;
      expect(res.body.message).toBe("Order created and photos uploaded");
      expect(res.body.orderId).toBeDefined();
    });

    it("should return 400 for missing required fields", async () => {
      const res = await request(app)
        .post("/orders")
        .send({ info: "Test order" })
        .expect(400);
      expect(res.body.message).toBe("Missing required fields");
    });

    it("should return 400 if no photos are uploaded", async () => {
      const res = await request(app)
        .post("/orders")
        .send({
          info: "Test order",
          weight: "10kg",
          from: "City A",
          to: "City B",
          date_start: "2024-01-01",
          date_end: "2024-01-10",
          user_id: 1,
        })
        .expect(400);
      expect(res.body.message).toBe("No photos uploaded");
    });
  });

  describe("GET /orders", () => {
    it("should return 200 and a list of orders", async () => {
      const res = await request(app).get("/orders").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 404 if no orders are found", async () => {
      jest.spyOn(OrderModel, "getOrders").mockResolvedValue([]);
      const res = await request(app).get("/orders").expect(404);
      expect(res.body.message).toBe("No orders found");
    });
  });

  describe("GET /orders/:id", () => {
    it("should return 200 and the order data", async () => {
      const res = await request(app).get(`/orders/${orderId}`).expect(200);
      expect(res.body.id).toBe(orderId);
    });

    it("should return 400 if the ID is invalid", async () => {
      const res = await request(app).get("/orders/invalidID").expect(400);
      expect(res.body.message).toBe("Invalid order ID");
    });

    it("should return 404 if the order is not found", async () => {
      const res = await request(app).get("/orders/99999").expect(404);
      expect(res.body.message).toBe("Order not found");
    });
  });

  describe("PUT /orders/:id", () => {
    it("should update the order and return 200", async () => {
      const res = await request(app)
        .put(`/orders/${orderId}`)
        .send({
          info: "Updated order",
          weight: 1000,
          from: "City C",
          to: "City D",
          date_start: "2024-02-01",
          date_end: "2024-02-10",
          status_id: 2,
          user_id: 5,
        })
        .expect(200);
      expect(res.body.message).toBe("Order updated");
    });

    it("should return 404 if the order is not found", async () => {
      const res = await request(app)
        .put("/orders/99999")
        .send({
          info: "Updated order",
          weight: "15kg",
          from: "City C",
          to: "City D",
          date_start: "2024-02-01",
          date_end: "2024-02-10",
          status_id: 2,
          user_id: 1,
        })
        .expect(404);
      expect(res.body.message).toBe("Order not found");
    });
  });

  describe("DELETE /orders/:id", () => {
    it("should delete the order and return 200", async () => {
      const res = await request(app).delete(`/orders/${orderId}`).expect(200);
      expect(res.body.message).toBe("Order deleted");
    });

    it("should return 404 if the order is not found", async () => {
      const res = await request(app).delete("/orders/99999").expect(404);
      expect(res.body.message).toBe("Order not found");
    });
  });
});
