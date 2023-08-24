import request from "supertest";
import app from "../app";
import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";
import LicenseService from "../services/license-service";

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

describe("App Controller - License", () => {
    it("should successfully create a license, if logged in", async () => {
        // send request with access token authorization header
        // manipulate update id to be = 40
        const res = await request(app)
            .post("/api/v1/licenses/upload")
            .send({ licenseNumber: 24 })
            .set("Authorization", `Bearer ${mockAccessToken}`);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message");
    });
    it("should prevent license creation if not logged in", async () => {
        const res = await request(app)
            .post("/api/v1/licenses/upload")
            .send({ licenseNumber: 24 });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error");
    });
    /**
     import { body } from "express-validator";

export const validateLicenseUpload = [
  body("licenseNumber").notEmpty().withMessage("License number is required"),
];

export const validateGetLicense = [
  body("licenseId").notEmpty().withMessage("License ID is required"),
];

     */
    // it("should successfully get a license, if logged in", async () => {
    //     // send request with access token authorization header
    //     const allLicenses = await LicenseService.getAllLicenses();
    //     const id = allLicenses[0]._id.toString();
    //     console.log(id)
    //     const res = await request(app)
    //         .post("/api/v1/licenses/"+id)
    //         .set("Authorization", `Bearer ${mockAccessToken}`);
    //     expect(res.status).toBe(200);
    //     expect(res.body).toHaveProperty("message");

    // });
});