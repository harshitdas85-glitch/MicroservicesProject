import { Pool } from "pg";
let pool : Pool  | null = null;

export function getPool() : Pool{
if(!pool){
    const connectionString = process.env.DATABASE_URL
    if(!connectionString)
    { 
        throw new Error("Database url is not set")
    }
    pool = new Pool({connectionString})
}
return pool;
}
export async function closeConnection() : Promise<void>{
    if(pool){
        await pool.end()
        pool = null;
    }
}