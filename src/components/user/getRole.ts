"use server";

import prisma from "@/lib/prisma";
import {PermissionType} from "@prisma/client";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";

export async function getRole(userId?: string) : Promise<PermissionType> {
    if (!userId) {
        const header = headers();
        const sessionFromAuth = await auth.api.getSession({headers: header});
        if (!sessionFromAuth || !sessionFromAuth.session || !sessionFromAuth.session.userId) {
            return 'NONE';
        }
        userId = sessionFromAuth.session.userId;
    }
    const permissionType = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            permissionType: true
        }
    });

    if (!permissionType) {
        return 'NONE';
    }
    return permissionType.permissionType
}