"use client";

import { useFormState } from 'react-dom';
import {Suspense, useState} from "react";
import {Button, Flex, Input, Spinner} from "@/once-ui/components";
import {BookMetadataResponse, submitRequest} from "@/app/actions/bookToDb";
import {DisplayBookRequest} from "@/components/books/DisplayBookRequest";

const initialState = {
    message: '',
    bookMetadata: {} as BookMetadataResponse,
    blobUrl: '',
}

export const ProvideUrl = () => {
    const [url, setUrl] = useState<string>('');
    const [state, formAction] = useFormState(submitRequest, initialState);
    const [pending, setPending] = useState<boolean>(false);
    const [noRetry, setNoRetry] = useState<boolean>(false);
    return ( // TODO tomorrow, just make getting a book a new page with a redirect.
        <Flex direction={'column'}>
            <form>
            <Input id={"url"} label={"Enter Table of Contents URL"} name={'url'} required={true} type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
            <Button formAction={(fd) => {
                // if (noRetry) {
                //     return;
                // }
                setPending(true);
                try {
                    formAction(fd)
                } catch (e) {
                    console.error(e);
                }
                setNoRetry(true);
            }}
                    // disabled={pending || state?.blobUrl?.length > 0}
                    type="submit">Submit</Button>
            </form>
            {state.message && <Flex>{state.message}</Flex>}
            {pending && (state?.blobUrl == undefined || state.blobUrl?.length === 0) && <Flex>In Progress...</Flex>}
            {state?.blobUrl?.length > 0  && <DisplayBookRequest blobUrl={state.blobUrl} bookMetadata={state.bookMetadata}/>}
        </Flex>
    )
}
