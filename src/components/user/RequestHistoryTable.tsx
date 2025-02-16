"use client";

import {PermissionRequestType} from "@/app/utils/types";
import {Accordion, Badge, Button, Flex, Grid, Heading, IconButton, Text} from "@/once-ui/components";
import React, {useState} from "react";
import {useRouter} from "@/i18n/routing";

type RequestHistoryTableProps = { reqs: PermissionRequestType[] };

const RequestHistoryTable = ({reqs}: RequestHistoryTableProps) => {
    const route = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    return <Flex direction={"column"}>
        <IconButton onClick={() => {setIsOpen(false); route.refresh()}} icon={'refresh'} ></IconButton>
        <Accordion open={isOpen} title={
            <Flex><Badge gapOverride={"s"} paddingXOverride={"m"} icon={'bookOpenText'} title={'Request History'} />

            </Flex>
        }>
        <Flex gap={'m'} paddingBottom={'m'} direction={'column'} borderStyle={'solid-1'}>
            <Grid style={{border: 'solid'}} gap={'m'} align={'center'} fillWidth={true}
                  paddingTop={'xs'} paddingBottom={'m'} paddingX={'m'} marginY={'xs'}
                  marginX={'s'} columns={'repeat(5, 1fr)'}>
                <Text>Updated</Text>
                <Text>Created</Text>
                <Text>Type</Text>
                <Text>Status</Text>
                <Text>Note</Text>
            </Grid>
            {reqs.map((permReq) => {
                return (permReq && <Grid key={permReq.id} style={{borderTop: 'solid'}} gap={'m'} align={'center'} fillWidth={true}
                                         paddingTop={'xs'} paddingBottom={'m'} paddingX={'m'} marginY={'xs'}
                                         marginX={'s'} columns={'repeat(5, 1fr)'}>
                    <Text>{permReq.updatedAt.toUTCString()}</Text>
                    <Text>{permReq.createdAt.toUTCString()}</Text>
                    <Text>{permReq.permissionType}</Text>
                    <Text>{permReq.status}</Text>
                    <Text>{permReq.note ? permReq.note : ''}</Text>
                </Grid>)
            })}
        </Flex>
        </Accordion>
    </Flex>;
}

export default RequestHistoryTable;
