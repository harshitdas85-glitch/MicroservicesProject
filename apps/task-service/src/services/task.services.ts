import { CreateTaskInput } from "../schemas/task.schemas";
import * as taskRepo from '../repos/task.repository'
import { convertToPublic } from "../utils/task.utils";
import { AppError, UserRole } from "shared";
import { publishTaskEvent } from "../kafka";
export async function createTask(input:CreateTaskInput,userId :string){
    const newlyCreatedTask = await taskRepo.createTask({
        title :input.title,
        created_by : userId
    })
    await publishTaskEvent(newlyCreatedTask.id,userId)
    return convertToPublic(newlyCreatedTask)
}

export async function listTasks(userId:string,role:UserRole){
       if (role !== "USER" && role !== "ADMIN") {
        throw new Error( "Invalid user role");
    }
const lists = await taskRepo.listTickets({userId,role})
return lists; 
} 

export async function getSingleTask(id:string,userId:string,role:UserRole){
   if(!id || !userId || !role){
    throw new AppError(401,"No userid or role")
   }
   const task = await taskRepo.findById({id})
   if(!task){
    throw new AppError(404,"Task not Found")
   }
   if(role !== "ADMIN" && task.created_by !== userId){
    throw new AppError(403,"forbidden")
   }
return task
}

export async function DeleteSingleTask(id:string,userId:string,role:UserRole){
   if(!id || !userId || !role){
    throw new AppError(401,"No userid or role")
   }
   if(role !=="ADMIN"){
    throw new AppError(403,"forbidden")
   }
   const task = await taskRepo.deleteSingleTaskById(id)
   if(!task){
    throw new AppError(404,"Task not Found")
   }
return {id}
}