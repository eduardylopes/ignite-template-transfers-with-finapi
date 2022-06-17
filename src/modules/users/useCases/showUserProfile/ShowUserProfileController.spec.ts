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

  it("should be able get user profile", async () => {
    const authenticateResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const { token } = authenticateResponse.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .send({
        email: "eduardylopes@gmail.com",
        password: "123456",
      })
      .set({ Authorization: `Bearer ${token}` });

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
