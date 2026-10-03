import type { Request,Response,NextFunction } from "express";
import { Task } from "../utils/types";
import * as taskService from '../services/task.services'
import { AppError, successResponse } from "shared";
import { UserRole } from "shared";

function requireIdentity(req:Request): {
    userId: string;
    role: UserRole;
}{
    console.log(req.headers["x-user-id"])
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
export async function CreateTask(
    req:Request,
    res :Response,
    next : NextFunction
) {
    
    try {
        const {userId,role} = requireIdentity(req)
        const task = await taskService.createTask(req.body,userId)
        successResponse(res,{task},201)
    } catch (error) {
        next(error)
    }
}


export async function listTasks(
    req:Request,
    res:Response,
    next:NextFunction
){
    try{
        const {userId,role}  = requireIdentity(req)
        if(!userId || !role){
            throw new Error("No role or UserId")
        }
        const result = await taskService.listTasks(userId,role);
successResponse(res,result)
    }catch(error){
        next(error)
    }
}

export async function getSingleTask(
    req:Request,
    res:Response,
    next:NextFunction
){
    try{
     const {userId,role} = requireIdentity(req)
    const id = String(req.params.id)
       const task = await taskService.getSingleTask(id,userId,role)
   successResponse(res,task)
    }catch(error){
        next(error)
    }
}


export async function deleteSingleTask(
    req:Request,
    res:Response,
    next:NextFunction
){
    try{
         const {userId,role} = requireIdentity(req)
         const id = String(req.params.id)
         const result = await taskService.DeleteSingleTask(id,userId,role)
         successResponse(res,result)
    }catch(error){
        next(error)
    }
}