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
let mockRefreshToken: string;
let mockAccessToken: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    // Configure your mongoose connection to use the mock server's URI
    await mongoose.connect(uri);
    // register a user
    await request(app).post("/api/v1/users/register").send(test_req.body);
    // login a user
    const res = await request(app).post("/api/v1/users/login").send(test_req.body);
    mockRefreshToken = res.body.refreshToken;
    mockAccessToken = res.body.accessToken;
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

describe("App Controller - Refresh", () => {
    it("should successfully refresh access token with valid refresh token", async () => {
      // send request with access token authorization header
      const res = await request(app)
        .post("/api/v1/refresh")
        .send({ refresh_token: mockRefreshToken })
        .set("Authorization", `Bearer ${mockAccessToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("access_token");
    });
    it("should prevent refresh with invalid refresh token", async () => {
      const res = await request(app)
        .post("/api/v1/refresh")
        .send({ refreshToken: "invalidtoken" });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");

    });
    it("should prevent refresh if not logged in", async () => {
      const res = await request(app)
        .post("/api/v1/refresh")
        .send({ refreshToken: mockRefreshToken });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
});