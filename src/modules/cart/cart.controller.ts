import { Router } from "express";
import { auth, userRoleEnum, validation } from "../../common";
import * as validators from "./cart.validation";
import CategoryService from "./cart.service";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth([userRoleEnum.customer]),
  validation(validators.createCart),
  CategoryService.createCart
);



export default router;
