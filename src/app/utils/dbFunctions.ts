import {PermissionType} from "@prisma/client";
import {PermissionToAction} from "./actions";

export function bookActionAllowed(
    permission: string,
    action: string,
) {
    const availableActions = PermissionToAction[permission];
    if (!availableActions) {
        return false;
    }
    const actionAllowed = availableActions[action];
    if (actionAllowed === undefined) {
        return false;
    }
    return actionAllowed;
}

export function permissionTypesAsList() {
    return Object.values(PermissionType).values().toArray()
}