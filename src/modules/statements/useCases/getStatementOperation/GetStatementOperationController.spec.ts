import request from "supertest";
import { Connection } from "typeorm";

import { v4 as uuidV4 } from "uuid";

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

  it("should be able to list a statement by statement_id", async () => {
    const authenticateResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const { token } = authenticateResponse.body;

    const amount = 250;

    const depositResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({ amount, description: "rent payment" })
      .set({ Authorization: `Bearer ${token}` });

    const { id } = depositResponse.body;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to list a statement by invalid uuid", async () => {
    const authenticateResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const { token } = authenticateResponse.body;

    const id = "invalid_uuid9039049020394";

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(500);
  });

  it("should not be able to list a statement by non existent uuid", async () => {
    const authenticateResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const { token } = authenticateResponse.body;

    const id = uuidV4();

    console.log(id);

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
  });
});
