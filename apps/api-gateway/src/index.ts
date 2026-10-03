import {config} from 'dotenv';
import {resolve} from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit, { MINUTE } from 'express-rate-limit';
import { AppError, errorHandler, httpLogger, successResponse } from 'shared';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { gatewayAuthMiddleware } from './middleware/gatewayAuth';
config({path: resolve(process.cwd(), '.env')})
config ({path : resolve(process.cwd(), '../../.env')})

const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || "http://localhost:3002"
const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL || "http://localhost:3003"
const WORKFLOW_SERVICE_URL = process.env.WORKFLOW_SERVICE_URL || "http://localhost:3004"
const app = express();
app.use(helmet());
app.use(cors());
app.use(
    rateLimit({
        windowMs: 15 * MINUTE, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
)
app.use(httpLogger)
app.use("/health", (_req,res)=>{
    successResponse(res,{service : "api-gateway"})
})

app.use("/auth",
    gatewayAuthMiddleware,
    createProxyMiddleware({
        target : AUTH_SERVICE_URL,
        changeOrigin : true,
        pathRewrite : (path)=> `/auth${path}`,
}))
const TaskProxy = createProxyMiddleware(
    {
        target : TASK_SERVICE_URL,
        changeOrigin:true,
        pathRewrite : (path)=> `/tasks${path}`,
    }
)
const MediaProxy = createProxyMiddleware(
    {
        target : MEDIA_SERVICE_URL,
        changeOrigin:true,
        pathRewrite : (path)=> `/tasks${path}`,
    }
)
const WorkflowProxy = createProxyMiddleware(
    {
        target : WORKFLOW_SERVICE_URL,
        changeOrigin:true,
        pathRewrite : (path)=> `/tasks${path}`,
    }
)
app.use("/tasks",gatewayAuthMiddleware,(req,res,next)=>{
    if(req.path.includes("/attachments")){
        return MediaProxy(req,res,next)
    }
     if(req.path.includes("/workflows")){
        return WorkflowProxy(req,res,next)
    }

    return TaskProxy(req,res,next)
})
app.use((_req,res,next)=>{
    next(new AppError(404,"Route not found"))
})
app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`API Gateway is running on port ${PORT}`)
})