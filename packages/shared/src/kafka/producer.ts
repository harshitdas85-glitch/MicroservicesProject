import type {Producer} from 'kafkajs'
import { createKafkaClient } from './client'
import { logger } from '../logger/logger'



export async function createProducer(clientId : string):Promise<Producer>{
    const kafka = createKafkaClient(clientId)
    const producer = kafka.producer()

await producer.connect()
logger.info({clientId}, "kafka producer connected")
return producer

}

export async function publishJson(
    producer : Producer,
    topic:string,
    payload:Record<string,unknown>,
    key? : string 
){
    const result = await producer.send({
        topic,
        messages:[
            {
                key: key ?? null,
                value : JSON.stringify(payload)
            }
        ]
    })
    logger.info({topic,payload},"kafka event published")
    return result
}

export async function publishJsonSafe(
    producer : Producer | null,
    topic : string,
    payload : Record<string,unknown>,
    key?:string

):Promise<void>{
    if(!producer){
        logger.warn({topic},"kafka producer is not ready")
        return 
    }
    try {
        await publishJson(producer,topic,payload,key)
        
    } catch (error) {
        
    }
}