import { config } from "dotenv";
import express from 'express'
import { resolve } from "node:path";
import { httpLogger,requireGatewaySecret,errorHandler,logger, successResponse } from "shared";
import attachmentRoutes from './routes/media.routes'
import { initKafka } from "./kafka";

config({path : resolve(process.cwd(),'.env')})
config({path : resolve(process.cwd(),'../../.env')})
const PORT = process.env.MEDIA_PORT || 3003


const app = express()
app.use(httpLogger)
app.use(express.json())
app.get("/health",(req,res)=>{
successResponse(res,{service:"media-service"})
})
app.use("/tasks",requireGatewaySecret,attachmentRoutes)
app.use((req, _res, next) => {
    next();
});
app.use(errorHandler)
async function initStartUp(){
    try {
      await  initKafka()
    } catch (err) {
        logger.error({err}, "kafka producer init failed")
    }
    app.listen(PORT,()=>{
        logger.info(`Media service is now running on port ${PORT}`)
    })
}
initStartUp()