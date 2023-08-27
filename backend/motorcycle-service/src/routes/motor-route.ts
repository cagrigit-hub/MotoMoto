import express from "express";
import { createMotor, deleteMotorById, getMotorById, getMotors, updateMotorById } from "../controllers/motor-controller";
import { createMotorValidations } from "../validations/motor-validations";
import { currentUser } from "@cakitomakito/moto-moto-common";


const router = express.Router();

router.post('/', createMotorValidations, currentUser, createMotor);

router.get("/motor/:id", currentUser, getMotorById);

router.get("/all", currentUser, getMotors);

router.put("/:id", currentUser, createMotorValidations, updateMotorById);

router.delete("/:id", currentUser, createMotorValidations, deleteMotorById);


export default router;