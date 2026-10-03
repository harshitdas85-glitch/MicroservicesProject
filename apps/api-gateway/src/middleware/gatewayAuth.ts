import type { Request, Response, NextFunction } from "express";
import { AppError } from "shared";
import { getAllowedRoles, isPublicRoute } from "../rbac";
import {verifyToken} from "shared";
const IDENTITY_HEADER = [
    "x-user-id",
    "x-user-role",
    "x-gateway-secret"
] as const;


function stripIdentityHeaders(req: Request) {
    for (const header of IDENTITY_HEADER) {
       delete req.headers[header];
    }
}
function attachGatewaySecret(req: Request) {
    const secret = process.env.AUTH_GATEWAY_SECRET;
    if (!secret) {
        throw new AppError(500, "AUTH_GATEWAY_SECRET NOT SET");
    }
    req.headers["x-gateway-secret"] = secret;

}



function requestpath(
    req: Request){
const combinedPath = `${req.baseUrl}${req.path}`
if(combinedPath.length > 1 && combinedPath.endsWith("/")){
    return combinedPath.slice(0,-1)
    }
    return combinedPath || "/"
  
}

function attachUserHeaders(req: Request, userId: string, role: string) {
    req.headers["x-user-id"] = userId;
    req.headers["x-user-role"] = role;
}
export function gatewayAuthMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    try {
        stripIdentityHeaders(req);
        attachGatewaySecret(req);
        const path = requestpath(req);
        if(isPublicRoute(req.method, path)){
          return  next();
        }

        const authHeader = req.header("authorization");
        if(!authHeader?.startsWith("Bearer ")){
            throw new AppError(401,"Missing or invalid Authorization header")
        }   
        const token = authHeader.slice("Bearer ".length).trim();
        const payload = verifyToken(token);
       
        if(!payload.userId || !payload.role){
            throw new AppError(401,"Invalid Token")
        }
        
       const allowedRoles = getAllowedRoles(req.method, path);

       if(!allowedRoles){
        throw new AppError(404,"Route not found")
       }
       if(!allowedRoles.includes(payload.role)){
        throw new AppError(403,"Forbidden")
       }
     attachUserHeaders(req,payload.userId,payload.role)
        next();
    } catch (error) {
      return  next(error);
    }
}