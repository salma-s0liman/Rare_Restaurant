import { Request, Response, NextFunction } from "express";
import { AddressService } from "./address.service";

export class AddressController {
  constructor(private addressService: AddressService) {}

  createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await this.addressService.createAddress(userId, req.body);
      res.status(201).json({
        success: true,
        message: "Address created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserAddresses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const result = await this.addressService.getUserAddresses(userId);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAddressById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const result = await this.addressService.getAddressById(id!, userId);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const result = await this.addressService.updateAddress(
        id!,
        userId,
        req.body
      );
      res.json({
        success: true,
        message: "Address updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await this.addressService.deleteAddress(id!, userId);
      res.json({
        success: true,
        message: "Address deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  setPrimaryAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const result = await this.addressService.setPrimaryAddress(id!, userId);
      res.json({
        success: true,
        message: "Primary address updated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
