import { AppError, createConsumer,logger, runConsumer, TOPICS, UserRole } from "shared";
import { DomainEvent } from "../utils/types";
import * as workflowRepo from '../repos/workflows.repos'



async function handleDomainEvent(rawData:DomainEvent){
    if(!rawData.eventType || !rawData.taskId || !rawData.userId || !rawData.message){
        logger.warn({rawData},"invalid Domain event")
        return
    }
    const workflow = await workflowRepo.createWorkflow({
        task_id : rawData.taskId,eventType:rawData.eventType , message : rawData.message , createdBy : rawData.userId
    })
    logger.info({
        workflowId:workflow.id,
        eventType:workflow.event_type
    },
"workflow row created");
}
export async function startkafka(){
    const consumer = await createConsumer(
        "workflow-service",
        "workflow-service-group"
    )
    void runConsumer(consumer,[TOPICS.MEDIA_EVENTS,TOPICS.TASK_EVENTS],async({message})=>{
        const value = message.value?.toString();
        if(!value)return;
        try {
            await handleDomainEvent(JSON.parse(value) as DomainEvent)
            
        } catch (err) {
            logger.error({err},"workflow consumer failed")
        }
    })
}

export async function listworkflowbyTask(
    taskId:string,
    userId:string,
    role:UserRole
){
const task = await workflowRepo.findTaskOwner(taskId)
if(!task){
    throw new AppError(404,"TASK NOT FOUND")
    
}
if(role !== "ADMIN" && task.created_by !== userId ){
    throw new AppError(403,"forbidden")
}
const rows = await workflowRepo.listworkflowbyTaskId(taskId)
return rows
}
