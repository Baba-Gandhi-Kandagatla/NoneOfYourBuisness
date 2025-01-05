import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";



export const validate = (validations:ValidationChain[])=>{
    return async(req: Request,res:Response,next:NextFunction)=>{
        for(let validation of validations){
            const result = await validation.run(req);
            if(!result.isEmpty())
                {
                    break;
                }
        }
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        return res.status(422).json({error: errors.array()});
    };
};


export const loginValidator = [
    body("password")
        .trim()
        .isLength({ min: 8 }).withMessage("Password should contain at least 8 characters")
        .matches(/[A-Z]/).withMessage("Password should contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password should contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password should contain at least one number")
        .matches(/[\W_]/).withMessage("Password should contain at least one special character"),
];

