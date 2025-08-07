const request = require("supertest");
const { Client, validateClient } = require("../model/client");
const app = require("../index");

jest.mock("../model/client.js");

describe("Client Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /clients", () => {
    it("should create a new client and return 200", async () => {
      const clientData = {
        name: "John Doe",
        email: "john@example.com",
        role: "Developer",
        department: "Engineering",
        joinDate: "2025-01-01",
        status: "Active",
        projectCount: 3,
      };

      validateClient.mockReturnValue({ error: null });
      Client.prototype.save = jest
        .fn()
        .mockResolvedValue({ _id: "123", ...clientData });

      const res = await request(app).post("/clients").send(clientData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id: "123", ...clientData });
      expect(Client.prototype.save).toHaveBeenCalled();
    });

    it("should return 400 if validation fails", async () => {
      validateClient.mockReturnValue({
        error: { details: [{ message: "Invalid email" }] },
      });

      const res = await request(app)
        .post("/clients")
        .send({ email: "invalid" });

      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email");
    });
  });

  describe("PUT /clients", () => {
    it("should update a client and return 200", async () => {
      const clientData = {
        name: "Jane Doe",
        email: "jane@example.com",
        role: "Manager",
        department: "Engineering",
        joinDate: "2025-01-01",
        status: "Active",
        projectCount: 5,
      };

      validateClient.mockReturnValue({ error: null });
      Client.findByIdAndUpdate.mockResolvedValue({ _id: "123", ...clientData });

      const res = await request(app).put("/clients?id=123").send(clientData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id: "123", ...clientData });
      expect(Client.findByIdAndUpdate).toHaveBeenCalledWith("123", clientData, {
        new: true,
      });
    });

    it("should return 404 if client not found", async () => {
      validateClient.mockReturnValue({ error: null });
      Client.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put("/clients?id=123")
        .send({ name: "Jane Doe" });

      expect(res.status).toBe(404);
      expect(res.text).toBe("The client with the given ID was not found.");
    });
  });

  describe("DELETE /clients", () => {
    it("should delete a client and return 200", async () => {
      const clientData = { _id: "123", name: "John Doe" };
      Client.findByIdAndRemove.mockResolvedValue(clientData);

      const res = await request(app).delete("/clients?id=123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(clientData);
      expect(Client.findByIdAndRemove).toHaveBeenCalledWith("123");
    });

    it("should return 404 if client not found", async () => {
      Client.findByIdAndRemove.mockResolvedValue(null);

      const res = await request(app).delete("/clients?id=123");

      expect(res.status).toBe(404);
      expect(res.text).toBe("The client with the given ID was not found.");
    });
  });

  describe("GET /clients", () => {
    it("should return a single client by ID", async () => {
      const clientData = { _id: "123", name: "John Doe" };
      Client.findById.mockResolvedValue(clientData);

      const res = await request(app).get("/clients?id=123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(clientData);
      expect(Client.findById).toHaveBeenCalledWith("123");
    });

    it("should return all clients sorted by name", async () => {
      const clients = [{ name: "Alice" }, { name: "Bob" }];
      Client.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(clients),
      });

      const res = await request(app).get("/clients");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(clients);
      expect(Client.find).toHaveBeenCalled();
    });

    it("should return 404 if client not found by ID", async () => {
      Client.findById.mockResolvedValue(null);

      const res = await request(app).get("/clients?id=123");

      expect(res.status).toBe(404);
      expect(res.text).toBe("The client with the given ID was not found.");
    });
  });

  describe("GET /clients/one", () => {
    it("should return a single client by ID", async () => {
      const clientData = [{ _id: "123", name: "John Doe" }];
      Client.find.mockResolvedValue(clientData);

      const res = await request(app).get("/clients/one?id=123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(clientData);
      expect(Client.find).toHaveBeenCalledWith({ _id: { $in: "123" } });
    });

    it("should return all clients sorted by name", async () => {
      const clients = [{ name: "Alice" }, { name: "Bob" }];
      Client.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(clients),
      });

      const res = await request(app).get("/clients/one");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(clients);
      expect(Client.find).toHaveBeenCalled();
    });

    it("should return 404 if client not found by ID", async () => {
      Client.find.mockResolvedValue(null);

      const res = await request(app).get("/clients/one?id=123");

      expect(res.status).toBe(404);
      expect(res.text).toBe("The client with the given ID was not found.");
    });
  });
});
