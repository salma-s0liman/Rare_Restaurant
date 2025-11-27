import { NextFunction } from "express";
import { tokenTypeEnum } from "../enums/token.enum";
import { JwtPayload } from "jsonwebtoken";

export interface IDecodeParams {
  authorization?: string;
  tokenType?: tokenTypeEnum;
  next?: NextFunction;
}

export interface ITokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  jti?: string; // JWT ID for token revocation
}
