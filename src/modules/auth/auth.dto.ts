import z from "zod";
import * as validators from "./auth.validation";

export type ISignupBodyInputsDto = z.infer<
  typeof validators.signupValidation.body
>;

export type ILoginBodyInputsDto = z.infer<
  typeof validators.loginValidation.body
>;
