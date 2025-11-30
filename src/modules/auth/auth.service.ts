import type { Request, Response, NextFunction } from "express";
import { ILoginBodyInputsDto, ISignupBodyInputsDto } from "./auth.dto";
import { UserRepository } from "../user/repositories/user.repository";
import { AppDataSource } from "../../DB/data-source";
import { User } from "../../DB/entity/user";
import { tokenRepository } from "./token.repository";
import {
  ApplicationException,
  BadRequestException,
  compareHash,
  ConflictException,
  genderEnum,
  generateEncryption,
  generateHash,
  userRoleEnum,
  emailEvent,
  generateAuthTokens,
  verifyToken,
} from "../../common";

class AuthenticationService {
  constructor() {}

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const {
      email,
      password,
      phone,
      firstName,
      lastName,
      gender,
      role,
      vehicleInfo,
      isActive,
    } = req.body as ISignupBodyInputsDto;
    
    const userRepository = new UserRepository(AppDataSource.getRepository(User));
    const checkUserExist = await userRepository.findByEmail(email);

    if (checkUserExist) {
      throw new ConflictException(
        "User with this email or phone already exists"
      );
    }

    const user = await userRepository.create({
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phone: (await generateEncryption(phone)) || "",
      gender: gender || genderEnum.other,
      password: (await generateHash(password)) || "",
      role: role || userRoleEnum.customer,
      vehicle_info: vehicleInfo || "",
      is_active: isActive || false,
    });

    if (!user) {
      throw new ApplicationException("Failed to create user", 400);
    }

    emailEvent.emit("ConfirmEmail", {
      email: user.email,
      otp: String(Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)),
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: user.id,
      date: user,
    });
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { email, password } = req.body as ILoginBodyInputsDto;

    const userRepository = new UserRepository(AppDataSource.getRepository(User));
    const user = await userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "role", "firstName", "lastName"],
    });

    if (!user) {
      throw new BadRequestException("Invalid email or password");
    }

    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException("Invalid email or password");
    }

    // 5. Generate Token
    const token = await generateAuthTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new BadRequestException("Authorization header missing");
      }

      const [bearer, token] = authorization.split(" ");

      if (!bearer || !token) {
        throw new BadRequestException("Invalid token format");
      }

      // 1. Verify token is valid and get jti
      const decoded = await verifyToken({
        token,
        signature: process.env.ACCESS_TOKEN_USER_SIGNATURE || "",
      });

      if (!decoded.jti) {
        throw new BadRequestException("Token does not contain JTI");
      }

      // 2. Verify user exists
      const userRepository = new UserRepository(AppDataSource.getRepository(User));
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        throw new BadRequestException("User not found");
      }

      const existing = await tokenRepository.findByJti(decoded.jti);
      if (existing) {
        return res.status(200).json({
          message: "Already logged out",
        });
      }

      await tokenRepository.create({
        jti: decoded.jti,
        createdBy: user.id,
        expiredAt: new Date(decoded.exp! * 1000), // Convert Unix timestamp to Date
      });

      return res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new BadRequestException("Token already expired");
      }
      if (error.name === "JsonWebTokenError") {
        throw new BadRequestException("Invalid token");
      }
      throw error;
    }
  };
}

export default new AuthenticationService();
