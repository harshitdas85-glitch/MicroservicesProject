import {Request,Response,NextFunction} from 'express'
import { success, unknown } from 'zod'
import  {AppError} from './AppError'


export function errorHandler(
    err : any,
    _req : Request,
    res : Response,
    _next : NextFunction
){
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success : false,
            message : err.message
        })
    }
 console.error("========== ERROR ==========");
  console.error("Message:", err.message);
  console.error("Status:", err.statusCode);
  console.error("Stack:", err.stack);
  console.error("===========================");


  return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}