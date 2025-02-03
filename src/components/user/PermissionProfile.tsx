"use server";

import prisma from "@/lib/prisma";
import {auth} from "@/auth";
import {Flex, Heading} from "@/once-ui/components";

const unauth = <Flex>
    <h1>Not authenticated</h1>
</Flex>

export const PermissionProfile = async () => {
    const session = await auth()
    if (!session) {
        return unauth
    }
    const userData = session.user;
    if (!userData || !userData.email) {
        return unauth
    }
    const email = userData.email;
    const perms = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            permissionRequests: {
                select: {
                    id: true,
                    permission: true,
                    status: true,
                    note: true,
                    permissionId: true,
                }
            },
            permissions: true,
        }
    })
    if (!perms) {
        return <Flex><h1>No permission requests or permissions</h1></Flex>
    }
    return (
        <Flex>
            <Heading>Permissions</Heading>
            <Flex>
                <Heading>Permission Requests</Heading>
                <Flex>
                    {perms.permissionRequests.map((permReq) => {
                        return <Flex key={permReq.id}>
                            <Heading>{permReq.permission.name}</Heading>
                            <Heading>{permReq.status}</Heading>
                        </Flex>
                    })}
                </Flex>
                <Heading>Active Permissions</Heading>
                <Flex>
                    {perms.permissions.map((perm) => {
                        return <Flex key={perm.id}>
                            <Heading>{perm.name}</Heading>
                        </Flex>
                    })}
                </Flex>
            </Flex>
        </Flex>
    );
}