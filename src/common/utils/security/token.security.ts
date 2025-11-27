import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
  ApplicationException,
  IDecodeParams,
  ITokenPayload,
  signatureTypeEnum,
  tokenTypeEnum,
} from "../..";
import { User } from "../../../DB";

// 2. Generate Token
export const generateToken = async ({
  payload = {},
  signature = process.env.ACCESS_TOKEN_USER_SIGNATURE || "",
  options = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRATION_IN ??
      "7d") as unknown as number,
  },
}: {
  payload: any;
  signature?: string;
  options?: jwt.SignOptions;
}): Promise<string> => {
  // Add jti (JWT ID) to the payload for blacklisting
  const tokenPayload = {
    ...payload,
    jti: uuidv4(), // Unique identifier for this token
  };
  return jwt.sign(tokenPayload, signature, options);
};

// 3. Verify Token
export const verifyToken = async ({
  token = "",
  signature = process.env.ACCESS_TOKEN_SYSTEM_SIGNATURE || "default_secret",
}: {
  token: string;
  signature?: string;
}): Promise<ITokenPayload> => {
  return jwt.verify(token, signature) as ITokenPayload;
};

// 4. Get Signature Logic
export const getSignature = (signatureLevel: string) => {
  const signatures = {
    accessSignature:
      process.env.ACCESS_TOKEN_USER_SIGNATURE || "default_access_secret",
    refreshSignature:
      process.env.REFRESH_TOKEN_USER_SIGNATURE || "default_refresh_secret",
  };

  if (signatureLevel === signatureTypeEnum.System) {
    signatures.accessSignature =
      process.env.ACCESS_TOKEN_SYSTEM_SIGNATURE || "default_sys_access";
    signatures.refreshSignature =
      process.env.REFRESH_TOKEN_SYSTEM_SIGNATURE || "default_sys_refresh";
  }

  return signatures;
};

// 5. Decoded Token

export const decodedToken = async ({
  authorization = "",
  tokenType = tokenTypeEnum.Access,
  next,
}: IDecodeParams): Promise<User | void> => {
  const [bearer, token] = authorization?.split(" ") || [];

  if (!bearer || !token) {
    const error = new ApplicationException(
      "Token is missing or invalid format",
      401
    );
    if (next) return next(error);
    throw error;
  }

  // C. Get Correct Signature (System vs Bearer)
  const signatures = getSignature(bearer);
  const signatureToUse =
    tokenType === tokenTypeEnum.Access
      ? signatures.accessSignature
      : signatures.refreshSignature;

  try {
    const decoded = await verifyToken({ token, signature: signatureToUse });

    // Check if token JTI is blacklisted (logged out)
    if (decoded.jti) {
      // Lazy import to avoid circular dependency
      const { tokenRepository } = await import(
        "../../../modules/auth/token.repository"
      );
      const isBlacklisted = await tokenRepository.isJtiBlacklisted(decoded.jti);
      if (isBlacklisted) {
        const error = new ApplicationException("Token has been revoked", 401);
        if (next) return next(error);
        throw error;
      }
    }

    // Lazy import to avoid circular dependency
    const { userRepository } = await import(
      "../../../modules/user/user.repository"
    );
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      const error = new ApplicationException(
        "User not registered or found",
        404
      );
      if (next) return next(error);
      throw error;
    }

    return user;
  } catch (error: any) {
    // Handle JWT specific errors
    const message =
      error.name === "TokenExpiredError" ? "Token expired" : "Invalid Token";
    const appError = new ApplicationException(message, 401);

    if (next) return next(appError);
    throw appError;
  }
};

export const generateAuthTokens = async (
  payload: any,
  roleLevel: string = "Bearer"
): Promise<{ accessToken: string; refreshToken: string } | void> => {
  const signatures = getSignature(roleLevel);

  // 2. Generate Access Token
  const accessToken = await generateToken({
    payload,
    signature: signatures.accessSignature,
    options: {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION_IN) || "1h",
    },
  });

  // 3. Generate Refresh Token
  const refreshToken = await generateToken({
    payload,
    signature: signatures.refreshSignature,
    options: {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRATION_IN) || "7d", // e.g. 7 days
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};
