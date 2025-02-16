"use server";

import prisma from "@/lib/prisma";
import {auth} from "@/lib/auth";
import {Flex, Grid, Heading, Icon, IconButton, Text} from "@/once-ui/components";
import RequestHistoryTable from "@/components/user/RequestHistoryTable";
import {PermissionRequestType} from "@/app/utils/types";
import {MakeRequestButton} from "@/components/user/MakeRequestButton";
import React from "react";
import {headers} from "next/headers";

const unauth = <Flex>
    <h1>Not authenticated</h1>
</Flex>

export const PermissionProfile = async () => {
    const session = await auth.api.getSession({headers: headers()})
    if (!session) {
        return unauth
    }
    const userData = session.user;
    if (!userData || !userData.email) {
        return unauth
    }
    const perms = await prisma.user.findUnique({
        where: {
            id: userData.id
        },
        select: {
            permissionType: true,
            permissionRequests: {
                orderBy: {
                    updatedAt: 'desc'
                },
                select: {
                    createdAt: true,
                    updatedAt: true,
                    permissionType: true,
                    status: true,
                    note: true,
                    id: true,
                },
            },
        }
    })
    if (!perms) {
        return <Flex><h1>No permission requests or permissions</h1></Flex>
    }
    return (
        <Flex direction={'column'} fillWidth={true} alignItems={'center'}>
            <Heading>Permissions</Heading>
            <Flex direction={'row'} marginX={'xl'} gap={'m'} alignItems={'flex-start'} padding={'m'}
                  justifyContent={'center'}>
                <Heading as={'h2'}>Active Permission: {perms.permissionType}</Heading>
                <Flex><Icon name={'chevronRight'} size={'s'}/><Icon name={'chevronRight'} size={'s'}/></Flex>
                <MakeRequestButton/>
                <Flex direction={"row"} margin={'m'} gap={'m'}>
                    <RequestHistoryTable reqs={perms.permissionRequests as PermissionRequestType[]}/>
                </Flex>
            </Flex>
        </Flex>
    );
}