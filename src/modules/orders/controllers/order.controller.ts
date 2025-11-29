import { Router } from "express";
import * as validators from "../validations/orders.validation";
import { validation } from "../../../common";
import OrdersService from "../services/order.service";

const router: Router = Router();

// Create Order

router.post(
  "/",
  validation(validators.createOrderValidation),
  OrdersService.createOrder
);

export default router;
