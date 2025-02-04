"use client";

import {PermissionRequestType} from "@/app/utils/types";
import {Button, Flex, Grid, Heading, Text} from "@/once-ui/components";
import {useState} from "react";

type RequestHistoryTableProps = { reqs: PermissionRequestType[] };

const RequestHistoryTable = ({reqs}: RequestHistoryTableProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return <Flex direction={"column"}>
        <Heading as={'h2'}>Permission Request History</Heading>
        <Button onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'Hide' : 'Show'} Request History</Button>
        {/*@ts-ignore for maxHeight*/}
        <Flex maxHeight={isExpanded? '': '1'} gap={'m'} paddingBottom={'m'} direction={'column'} borderStyle={'solid-1'} style={{visibility: isExpanded? 'visible': 'hidden'}}>
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
                return (permReq && <Grid style={{borderTop: 'solid'}} gap={'m'} align={'center'} fillWidth={true}
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
    </Flex>;
}

export default RequestHistoryTable;
