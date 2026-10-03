import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { createUser, findByEmail, findById } from "../repositories/user.repo";
import { AppError } from "shared";
import bcrypt from 'bcryptjs'
import { convertToPublic } from "../utils/auth.utils";
import { signToken } from "shared";

export async function register(input:RegisterInput){
const existing = await findByEmail(input.email);
if(existing){
    throw new AppError(409,"Email already registered")
}
const password_hashed = await bcrypt.hash(input.password,10)
const user = await createUser({
    name : input.name,
    email : input.email,
    passwordHash :password_hashed,
    role : "USER"
}
)
return convertToPublic(user)
}


export async function login(input: LoginInput) {

    const user = await findByEmail(input.email);
    if (!user) {
        throw new AppError(401, "Email or Password is wrong");
    }
    const correctpass = await bcrypt.compare(
        input.password,
        user.password_hash
    );
    if (!correctpass) {
        throw new AppError(401, "Email or password is wrong");
    }
    const token = signToken({
        userId: user.id,
        role: user.role
    });
    return {
        token,
        user: convertToPublic(user)
    };
}


export async function getMe(userId :string) {

    const user = await findById(userId);
    if (!user) {
        throw new AppError(404, "User Not Found");
    }
  return convertToPublic(user)
}