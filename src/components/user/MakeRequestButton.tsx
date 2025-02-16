"use client";

import {Suspense, useEffect, useState} from 'react';
import {
    Accordion,
    Button,
    Dialog,
    Dropdown,
    DropdownWrapper,
    Flex,
    Heading,
    Select,
    Skeleton, Tooltip
} from "@/once-ui/components";
import {PermissionType} from "@prisma/client";
import {requestPermission} from "./RequestPermission";
import {PermissionRequestType} from "@/app/utils/types";
import {CollapseNumberRange} from "@formatjs/ecma402-abstract";

export const MakeRequestButton = () => {
    const [response, setResponse] = useState('');
    const [permissionType, setPermissionType] = useState<PermissionType>("NONE");
    const [alreadySubmitted, setAlreadySubmitted] = useState<PermissionType[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [doneText, setDoneText] = useState<('Done' | 'Cancel')>('Cancel');
    const [showToolTip, setShowToolTip] = useState(false);
    const submitRequest = async () => {
        setLoading(true);
        if (!permissionType || permissionType === 'NONE') {
            return;
        }
        if (alreadySubmitted.includes(permissionType)) {
            setResponse('You\'ve already requested that permission.');
            return;
        }
        const res = await requestPermission(permissionType);
        if (!res) {
            setResponse('Error making request');
            return;
        } else if ('message' in res) {
            setResponse(res.message);
            return;
        }
        const typedRes = res as PermissionRequestType
        if (!typedRes) {
            setResponse('Error response not type expected');
            return;
        }
        const note = typedRes.note ? '\nWith note: ' + typedRes.note : '';
        setResponse('Request for ' + typedRes.permissionType + ' created\nStatus: ' + typedRes.status + note);
        alreadySubmitted.push(typedRes.permissionType);
        setAlreadySubmitted(alreadySubmitted);
        setDoneText('Done');
    };

    return (
        <Flex direction={"column"} padding={'s'}>
            <Flex direction={'column'}>
                <Tooltip style={{visibility: 'hidden'}}
                         label={'Invisible space'}/>
                <Button variant="primary"
                    size="m"
                    onClick={() => setDialogOpen(true)}
                    label="Request Access"
                    prefixIcon={'helpCircle'}
                    onMouseEnter={() => setShowToolTip(true)}
                    onMouseLeave={() => setShowToolTip(false)}
            />
            <Tooltip style={{visibility: showToolTip ? 'visible' : 'hidden'}}
                     label={'Request early access permission.'}/>
            </Flex>
            <Dialog
                onClose={() => setDialogOpen(false)}
                isOpen={dialogOpen}
                title="Choose Access Type"
                description="The submission will be sent to the admin for approval."
                primaryButtonProps={{label: "Submit", onClick: submitRequest}}
                secondaryButtonProps={{label: doneText, onClick: () => setDialogOpen(false)}}
            >
                <Flex direction={'column'} padding={'s'}>
                    <Dropdown selectedOption={permissionType}
                              options={Object.values(PermissionType).map((permissionType) => ({
                                  // Turn first char of each word to uppercase
                                  label: permissionType.toLowerCase().split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                                  value: permissionType,
                                  dividerAfter: true,
                                  danger: alreadySubmitted.includes(permissionType as PermissionType)
                              }))} onOptionSelect={(option) => {
                        setPermissionType(option.value as PermissionType)
                    }
                    }>
                    </Dropdown>
                    {loading && <Suspense fallback={<Skeleton shape={"block"}></Skeleton>}>
                        {response}
                    </Suspense>}
                </Flex>
            </Dialog>
        </Flex>
    );
};