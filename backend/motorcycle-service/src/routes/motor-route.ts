import express from "express";
import { createMotor, deleteMotorById, getMotorById, getMotors, updateMotorById } from "../controllers/motor-controller";
import { createMotorValidations, updateMotorValidations } from "../validations/motor-validations";
import { currentUser } from "@cakitomakito/moto-moto-common";


const router = express.Router();

router.get('/', (req, res) => { 
    res.send(
        {
            message: "Hello from motor route"
        }
    )
})  

router.post('/', createMotorValidations, currentUser, createMotor);

router.get("/motor/:id", currentUser, getMotorById);

router.get("/all", currentUser, getMotors);

router.patch("/:id", currentUser, updateMotorValidations, updateMotorById);

router.delete("/:id", currentUser, updateMotorValidations, deleteMotorById);


export default router;