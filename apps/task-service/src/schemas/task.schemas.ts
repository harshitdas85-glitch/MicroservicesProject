import {z} from 'zod'

export const createTaskSchema = z.object({
    title: z.string().min(5,"Title is Required")
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>