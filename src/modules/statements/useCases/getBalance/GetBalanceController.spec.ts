import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create UserProfile Controller", () => {
  const user = {
    name: "Eduardy Lopes de Morais",
    email: "eduardylopes@gmail.com",
    password: "123456",
  };

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send(user);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able get user statement and balance", async () => {
    const authenticateResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const { token } = authenticateResponse.body;

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statement");
    expect(response.body).toHaveProperty("balance");
  });

  it("should not be able get user statement and balance with invalid token", async () => {
    const token = "invalid_token00934209420-93490-1902";

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(401);
  });

  it("should not be able get user statement and balance with token missing", async () => {
    const token = null;

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(401);
  });
});
