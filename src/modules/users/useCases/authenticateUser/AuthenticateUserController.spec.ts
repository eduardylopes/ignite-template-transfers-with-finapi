import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create AuthenticateUser Controller", () => {
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

  it("should not be able to create a new user with email exists", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Eduardy Lopes de Morais",
      email: "eduardylopes@gmail.com",
      password: "123456",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "Eduardy",
      email: "eduardylopes@gmail.com",
      password: "758283",
    });

    expect(response.status).toBe(400);
  });

  it("should be able authenticate a valid user", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    expect(response.body).toHaveProperty("token");
  });
});
