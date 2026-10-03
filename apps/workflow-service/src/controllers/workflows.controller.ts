import { UserRole ,AppError, successResponse} from "shared";
 import { Request,Response,NextFunction } from "express";
 import * as workflowService from '../services/workflows.services'
 
 function requireIdentity(req:Request): {
    userId: string;
    role: UserRole;
}{
    const userId = req.headers["x-user-id"]
    const role = req.headers["x-user-role"]
    if(!role || !userId || typeof userId!== "string" || typeof role!= "string"){
        throw new AppError(401,"Missing user id")
    }
       if (role !== "USER" && role !== "ADMIN") {
        throw new AppError(403, "Invalid user role");
    }
    return {userId,role}
}

export async function listWorkflowByTask(
    req:Request,
    res:Response,
    next:NextFunction
){
    try{
    const {userId,role} = requireIdentity(req)
    const taskId = String(req.params.taskId)
    const workflows = await workflowService.listworkflowbyTask(taskId,userId,role)
    successResponse(res,{workflows})
    }
    catch(err){
        next(err)
    }
}