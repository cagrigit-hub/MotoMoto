import LoginError from "../errors/login-error";
import UserModel from "../models/user-model";
import bcrypt from "bcrypt";
import jwtConfig from "../config/jwt";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/custom-error";

class UserService {
  static async registerUser(username: string, email: string, password: string) {
    try {
      const newUser = new UserModel({
        username,
        email,
        password,
      });
      await newUser.save();
    } catch (error: any) {
      // handle mongo error if duplication error occurs
      if (error.code === 11000) {
        throw new Error("User already exists");
      }
    }
  }
  static async loginUser(email: string, password: string) {
    try {
      const user = await UserModel.findOne({ email });
      // Check if user exists and password is valid
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid email or password");
      }
      // Check if user exists and password is valid
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid email or password");
      }

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { userId: user._id },
        jwtConfig.accessSecret,
        {
          expiresIn: jwtConfig.accessExpiresIn,
        }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        jwtConfig.refreshSecret,
        {
          expiresIn: jwtConfig.refreshExpiresIn,
        }
      );

      return { accessToken, refreshToken };
    } catch (error: any) {

      throw new Error(error.message);
    }
  }
}

export default UserService;
