import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import authroutes from "./routes/auth.route";
import { AppError, errorHandler, httpLogger,logger, requireGatewaySecret, successResponse, } from "shared";
config({path:resolve(process.cwd(),'.env')})
config({path : resolve(process.cwd(),'../../.env')})

const PORT = process.env.AUTH_PORT || 3001
const app  = express()
app.use(httpLogger)
app.use(express.json())

app.get("/health",(_req,res)=>{
    successResponse(res,{service:"auth-service"})
})
app.use('/auth',requireGatewaySecret,authroutes)
app.use((req, _res, next) => {
    next();
});
app.use(errorHandler)
app.listen(PORT,()=>{
    logger.info(`Auth service is now running on port ${PORT}`)
})