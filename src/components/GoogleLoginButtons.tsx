"use client";

import {signIn} from "./sign-in"
import {signOut, useSession} from "@/lib/auth-client"
import {Button, Flex, Heading, Icon, IconButton} from "@/once-ui/components";

export default function Component() {
    const {data: session} = useSession()
    if (session && session.user) {
        return (
            <Flex>
                Signed in as {session.user.email} <br/>
                <IconButton size={'l'} icon={'close'} onClick={() => signOut()}>Sign out</IconButton>
            </Flex>
        )
    }
    return (
        <Flex alignItems={"center"} justifyContent={"center"} padding={'s'} gap={'s'} direction={'column'}>
            <Heading style={{borderBottom: 'solid' }} as={'h3'}>Not Signed In</Heading>
            <Flex  style={{borderBottom: 'solid' }} alignItems={"center"} justifyContent={"center"} padding={'s'} gap={'s'}>

                Sign in with Google? <br/>
                <Button size={'l'} onClick={() => signIn("google")}>
                    <Flex alignItems={"center"} padding={'s'} gap={'s'}>
                        <Icon name={'google'}/>
                        Sign in
                    </Flex>
                </Button>
            </Flex>
        </Flex>
    )
}