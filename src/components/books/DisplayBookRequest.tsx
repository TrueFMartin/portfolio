import {ErrorType} from "@/app/utils/types";
import {BookMetadataResponse, bookToDb, bookToDbResponse, bookToDbResponseType} from "@/app/actions/bookToDb";
import React, {useActionState, useState} from "react";
import {Button, Flex, Grid, Text} from "@/once-ui/components";
import Link from "next/link";


export type RequestUrl = {url: string}
export type DisplayBookRequestProps = {
    blobUrl: string
    bookMetadata: BookMetadataResponse
}

export const DisplayBookRequest = ({blobUrl, bookMetadata}: DisplayBookRequestProps) => {
    console.log("sending request to /api/book/request")

    const [downloaded, setDownloaded] = useState<'NOT_CLICKED' | 'IN_PROGRESS' | 'FINISHED'>('NOT_CLICKED');
    let blobLink: string | undefined = '';
    blobLink = blobUrl;

    const beginDownload = () => {
        setDownloaded('IN_PROGRESS')
        if (blobLink) {
            const iframe = document.createElement('iframe');

            iframe.style.display = 'none';

            iframe.addEventListener('load', () => {

                const a = iframe.contentDocument?.createElement('a');
                if (!a) {
                    return;
                }
                a.href = blobLink as string;
                a.download = 'updated-book.epub';
                iframe.contentDocument?.body.appendChild(a);
                a.click();
                // Clean up the object URL
                setDownloaded('FINISHED')
            })

            document.body.appendChild(iframe);

            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }

        // const link = document.createElement('a')
        //     link.href = blobUrl
        //     // link.download = 'book.epub'
        //     link.type = 'application/epub+zip'
        //     console.log("book link: ", link.href)
        //     document.body.appendChild(link)
        //     link.click()
        //     document.body.removeChild(link)
        //     // Clean up the object URL
        //     URL.revokeObjectURL(blobUrl)
        //     setDownloaded('FINISHED')
    }
    const meta = bookMetadata;
    return <Flex direction={'column'} alignItems={'center'}>
        <Button href={blobLink} download={'updated-book.epub'}>
            {downloaded === 'NOT_CLICKED' ? 'Download' : downloaded === 'IN_PROGRESS' ? 'Downloading...' : 'Downloaded'}
        </Button>
        <Grid id={meta.bookRequestId} columns={'1fr 3fr'}>
            <Text>Title:</Text> <Text id={meta.bookRequestId + '-bookTitle'}>{meta.title}</Text>
            <Text>Author:</Text> <Text id={meta.bookRequestId + '-bookAuthor'}>{meta.author}</Text>
            <Text>Chapters:</Text> <Text id={meta.bookRequestId + '-bookChapters'}>{meta.chapters}</Text>
            <Text>First Chapter:</Text> <Link id={meta.bookRequestId + '-bookFirstUrl'}
                                              href={meta.firstUrl || ''}>{meta.firstTitle}</Link>
            <Text>Last Chapter:</Text> <Link id={meta.bookRequestId + '-bookLastUrl'}
                                             href={meta.lastUrl || ''}>{meta.lastTitle}</Link>
        </Grid>
    </Flex>
}