export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN"

export type JwtPayload = {
    userId : string,
    role : UserRole
}
