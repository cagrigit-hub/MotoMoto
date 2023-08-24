import { body } from "express-validator";

export const validateLicenseUpload = [
  body("licenseNumber").notEmpty().withMessage("License number is required"),
];

export const validateGetLicense = [
  body("licenseId").notEmpty().withMessage("License ID is required"),
];
