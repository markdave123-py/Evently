import request from "supertest";
import { app } from "../src/app/app.service.js";
import { sequelizeConn } from "../src/core/config/database";
import User from "../src/user/models/user.model.js";

describe(" POST /signup - User Signup", () => {
  beforeAll(async () => {
    await sequelizeConn.sync({ force: true });
  });
  beforeEach(async () => {
    await sequelizeConn.sync({ force: true });
  });

  it("should create a new user and respond with 201 status code", async () => {
    const userData = {
      email: "user@gmail.com",
      password: "Password123$",
    };

    const response = await request(app).post("/api/user/signup").send(userData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data.password).toBeUndefined();
    expect(response.body.data).toHaveProperty("id");

    const userExists = await User.findOne({ where: { email: userData.email } });

    expect(userExists).not.toBeNull();
    expect(userExists.password).not.toBe(userData.password);
  });


});
