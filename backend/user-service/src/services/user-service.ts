import UserModel from "../models/user-model";
import bcrypt from "bcrypt";
import jwtConfig from "../config/jwt";
import jwt from "jsonwebtoken";
import RegisterError from "../errors/register-error";
import LoginError from "../errors/login-error";

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
        throw new RegisterError("User already exists");
      } else {
        throw new RegisterError(error.message);
      }
    }
  }
  static async loginUser(email: string, password: string) {
    try {
      const user = await UserModel.findOne({ email });
      
      // Check if user exists and password is valid, password is salted like salt.password
      if (!user) {
        throw new LoginError("Invalid credentials");
      }
      const [salt, hashedPassword] = user.password.split("-");
      const hashedInputPassword = await bcrypt.hash(password, salt);
      if (hashedInputPassword !== hashedPassword) {
        throw new LoginError("Invalid credentials");
      }
      
      const jwt_payload = {
        userId: user._id,
        isAdmin: user.isAdmin,
      }
      // Generate JWT tokens
      const accessToken = jwt.sign(
        jwt_payload,
        jwtConfig.accessSecret,
        {
          expiresIn: jwtConfig.accessExpiresIn,
        }
      );

      const refreshToken = jwt.sign(
        jwt_payload,
        jwtConfig.refreshSecret,
        {
          expiresIn: jwtConfig.refreshExpiresIn,
        }
      );

      return { accessToken, refreshToken };
    } catch (error: any) {

      throw new LoginError(error.message);
    }
  }
  static async isAdmin(userId: string) {
    // grab user from db
    const user = await UserModel.findOne({ _id: userId });
    if(!user) throw new Error("User not found");
    // check if user is admin
    return user?.isAdmin;
  }
}

export default UserService;
