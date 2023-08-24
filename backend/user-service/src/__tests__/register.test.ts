import request from "supertest";
import app from "../app";
import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";
// Other imports...
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
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Controller - Register", () => {
  it("should successfully register a user with valid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/users/register")
      .send(test_req.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
  });
  it("should prevent same email from registering twice", async () => {
    const body = {
      ...test_req.body,
      username: "ddasd",
    };
    const res = await request(app)
      .post("/api/v1/users/register")
      .send(test_req.body);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
  it("should prevent same username from registering twice", async () => {
    const body = {
      ...test_req.body,
      email: "diff@gmail.com",
    };
    const res = await request(app).post("/api/v1/users/register").send(body);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

    it("should prevent registering a user with invalid email", async () => {
        const body = {
        ...test_req.body,
        email: "invalidemail",
        };
        const res = await request(app).post("/api/v1/users/register").send(body);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error");
    });

    it("should prevent registering a user with invalid password", async () => {
        const body = {
        ...test_req.body,
        password: "123",
        };
        const res = await request(app).post("/api/v1/users/register").send(body);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error");
    });

    it("should prevent registering a user with invalid username", async () => {
        const body = {
        ...test_req.body,
        username: "1",
        };
        const res = await request(app).post("/api/v1/users/register").send(body);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error");
    });
});
