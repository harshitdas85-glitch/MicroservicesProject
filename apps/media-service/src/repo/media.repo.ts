import { NextFunction } from "express"
import { Attachment } from "../utils/types" 
import { AppError, getPool } from "shared"
import { tryCast } from "typescript/unstable/ast"


 export async function createAttachment(input:
    {
        taskId : string,
        imageUrl:string,
        publicId:string,
        uploadedBy:string
    }
 ) : Promise<Attachment>{
const result  = await getPool().query<Attachment>(
    `
    INSERT INTO attachments (task_id,image_url,public_id,uploaded_by)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [input.taskId,input.imageUrl,input.publicId,input.uploadedBy]
)
return result.rows[0]
 }
 export async function findTaskAccess(taskId :string): Promise<{
    id:string,
    created_by:string
 } | null>{
const result = await getPool().query(
  `
  SELECT * FROM attachments WHERE id=$1

  `,[taskId]
)
return result.rows[0] ?? null
 }
 export async function listByTaskId(taskId:string):Promise<Attachment[]> {
    const result = await getPool().query<Attachment>(
        `
        SELECT * FROM attachments WHERE task_id=$1
        ORDER BY created_at DESC
        
        `,
        [taskId]
    )
    return result.rows ?? null
 }
