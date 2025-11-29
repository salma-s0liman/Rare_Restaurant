import { Router } from "express";
import { AddressController } from "./address.controller";
import { auth, validation } from "../../common";
import * as validators from "./address.validation";

export const addressRoutes = (addressController: AddressController) => {
  const router = Router();

  // Create address
  router.post(
    "/",
    auth([]),
    validation(validators.createAddressValidation),
    addressController.createAddress
  );

  // Get all user addresses
  router.get("/", auth([]), addressController.getUserAddresses);

  // Get address by ID
  router.get(
    "/:id",
    auth([]),
    validation(validators.addressIdValidation),
    addressController.getAddressById
  );

  // Update address
  router.put(
    "/:id",
    auth([]),
    validation(validators.updateAddressValidation),
    addressController.updateAddress
  );

  // Delete address
  router.delete(
    "/:id",
    auth([]),
    validation(validators.addressIdValidation),
    addressController.deleteAddress
  );

  // Set primary address
  router.patch(
    "/:id/primary",
    auth([]),
    validation(validators.addressIdValidation),
    addressController.setPrimaryAddress
  );

  return router;
};
