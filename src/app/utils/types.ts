import {PermissionType} from "@prisma/client";

export type PermissionRequestType = ({
    id: string,
    userId: string,
    note: string | null,
    status: string,
    permissionType: PermissionType
    createdAt: Date,
    updatedAt: Date,
} | null )