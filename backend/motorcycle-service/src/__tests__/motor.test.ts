import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import envy from "../config/env";

let mongoServer: any;

const fake_mongo_user_id = new mongoose.Types.ObjectId().toHexString();
const fake_mongo_admin_id = new mongoose.Types.ObjectId().toHexString();
const fake_mongo_other_id = new mongoose.Types.ObjectId().toHexString();

const user_payload = {
  email: "test@test.com",
  password: "testpassword",
  isAdmin: false,
  userId: fake_mongo_user_id,
};

const admin_payload = {
  email: "admin@test.com",
  password: "adminpassword",
  isAdmin: true,
  userId: fake_mongo_admin_id,
};
const other_payload = {
  email: "other@test.com",
  password: "otherpassword",
  isAdmin: false,
  userId: fake_mongo_other_id,
};
const mock_login = async (payload: Object) => {
  // sign the payload
  const token = jwt.sign(payload, envy.jwt_access_secret, { expiresIn: "15m" });
  return token;
};

const create_motor = async () => {
  const p = {
    name: "xxx",
    description: "nice motor",
    model: "super",
    year: 2015,
    image: "image-fake",
    status: "available",
    owner: user_payload.userId,
  };
  const token = await mock_login(user_payload);
  const res = await request(app)
    .post("/api/v1/motorcycles")
    .set("Authorization", `Bearer ${token}`)
    .send(p);
  return res.body;
};

let mockMotorId: string;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // Configure your mongoose connection to use the mock server's URI
  await mongoose.connect(uri);
  // create a motor
  mockMotorId = (await create_motor())._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const prefix = "/api/v1/motorcycles";

describe("Motorcycle API", () => {
  it("should return Hello from motor route", async () => {
    const res = await request(app).get(prefix);
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Hello from motor route");
  });
  it("should able to create motor", async () => {
    const token = await mock_login(user_payload);
    const res = await request(app)
      .post(prefix)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "xxx",
        description: "nice motor",
        model: "super",
        year: 2015,
        image: "image-fake",
        status: "available",
        owner: user_payload.userId,
      });
    expect(res.status).toEqual(201);
    expect(res.body.name).toEqual("xxx");
    expect(res.body.description).toEqual("nice motor");
    expect(res.body.model).toEqual("super");
    expect(res.body.year).toEqual(2015);
    expect(res.body.image).toEqual("image-fake");
    expect(res.body.status).toEqual("available");
  });
  it("should not be able to create motor if not logged in", async () => {
    const res = await request(app).post(prefix).send({
      name: "xxx",
      description: "nice motor",
      model: "super",
      year: 2015,
      image: "image-fake",
      status: "available",
      owner: user_payload.userId,
    });
    expect(res.status).toEqual(401);
    expect(res.body.error).toEqual("Unauthorized");
  });

  it("should not be able to create motor if not valid", async () => {
    const token = await mock_login(user_payload);
    const res = await request(app)
      .post(prefix)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toEqual(500);
    expect(res.body.error).toEqual(
      "Name is required, Description is required, Model is required, Invalid value, Year is required, Image is required, Status is required, Status is not valid"
    );
  });
  it("should be able to get a motorcycle by object id", async () => {
    const token = await mock_login(user_payload);
    const res2 = await request(app)
      .get(`${prefix}/motor/${mockMotorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res2.status).toEqual(200);
    expect(res2.body.name).toEqual("xxx");
    expect(res2.body.description).toEqual("nice motor");
    expect(res2.body.model).toEqual("super");
    expect(res2.body.year).toEqual(2015);
    expect(res2.body.image).toEqual("image-fake");
    expect(res2.body.status).toEqual("available");
  });
  it("shouldnt get motor not logged in", async () => {
    const res = await request(app).get(`${prefix}/motor/${mockMotorId}`);
    expect(res.status).toEqual(401);
    expect(res.body.error).toEqual("Unauthorized");
  });
  it("shouldnt get motor if not found", async () => {
    const token = await mock_login(user_payload);
    const res = await request(app)
      .get(`${prefix}/motor/64ea8461e9f0a26260b38e2f`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toEqual(500);
    expect(res.body.error).toEqual("Failed to get motor by id Motor not found");
  });
  it("should get all motors", async () => {
    const token = await mock_login(user_payload);
    // create a 100 motor
    for (let i = 0; i < 100; i++) {
      await create_motor();
    }
    const res = await request(app)
      .get(prefix + "/all")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(102);
  });
  it("should get all motors with pagination", async () => {
    const token = await mock_login(user_payload);
    const res = await request(app)
      .get(prefix + "/all?limit=10&page=1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(10);
    // increase page
    const res2 = await request(app)
      .get(prefix + "/all?limit=10&page=2")
      .set("Authorization", `Bearer ${token}`);
    // they shouldnt be same
    expect(res2.status).toEqual(200);
    expect(res2.body.length).toEqual(10);
    expect(res.body[0]._id).not.toEqual(res2.body[0]._id);
    // if page = 0 or less than 0 throw error
    const res3 = await request(app)
      .get(prefix + "/all?limit=10&page=0")
      .set("Authorization", `Bearer ${token}`);
    expect(res3.status).toEqual(500);
    expect(res3.body.error).toEqual("Page must be greater than 0");
  });

  it("should be able to update motor", async () => {
    const token = await mock_login(user_payload);
    const res = await request(app)
      .patch(`${prefix}/${mockMotorId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "xxxzxc",
        description: "nice motorzxc",
        model: "superzxc",
        year: 2016,
        image: "image-fakezxc",
        status: "availablezxc",
        owner: user_payload.userId,
      });
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual("xxxzxc");
    expect(res.body.description).toEqual("nice motorzxc");
    expect(res.body.model).toEqual("superzxc");
    expect(res.body.year).toEqual(2016);
    expect(res.body.image).toEqual("image-fakezxc");
    expect(res.body.status).toEqual("availablezxc");
  });
  it("should be update if admin", async () => {
    const token = await mock_login(admin_payload);
    const res = await request(app)
      .patch(`${prefix}/${mockMotorId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "xxxzxct",
        description: "nice motorzxc",
        model: "superzxc",
        year: 2016,
        image: "image-fakezxc",
        status: "availablezxc",
        owner: user_payload.userId,
      });
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual("xxxzxct");
    expect(res.body.description).toEqual("nice motorzxc");
    expect(res.body.model).toEqual("superzxc");
    expect(res.body.year).toEqual(2016);
    expect(res.body.image).toEqual("image-fakezxc");
    expect(res.body.status).toEqual("availablezxc");
  });
  it("shouldnt be able to update motor if not logged in", async () => {
    const res = await request(app).patch(`${prefix}/${mockMotorId}`).send({
      name: "xxxzxc",
      description: "nice motorzxc",
      model: "superzxc",
      year: 2016,
      image: "image-fakezxc",
      status: "availablezxc",
      owner: user_payload.userId,
    });
    expect(res.status).toEqual(401);
    expect(res.body.error).toEqual("Unauthorized");
  });
  it("shouldnt be able to update motor if not valid", async () => {
    const token = await mock_login(user_payload);
    const res = await request(app)
      .patch(`${prefix}/${mockMotorId + "1"}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "xxxzxc",
        description: "nice motorzxc",
        model: "superzxc",
        year: 2016,
        image: "image-fakezxc",
        status: "availablezxc",
        owner: user_payload.userId,
      });
    expect(res.status).toEqual(500);
  });
  it("shouldnt able to update if not owner or admin", async () => {
    const token = await mock_login(other_payload);
    const res = await request(app)
      .patch(`${prefix}/${mockMotorId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "xxxzxc",
        description: "nice motorzxc",
        model: "superzxc",
        year: 2016,
        image: "image-fakezxc",
        status: "availablezxc",
        owner: user_payload.userId,
      });
    expect(res.status).toEqual(500);
    expect(res.body.error).toEqual(
      "Failed to update motor by id You are not allowed to update this motor"
    );
  });
  it("should be able to delete motor, if owner or admin", async () => {
    const token = await mock_login(user_payload);
    const res = await request(app)
      .delete(`${prefix}/${mockMotorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("deleted");
    // if admin
    const token2 = await mock_login(admin_payload);
    // get 2nd motor
    const res2 = await request(app)
      .get(prefix + "/all?limit=1&page=2")
      .set("Authorization", `Bearer ${token2}`);
    const motor_id = res2.body[0]._id;
    const res3 = await request(app)
      .delete(`${prefix}/${motor_id}`)
      .set("Authorization", `Bearer ${token2}`);
    expect(res3.status).toEqual(200);
    expect(res3.body.status).toEqual("deleted");
  });
  it("shouldnt able to delete if not owner or admin", async () => {
    const token = await mock_login(other_payload);
    const res = await request(app)
      .delete(`${prefix}/${mockMotorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toEqual(500);
    expect(res.body.error).toEqual(
      "Failed to delete motor by id You are not allowed to delete this motor "
    );
  });


});
