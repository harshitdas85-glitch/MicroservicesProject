
import { Task } from "./types"

export function convertToPublic(task:Task){
    return {
        id: task.id,
        title : task.title,
        status :task.status,
        
        createdBy : task.created_by,
        createdAt : task.created_at,
        updatedAt : task.updated_at
    }
}