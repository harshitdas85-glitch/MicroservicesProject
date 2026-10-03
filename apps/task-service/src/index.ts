import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import taskRoutes from "./routes/tasks.route"
import { AppError, errorHandler, httpLogger,logger, requireGatewaySecret, successResponse, } from "shared";
import { initKafka } from "./kafka";
config({path:resolve(process.cwd(),'.env')})
config({path : resolve(process.cwd(),'../../.env')})
const PORT = process.env.TASK_PORT || 3001
const app  = express()
app.use(httpLogger)
app.use(express.json())

app.get("/health",(_req,res)=>{
    successResponse(res,{service:"auth-service"})
})
app.use("/tasks",requireGatewaySecret,taskRoutes)





app.use((req, _res, next) => {
    next();
});
app.use(errorHandler)


async function initStartUp(){
    try {
      await initKafka()  
    } catch (err) {
        logger.error({err},"kafka producer init failed")
    }
    app.listen(PORT,()=>{
        logger.info(`TASK service is now running on port ${PORT}`)
    })
}
initStartUp()