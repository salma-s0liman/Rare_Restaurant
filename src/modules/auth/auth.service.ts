import { ISignupBodyInputsDto } from "./auth.dto";
import { userRepository } from "./auth.repository";
import {
  ApplicationException,
  ConflictException,
  genderEnum,
  generateEncryption,
  generateHash,
  userRoleEnum,
} from "../../common";
import type { Request, Response, NextFunction } from "express";
import { emailEvent } from "../../common/utils/email";

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

    // note: create() in our BaseRepository returns the single object, not an array
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
      otp: "123456", 
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: user.id,
      date: user,
    });
  };
}

export default new AuthenticationService();
