import { createProducer, publishJsonSafe, TOPICS } from "shared";
import { Attachment } from "./utils/types";
import { timeStamp } from "node:console";



let producer  : Awaited<ReturnType<typeof createProducer>> | null = null
export async function initKafka(){
    producer = await createProducer("media-service")
}
export async function PublishAttachmentEvent(
    taskId:string,
    userId :string
){
await publishJsonSafe(producer,TOPICS.MEDIA_EVENTS,{
    eventType : "Attachment.uploaded",
    taskId,
    userId,
    message : "Attachment Uploaded",
    timestamp : new Date().toISOString()
},
taskId
)
}