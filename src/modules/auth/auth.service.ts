import { Request, Response } from "express";
import { ISignupBodyInputsDto } from "./auth.dto";

class AuthenticationService {
  constructor() {}

  public async signup(req: Request, res: Response): Promise<Response> {
    let {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      gender,
      role,
      vehicleInfo,
      isActive,
    }: ISignupBodyInputsDto = req.body;
    console.log({
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      gender,
      role,
      vehicleInfo,
      isActive,
    });

    return res.status(201).json({ message: "Done", data: req.body });
  }
}

export default new AuthenticationService();
