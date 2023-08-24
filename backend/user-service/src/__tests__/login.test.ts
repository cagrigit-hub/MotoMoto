import request from "supertest";
import app from "../app";
import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

const test_req = {
  body: {
    email: "test@test.com",
    password: "testpassword",
    username: "test",
  },
};
let mongoServer: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // Configure your mongoose connection to use the mock server's URI
  await mongoose.connect(uri);
  // register a user
  await request(app).post("/api/v1/users/register").send(test_req.body);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Controller - Login", () => {
  it("should successfully login a user with valid credentials and return access refresh token", async () => {
    const res = await request(app)
      .post("/api/v1/users/login")
      .send(test_req.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
  it("should prevent login with invalid credentials", async () => {
    const body = {
      ...test_req.body,
      password: "wrongpassword",
    };
    const res = await request(app).post("/api/v1/users/login").send(body);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
  
  it("should revert if invalid request body is provided", async () => {
    const body = {
      ...test_req.body,
      password: "",
    };
    const res = await request(app).post("/api/v1/users/login").send(body);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
    const body2 = {
      ...test_req.body,
      email: "invalidemail",
    };
    const res2 = await request(app).post("/api/v1/users/login").send(body2);
    expect(res2.status).toBe(401);
  });

  it("should revert if no request body is provided", async () => {
    const res = await request(app).post("/api/v1/users/login").send({});
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
