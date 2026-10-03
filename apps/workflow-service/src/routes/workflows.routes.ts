import {Router} from 'express'
import * as workflowController from '../controllers/workflows.controller'
const router = Router()

router.get("/:taskId/workflows",workflowController.listWorkflowByTask)


export default router