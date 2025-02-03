"use client";

import {useEffect, useState} from 'react';
import {Button, Dropdown, Flex} from "@/once-ui/components";
import {PermissionType} from "@prisma/client";
import {requestPermission} from "./RequestPermission";

export const MakeRequestButton = () => {
    const [response, setResponse] = useState('');
    const [permissionType, setPermissionType] = useState<PermissionType | null>(null);

    const caller = async () => {
        if (!permissionType) {
            return;
        }
        const res = await requestPermission(permissionType);
        if (!res) {
            setResponse('Error making request');
        } else if ('message' in res) {
            setResponse(res.message);
        }

        setResponse('sdf');
    };

    return (
        <Flex>
            <Dropdown options={Object.values(PermissionType).map((permissionType) => ({
                // Turn first char of each word to uppercase
                label: permissionType.toLowerCase().split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                value: permissionType,
            }))} onOptionSelect={(option) => {setPermissionType(option.value as PermissionType)}}/>
            <Button onClick={caller}>

                {response ? JSON.stringify(response) : 'Loading...'}
            </Button>
        </Flex>

    );
};