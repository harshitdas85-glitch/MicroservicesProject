import type {Request,Response,NextFunction} from "express"
import { AppError } from "../error/AppError"
import { config } from "dotenv"
import { resolve } from "node:path" 
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });


export function requireGatewaySecret(
    req : Request,
    _res : Response,
    next : NextFunction
){
    const expected = process.env.AUTH_GATEWAY_SECRET

    if(!expected){
       return next( new AppError(500,"AUTH_GATEWAY_SECRET NOT SET"))
    }
    const incoming = req.header("x-gateway-secret")
    if(!incoming || incoming !== expected){
       return  next(new AppError(403,"Forbidden"))
    }

next()
}