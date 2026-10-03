import { AppError, UserRole } from "shared";
import * as attachmentRepo from '../repo/media.repo'
import { uploadBuffer } from "../utils/storage";
import { PublishAttachmentEvent } from "../kafka";
async function assertTaskAccess(
    taskId:string,
    userId : string,
    role:string
){
    const task = await attachmentRepo.findTaskAccess(taskId)
    if(!task){
        return new AppError(404,"Task not Found")

    }
    if(role!="ADMIN" && task.created_by !== userId){
        throw new AppError(403,"forbidden")
    }

}
 

export async function uploadAttachment(input:{
    taskId:string,
    userId : string,
    role:UserRole
     file? : Express.Multer.File
}) {
    if(!input.file){
        throw new AppError(400,"Image file is required")
    }
    await assertTaskAccess(input.taskId,input.userId,input.role)
    const uploaded = await uploadBuffer(
        input.file.buffer,
        input.file.mimetype || "image/jpeg"
    )
    const attachment = await attachmentRepo.createAttachment({
        taskId:input.taskId,
        imageUrl : uploaded.imageUrl,
        publicId : uploaded.publicId,
        uploadedBy: input.userId
    })
    await PublishAttachmentEvent(input.taskId,input.userId)
    return attachment
}

export async function listTasksByID(taskId:string,userId:string,role:UserRole){
    if(!role || !userId || !taskId){
        throw new Error("role or userid or taskid missing")
    }
    await assertTaskAccess(taskId,userId,role)
    const result = await attachmentRepo.listByTaskId(taskId)
    return result
}