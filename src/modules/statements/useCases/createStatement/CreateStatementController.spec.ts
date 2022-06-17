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

  it("should be able to deposit when user is authenticated", async () => {
    const authenticateResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const { token } = authenticateResponse.body;

    const amount = 250;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({ amount, description: "rent payment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
    expect(response.body.type).toEqual("deposit");
    expect(response.body.amount).toEqual(amount);
  });

  it("should not be able to deposit when user is not authenticated", async () => {
    const token = "invalid_token9023094019230490123490";
    const amount = 250;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({ amount, description: "rent payment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(401);
  });

  it("should be able to withdraw when user is authenticated", async () => {
    const authenticateResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const { token } = authenticateResponse.body;

    const amount = 250;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({ amount, description: "salary" })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({ amount, description: "bills" })
      .set({ Authorization: `Bearer ${token}` });

    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body.type).toEqual("withdraw");
    expect(response.body.amount).toEqual(amount);
  });

  it("should not be able to withdraw with an insufficient balance", async () => {
    const authenticateResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const { token, user: authenticatedUser } = authenticateResponse.body;

    await connection.query(
      `DELETE FROM statements WHERE user_id='${authenticatedUser.id}'`
    );

    const amount = 500;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({ amount, description: "bills" })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
  });
});
