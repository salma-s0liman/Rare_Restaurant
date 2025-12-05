import { Request, Response, NextFunction } from "express";
import {
  ApplicationException,
  decodedToken,
  tokenTypeEnum,
} from "../../common";

export const auth = (accessRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      console.log("Authorization header received:", authorization);

      if (!authorization) {
        return next(
          new ApplicationException("Authorization header missing", 401)
        );
      }

      // We pass 'next' so decodedToken can handle token errors automatically
      const user = await decodedToken({
        authorization,
        tokenType: tokenTypeEnum.Access,
        next,
      });

      // If decodedToken failed, it already called next(error), so user will be void/undefined
      if (!user) return;
      if (accessRoles.length > 0 && !accessRoles.includes(String(user.role))) {
        return next(
          new ApplicationException("Not authorized to access this route", 403)
        );
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
