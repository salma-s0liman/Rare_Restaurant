import { Router } from "express";
import * as validators from "./auth.validation";
import authService from "./auth.service";
import { validation } from "../../common/";
const router: Router = Router();

router.post(
  "/signup",
  validation(validators.signupValidation),
  authService.signup
);

router.post(
  "/login",
  validation(validators.loginValidation),
  authService.login
);

export default router;
