import { Router} from "express";
import { validateBody } from "shared";
import { createTaskSchema } from "../schemas/task.schemas";
import * as taskController from '../controllers/task.controllers'
const router  = Router()



router.post("/",validateBody(createTaskSchema),taskController.CreateTask)
router.get("/list",taskController.listTasks)
router.get('/:id',taskController.getSingleTask)
router.delete('/:id',taskController.deleteSingleTask)

export default router;