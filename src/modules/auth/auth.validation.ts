import { z } from "zod";
import { genderEnum, userRoleEnum } from "../../commen";

export const signupValidation = {
  body: z
    .object({
      id: z.uuid().optional(),
      firstName: z
        .string({
          error: "firstName must be a String",
        })
        .min(3)
        .max(20),
      lastName: z
        .string({
          error: "lastName must be a String",
        })
        .min(3)
        .max(20),
      phone: z
        .string()
        .regex(/^(002|\+2)?01[0125][0-9]{8}$/, {
          error: "Invalid phone number",
        }),
      email: z.email(),
      gender: z.enum(genderEnum, {
        error: "Invalid gender type, Expected male, female or other",
      }).optional(),
      role: z.enum(userRoleEnum, {
        error: "Invalid role type, Expected customer, delivery or admin",
      }).optional(),
      vehicleInfo: z.string().min(1).optional().nullable(),
      isActive: z.boolean().optional().default(false),
      password: z
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
      confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Password do not match",
        });
      }

      if (data.role === userRoleEnum.delivery) {
        if (!data.vehicleInfo) {
          ctx.addIssue({
            code: "custom",
            path: ["vehicleInfo"],
            message: "Vehicle info is required for delivery accounts",
          });
        }
      }

      if (data.role === userRoleEnum.delivery) {
        if (data.isActive === false) {
          ctx.addIssue({
            code: "custom",
            path: ["isActive"],
            message: "isActive is required for delivery accounts",
          });
        }
      }
    }),
};
