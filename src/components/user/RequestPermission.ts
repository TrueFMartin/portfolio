"use server";

import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {Prisma, PermissionType} from "@prisma/client";
import {PermissionRequestType} from "@/app/utils/types";

export async function requestPermission(
    permission: PermissionType,
)  {
    const session = await auth();
    if (!session) {
        return {message: "no auth session"}
    }
    const email = session.user?.email
    if (!email) {
        return {message: "email address is required"}
    }
    const userId = session.user?.id;
    if (!userId) {
        return {message: "user not found"}
    }
    let perm: Prisma.PermissionRequestsCreateInput = {
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
    const newPermission: PermissionRequestType = await prisma.permissionRequests.create(
        {
            data: perm
        }
    );
    if (!newPermission) {
        return {message: "Error creating permission request"}
    }
    return newPermission;
}