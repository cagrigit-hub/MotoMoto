import UserModel from "../models/user-model";
import bcrypt from "bcrypt";
import jwtConfig from "../config/jwt"

import jwt from "jsonwebtoken";
import { RegisterError, UnauthorizedError, UserPayload } from "@cakitomakito/moto-moto-common";
import { LoginError } from "@cakitomakito/moto-moto-common";
import mongoose from "mongoose";

class UserService {
  static async registerUser(id: mongoose.Types.ObjectId ,username: string, email: string, password: string) {
    try {
      const newUser = new UserModel({
        _id: id,
        username,
        email,
        password,
      });
      const res = await newUser.save();

      return res;
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
  static async getUser(userId: string) {
    try {
      const user = await UserModel.findById(userId).populate("drivingLicense");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error : any) {
      throw new Error(error.message);
    }
  }
  static async getAllUsers(){
    try {
      const users = await UserModel.find();
      return users;
    } catch (error : any) {
      throw new Error(error.message);
    }
  }
    // TODO: WILL BE USED LATER
  static async deleteUser(operator: UserPayload, userId: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if(user._id.toString() !== operator.userId && !operator.isAdmin) {
        throw new UnauthorizedError("You are not allowed to delete this user");
      }
      await user.deleteOne(
        { _id: userId }
      );
    } catch (error : any) {
      throw new Error(error.message);
    }
  }
  
  static async banUser(operator: UserPayload,userId: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if(!operator.isAdmin) {
        throw new UnauthorizedError("You are not allowed to ban this user");
      }
      user.isBlocked = true;
      await user.save();
    } catch (error : any) {
      throw new Error(error.message);
    }
  }

  static async unbanUser(operator: UserPayload,userId: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if(!operator.isAdmin) {
        throw new UnauthorizedError("You are not allowed to ban this user");
      }
      user.isBlocked = false;
      await user.save();
    } catch (error : any) {
      throw new Error(error.message);
    }
  }

  static async updateUsername(operator: UserPayload, userId: string, username: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if(user._id.toString() !== operator.userId && !operator.isAdmin) {
        throw new UnauthorizedError("You are not allowed to delete this user");
      }
      user.username = username;
      await user.save();
    } catch (error : any) {
      throw new Error(error.message);
    }
  }

  static async updatePassword(operator: UserPayload, userId: string, password: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if(user._id.toString() !== operator.userId && !operator.isAdmin) {
        throw new UnauthorizedError("You are not allowed to delete this user");
      }
      user.password = password;
      await user.save();
    } catch (error : any) {
      throw new Error(error.message);
    }
  }

  static async verifyEmail(userId: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.isEmailVerified = true;
      await user.save();
    } catch (error : any) {
      throw new Error(error.message);
    }
  }

 
}

export default UserService;
