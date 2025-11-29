import { Router } from "express";
import * as validators from "./orders.validation";
import { validation } from "../../common";
import OrdersService from "./orders.service";

const router: Router = Router();

// Create Order

router.post(
  "/",
  validation(validators.createOrderValidation),
  OrdersService.createOrder
);

export default router;
