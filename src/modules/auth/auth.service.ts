import type { Request, Response, NextFunction } from "express";
import { ILoginBodyInputsDto, ISignupBodyInputsDto } from "./auth.dto";
import { userRepository } from "../user/user.repository";
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
      payload: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
    console.log(token);

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
}

export default new AuthenticationService();
