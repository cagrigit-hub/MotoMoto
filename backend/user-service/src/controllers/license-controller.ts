import { Request, Response } from "express";
import LicenseService from "../services/license-service"; // Import your LicenseService
import NotFound from "../errors/not-found-error";
import { validationResult } from "express-validator";
import ServerError from "../errors/server-error";

export const verifyLicense = async (req: Request, res: Response) => {
  const { userId } = req.params; // Assuming the user ID is passed as a parameter
  try {
    // Call the LicenseService function to verify the license
    await LicenseService.verifyUserLicense(userId);
    res.status(200).json({ message: "License verified successfully" });
  } catch (error) {
    throw error;
  }
};

export const uploadLicense = async (req: Request, res: Response) => {

  
  if(!validationResult(req).isEmpty()) {
    const r = validationResult(req);
    // return errors object inside of r as a string
    const errors = r.array().map((err) => err.msg).join(', ');

    throw new ServerError(errors);
  }
  const user = req.user;

  if (!user) {
    throw new NotFound("User not found");
  }
  const { licenseNumber } = req.body; // Assuming the license number is passed in the request body
  try {
    // Call the LicenseService function to create the license
    await LicenseService.createLicense(user.userId, licenseNumber);
    res.status(201).json({ message: "License uploaded successfully" });
  } catch (error) {
    throw error;
  }
};

export const getLicenseByUser = async (req: Request, res: Response) => {
  const { userId } = req.params; // Assuming the user ID is passed as a parameter
  try {
    // Call the LicenseService function to get the license
    const license = await LicenseService.getLicenseByUser(userId);
    res.status(200).json({ license });
  } catch (error) {
    throw error;
  }
};

export const getLicense = async (req: Request, res: Response) => {
  const licenseId = req.params.licenseId; // Assuming the license ID is passed as a parameter
  try {
    // Call the LicenseService function to get the license
    const license = await LicenseService.getLicenseById(licenseId);
    res.status(200).json({ license });
  } catch (error) {
    throw error;
  }
}
