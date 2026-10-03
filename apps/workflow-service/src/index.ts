import {config} from 'dotenv'
import {resolve} from 'node:path'
import express from 'express'
import { httpLogger,errorHandler,logger,successResponse, requireGatewaySecret } from 'shared'
import { startkafka } from './services/workflows.services'
import workflowRoutes from './routes/workflows.routes'
config({path: resolve(process.cwd(),'.env')})
config({path: resolve(process.cwd(),'../../.env')})
const PORT = process.env.WORKFLOW_PORT || 3004
const app = express()
app.use(httpLogger)
app.use(express.json())

app.get("/health",(_req,res)=>{
    successResponse(res,{service:"workflow-service"})
})


app.use("/tasks",requireGatewaySecret,workflowRoutes)


app.use((req, _res, next) => {
    next();
});
app.use(errorHandler)


async function initStart(){
    try {
        await startkafka()
    } catch (err) {
        logger.error({err},"kafka consumer init failed here")
    }
    app.listen(PORT,()=>{
            logger.info(`Kafka service is now running on port ${PORT}`)
        })

    }
    initStart()
