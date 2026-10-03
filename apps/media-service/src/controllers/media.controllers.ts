import type { Request,Response,NextFunction } from "express";
import {AppError, successResponse, UserRole } from "shared";
import * as attachmentService from '../services/media.services'



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
export async function uploadAttachments(
req:Request,
res:Response,
next:NextFunction

) {
    try {
        const {userId,role} = requireIdentity(req)
        const taskId = String(req.params.taskId)
        const attachment = await attachmentService.uploadAttachment({
            taskId,
            userId,
            role,
            file : req.file
        });
        successResponse(res, {attachment},201)
    } catch (err) {
        next(err)
    }
}
 export async function listAttachments(
    req:Request,
    res:Response,
    next:NextFunction
 ){
    try {
        const {userId,role} = requireIdentity(req)
        const taskId = String(req.params.taskId)
        const extractAttachments = await attachmentService.listTasksByID(taskId,userId,role)
        successResponse(res,extractAttachments)
    } catch (error) {
        
    }
 }