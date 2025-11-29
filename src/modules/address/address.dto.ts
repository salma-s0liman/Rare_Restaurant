import z from "zod";
import * as validators from "./address.validation";

export type ICreateAddressBodyDto = z.infer<
  typeof validators.createAddressValidation.body
>;
export type IUpdateAddressBodyDto = z.infer<
  typeof validators.updateAddressValidation.body
>;
export type IUpdateAddressParamsDto = z.infer<
  typeof validators.updateAddressValidation.params
>;
export type IAddressIdParamsDto = z.infer<
  typeof validators.addressIdValidation.params
>;
