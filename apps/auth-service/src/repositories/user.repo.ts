import { UserRole } from "../types/auth.types"
import { User } from "../types/auth.types"
import { getPool } from "shared"

export async function createUser(input : {
    name : string,
    email : string,
    passwordHash : string,
    role?: UserRole 
}):Promise<User>{
 const result = await  getPool().query<User>(
    `
    INSERT INTO users (name,email,password_hash,role)
    VALUES ($1 , $2,$3 , $4)
    RETURNING *
    `,
  [input.name,input.email,input.passwordHash,input.role ?? "USER"]
 )
 return result.rows[0]
}

export async function findByEmail(email: string): Promise<User | null> {
   

    const pool = getPool();

   

    const result = await pool.query<User>(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

 

    return result.rows[0] ?? null;
}

export async function findById(id: string): Promise<User | null> {
    const result = await getPool().query<User>(
        `SELECT * FROM users WHERE id = $1`,
        [id]
    );

   

    return result.rows[0] ?? null;
}