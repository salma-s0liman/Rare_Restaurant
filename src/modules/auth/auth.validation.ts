import { z } from "zod";


export const signupValidation = {
    body: z.object({
        username: z.string({
            error:"userName must be a String"
        }).min(3).max(20),
        email: z.email(),
        password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        confirmPassword: z.string()
    }).superRefine((data, ctx) => {
        console.log({data, ctx})
        if(data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["conffirmPassword"],
                message: "Password do not match"
            })
        }
    })
};