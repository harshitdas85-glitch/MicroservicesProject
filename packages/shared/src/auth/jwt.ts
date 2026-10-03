import jwt from "jsonwebtoken";
import { JwtPayload } from "./types";

function extractJwt():string{
    const secret = process.env.JWT_SECRET
    if(!secret){
        throw new Error("JWT_SECRET NOT SET")
    }
    return secret
}
export function signToken(payload : JwtPayload): string{
    const expiresIn = process.env.JWT_EXPIRES_IN

   return jwt.sign(payload,extractJwt(),{
    expiresIn : expiresIn as jwt.SignOptions["expiresIn"]
   })
}

export function verifyToken(token : string): JwtPayload{
    try{
        const decoded = jwt.verify(token,extractJwt())
        if(typeof decoded !== "object" || decoded === null || !("userId" in decoded) || !("role" in decoded)){
throw new Error("Invalid Token")
        }
        return decoded as JwtPayload
    }catch(err){
        throw new Error("Invalid Token")
    }
}