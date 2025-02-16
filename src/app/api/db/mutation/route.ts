import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {Prisma, PermissionType} from "@prisma/client";

export const POST = auth(async function GET(req) {
    if (!req.auth){
        return Response.json("Unauthorized", {status: 401});
    }
    const {permission} = await req.json();
    if (!permission){
        return Response.json("Permission is required", {status: 400});
    }
    // Confirm type is of PermissionType
    if (!Object.values(PermissionType).includes(permission)){
        return Response.json("Invalid permission type " + permission, {status: 400});
    }

    const email = req.auth.user?.email
    if (!email){
        return Response.json("Email is required", {status: 400});
    }
    const userId = req.auth.user?.id;
    if (!userId){
        return Response.json("User not found", {status: 404});
    }
    let perm: Prisma.PermissionRequestsCreateInput;
    try {
        perm = {
            note: "client created request",
            permissionType: permission,
            status: "PENDING",
            user: {
                connect: {
                    email: email,
                    AND: {
                        id: userId
                    },
                }
            }
        }
    } catch (e) {
        return Response.json("Error creating permission request", {status: 500});
    }
    const newPermission = await prisma.permissionRequests.create(
        {
            data: perm
        }
    );
    if (!newPermission) {
        return Response.json("Error creating permission request", {status: 500});
    }
    return Response.json(newPermission, {status: 201});
});