"use server";
import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {ErrorType} from "@/app/utils/types";
import {EpubApiUrl} from "@/app/utils/globals";
import path from "path";
import {promises as fs} from "fs";
import { openAsBlob } from "node:fs";
import { headers } from "next/headers";
import {redirect} from "next/navigation";

export type BookMetadataResponse = {
    // From the DB:
    bookRequestId: string,
    // Fields from the Epub API:
    title: string,
    author: string,
    chapters: number,
    firstTitle: string,
    firstUrl: string,
    lastTitle: string,
    lastUrl: string
};

export interface bookToDbResponse {
    blobUrl: string,
    bookMetadata: BookMetadataResponse
}

export async function submitRequest(prevState: any, formData: FormData) {
    let res: bookToDbResponse | { message: string } | undefined = undefined
    const err = {message: 'Something went wrong fetching api'}

    const urlEntry = formData.get('url')
    const str = urlEntry?.toString()
    if (!str) {
        return err;
    }
    try {
        const url = new URL(str) // throws if invalid
        const head = headers()
        const other = await fetch(process.env.BASE_PATH + '/api/book/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie' : head.get('Cookie') || ''
            },
            body: JSON.stringify({url: str}),
            credentials: 'same-origin',
        })
        if (!other.ok) {
            console.error("got error from /api/book/request,", other.statusText)
            return err
        }

        const {gcloudUrl, bookMetadata, noChapters} = await other.json()
        if (noChapters === undefined || noChapters) {
            return {message: 'No chapters found'}
        }
        if (!gcloudUrl || !bookMetadata) {
            return err
        }
        const typedMetadata = bookMetadata as BookMetadataResponse;

        // const {blobUrl, bookMetadata} = await other.json()
        const reqId = typedMetadata.bookRequestId
        // const buff = await other.arrayBuffer().then((ab) => Buffer.from(ab))
        // const fp = path.join('public', reqId + '.epub')
        // await fs.writeFile(fp, buff)
        // const bookReq = await prisma.bookRequest.findUniqueOrThrow({
        //     where: {
        //         id: reqId || ''
        //     },
        //     include: {
        //         book: true,
        //     }
        // })
        // const bookMetadata: BookMetadataResponse = {
        //     bookRequestId: reqId || '',
        //     title: bookReq.book?.title || 'Unknown',
        //     chapters: 20, // TODO populate in DB book request
        //     author: bookReq.book?.author || 'Unknown',
        //     firstTitle: bookReq.firstChapterTitle || 'Unknown',
        //     firstUrl: bookReq.firstChapterUrl || 'Unknown',
        //     lastTitle: bookReq.lastChapterTitle || 'Unknown',
        //     lastUrl: bookReq.lastChapterUrl || 'Unknown',
        // }
        console.log("got response from /api/book/request,", typedMetadata.toString())
        if (typedMetadata) {
            return {blobUrl: gcloudUrl, bookMetadata: bookMetadata}
        }
        // res = await bookToDb(url.toString()).catch(e => {
        //     throw e
        // })
        console.log("got response from bookToDb")
    } catch (e) {
        console.error(e)
        return err
    }
    if (!res) {
        return err
    }
    if ('message' in res) {
        return err
    }
    res = res as bookToDbResponse
    const meta = res.bookMetadata
    // const meta = bookMetadata as BookMetadataResponse
    const downloadLink = res.blobUrl
    if (!downloadLink || !meta) {
        return err
    }
    return {blobUrl: downloadLink, bookMetadata: meta}
}


export type bookToDbResponseType = bookToDbResponse | ErrorType

export async function bookToDb(url: string, skipUntilChapter?: string): Promise<bookToDbResponseType> {
    const email = "asdf"
    const book = await prisma.bookRequest.create({
        data: {
            tocUrl: url,
            user: {
                connect: {
                    email: email
                }
            }
        }
    });
    return new Promise(async (resolve, reject) => {
        if (!book) {
            reject({message: "Error creating book request"});
        }
        const body = {
            url: url,
            id: book.id,
            skipUntilChapter: skipUntilChapter ? skipUntilChapter : null
        }

        const bookRes = await fetch(EpubApiUrl, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!bookRes.ok) {
            let {error} = await bookRes.json().catch(e => {
                error = "from bad json "  + e
            })
            if (error) {
                console.log("got error from web epub api: ", error)
            }
            await prisma.bookRequest.update({
                where: {
                    id: book.id
                },
                data: {
                    status: 'ERROR'
                }
            })
            reject({message: "Error creating book request, got " + bookRes.statusText });
            return
        }
        let bookMeta = {} as BookMetadataResponse;
        // Get all headers that match fields in BookMetadataResponse, decode them, and assign them to bookMeta
        console.log("starting headers: ", bookRes.headers)
        bookRes.headers.forEach((value, key) => {
            console.log('key: ', key, 'value: ', value)
            switch (key.toLowerCase().trim()) {
                case 'title':
                    bookMeta.title = decodeURIComponent(value);
                    break;
                case 'author':
                    bookMeta.author = decodeURIComponent(value);
                    break;
                case 'chapters':
                    bookMeta.chapters = parseInt(value);
                    break;
                case 'firsttitle':
                    bookMeta.firstTitle = decodeURIComponent(value);
                    break;
                case 'firsturl':
                    bookMeta.firstUrl = decodeURIComponent(value);
                    break;
                case 'lasttitle':
                    bookMeta.lastTitle = decodeURIComponent(value);
                    break;
                case 'lasturl':
                    bookMeta.lastUrl = decodeURIComponent(value);
                    break;
            }
        });
        console.log("parsed values: ", bookMeta)
        await prisma.bookRequest.update({
            where: {
                id: book.id
            },
            data: {
                status: 'SUCCESSFUL',
                note: bookMeta.title + ' by ' + bookMeta.author + ' with ' + bookMeta.chapters + ' chapters',
            },
        })
        const bt = await bookRes.arrayBuffer();
        const filePath = path.join('/tmp', `${book.id}.epub`);
        // fs.writeFileSync(filePath, Buffer.from(bt));

        // Create a blob URL from the file
        // const blob = new Blob([bt], { type: 'application/epub+zip' });
        resolve({blobUrl: filePath, bookMetadata: bookMeta});
    })
}