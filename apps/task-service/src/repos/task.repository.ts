import  {Task}  from "../utils/types";
import { getPool } from "shared";


export async function createTask(input: {
    title :string,
    created_by : string
}):Promise<Task>{
const result  = await getPool().query<Task>(
    `
    INSERT INTO tasks(title,created_by)
    VALUES ($1,$2)
    RETURNING *
    `,
     [input.title,input.created_by]
)
return result.rows[0]
}
export async function listTickets(input:{
    userId : string,
    role : "USER" | "ADMIN"
}):Promise<Task[]>{
if(input.role === "ADMIN"){
const result = await getPool().query<Task>(
`
SELECT * FROM tasks
ORDER BY created_at DESC
`,
)
return result.rows
}

const result = await getPool().query<Task>(
`
SELECT * FROM tasks WHERE created_by = $1
ORDER BY created_at DESC
`,[input.userId]

)
    
return result.rows
}
export async function findById(input:{
    id :string
}):Promise<Task | null>{
   const result = await getPool().query(
    `
    SELECT * FROM tasks WHERE id=$1
    `,[input.id]
   )

   return result.rows[0] ?? null

}
export async function deleteSingleTaskById(id:string):Promise<Boolean>{
   const result = await getPool().query(
    `
    DELETE FROM tasks WHERE id=$1
    `,[id]
   )

   return (result.rowCount ?? 0) > 0

}


