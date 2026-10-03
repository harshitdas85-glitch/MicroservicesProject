import { User, UserRole } from "../types/auth.types";

export function convertToPublic(user:User){
    return {
        id: user.id,
        name :user.name,
        email:user.email,
        role:user.role,
        createdAt : user.created_at
    }
}
