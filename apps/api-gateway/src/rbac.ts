import type {UserRole} from "shared"
export type RbacRule = {
    method : string,
    path : string,
    roles : UserRole[]
}
export const PublicRoutes = [
    {
        method : "POST",
        path : "/auth/login",
    },
    {
        method : "POST",
        path : "/auth/register",

    }
    ] as const;

const rbacRules : RbacRule[] = [
    {
        method : 'GET',
        path : '/auth/getme',
        roles : ['USER','ADMIN']
    },
    {
        method:'POST',
        path : '/tasks',
        roles  : ['USER','ADMIN']
    },
    {
         method:'GET',
        path : '/tasks/list',
        roles  : ['USER','ADMIN']
    },
     {
         method:'GET',
        path : '/tasks/:id',
        roles  : ['USER','ADMIN']
    },
     {
         method:'DELETE',
        path : '/tasks/:id',
        roles  : ['ADMIN']
    },
     {
         method:'POST',
        path : '/tasks/:taskId/attachments',
        roles  : ['USER','ADMIN']
    },
    {
         method:'GET',
        path : '/tasks/:taskId/attachments',
        roles  : ['USER','ADMIN']
    },
     {
         method:'GET',
        path : '/tasks/:taskId/workflows',
        roles  : ['USER','ADMIN']
    }
]


function matchPath(pattern : string , actual:string):boolean{
    if(pattern === actual){
        return true
    }
    const patternParts = pattern.split('/')
    const actualParts = actual.split('/')
    if(patternParts.length !== actualParts.length){
        return false
    }
    return patternParts.every((part,index) => {
        if(part.startsWith(':')){
            return true
        }
        return part === actualParts[index]
    })
}
export function isPublicRoute(method : string, path : string):boolean{
     return PublicRoutes.some(route => route.method === method && matchPath(route.path,path))
}
export function getAllowedRoles(
method : string, path : string):UserRole[] | null{

    const rule = rbacRules.find(rule => rule.method === method && matchPath(rule.path,path))
    if(!rule){
        return null
    }
    return rule?.roles ?? null
}