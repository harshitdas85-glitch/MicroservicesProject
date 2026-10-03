import type {Consumer} from 'kafkajs'
import { createKafkaClient } from './client'
import { logger } from '../logger/logger'
import { log } from 'node:console'

export async function createConsumer(
    clientId :string,
    groupId :string
):Promise<Consumer> {
    const kafka = createKafkaClient(clientId)
    const consumer = kafka.consumer({groupId})
     await consumer.connect();
     logger.info({clientId,groupId},"kafka consumer connected")
     return consumer 
}

export async function runConsumer(
    consumer:Consumer,
    topics:string[],
    handler : (payload:any)=>Promise<void>,
    options? : {fromBegining? : boolean}
):Promise<void>{
    await consumer.subscribe({
        topics,
        fromBeginning: options?.fromBegining ?? false
    })
    await consumer.run({ 
        eachMessage : async (payload)=>{
            const {topic,partition,message} = payload
            logger.info({
                topic,
                partition,
                offset:message.offset,
                key:message?.key?.toString()
        },
        "Kafka messages received"
    )
    await handler(payload)
        }
    })
}