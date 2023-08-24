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
    } catch (error) {
      throw new CustomError();
    }
  }
  static async loginUser(email: string, password: string) {
    try {
      const user = await UserModel.findOne({ email });
      // Check if user exists and password is valid
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new LoginError("Invalid email or password");
      }
      // Check if user exists and password is valid
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new LoginError("Invalid email or password");
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
    } catch (error) {
      throw new CustomError();
    }
  }
}

export default UserService;
