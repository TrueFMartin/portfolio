import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {ErrorType} from "@/app/utils/types";
import {EpubApiUrl} from "@/app/utils/globals";
import {headers} from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import {Stream} from "node:stream";

export type BookMetadataResponse = {
    bookRequestId: string;
    title: string;
    author: string;
    chapters: number;
    firstTitle: string;
    firstUrl: string;
    lastTitle: string;
    lastUrl: string;
};

export interface BookToDbResponse {
    blob: Blob;
    bookMetadata: BookMetadataResponse;
}

export type BookToDbResponseType = BookToDbResponse | ErrorType;

// In /api/book/request/route.ts
export const POST = async (req: NextRequest) => {
    const header = headers();
    console.log("In /api/book/request", header);
    const sessionFromAuth = await auth.api.getSession({headers: header});
    if (!sessionFromAuth || !sessionFromAuth.session || !sessionFromAuth.session.userId) {
        return NextResponse.json({message: "Unauthorized, not in auth"}, {status: 401});
    }
    const userId = sessionFromAuth.session.userId;

    class AlreadyRequestedError extends Error {
        constructor(message: string) {
            super(message);
            this.name = "AlreadyRequestedError";
        }
    }

    try {
        const {url, skipUntilChapter} = await req.json();
        let bookReq: { id: string } | undefined;
        try {
            bookReq = await prisma.bookRequest.create({
                data: {
                    tocUrl: url,
                    user: {
                        connect: {id: userId}
                    }
                }
            });
        } catch (error) {
            console.log("Error creating book request:", error);
            if (error.contains("unique")) {
                const msEpoch = Date.now();
                // Anything older than 5 minutes should just be deleted.
                const tooLate = new Date(msEpoch - 1000 * 60 * 5)
                const updated = await prisma.bookRequest.update({
                    where: {
                        id: bookReq?.id,
                        createdAt: {
                            gte:  tooLate,
                        }
                    },
                    data: {
                        status: 'ERROR'
                    }
                })
                if (!updated) {
                    throw new AlreadyRequestedError("Book request already exists");
                }
                bookReq = await prisma.bookRequest.create({
                    data: {
                        tocUrl: url,
                        skipUntilChapter: skipUntilChapter || null,
                        user: {
                            connect: {id: userId}
                        }
                    }
                });
            }
        }
        // If we get here, we have a book request that may have just been deleted
        if (!bookReq) {
            return NextResponse.json({message: "Error creating book request"}, {status: 500});
        }

        const body = JSON.stringify({
            url,
            id: bookReq.id,
            skipUntilChapter: skipUntilChapter || null
        });
        console.log("calling web epub api");
        const bookRes = await fetch(EpubApiUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body
        });

        if (!bookRes.ok) {
            console.log("got non-ok from web epub api");
            await prisma.bookRequest.update({
                where: {id: bookReq.id},
                data: {status: 'ERROR'}
            });
            return NextResponse.json({message: "Error creating book request"}, {status: 500});
        }
        console.log("got response from web epub api");

        const {gcloudUrl, metadata, update} = await bookRes.json();
        const isUpdate: boolean = update === undefined ? false : update as boolean;
        const bookMeta = metadata as BookMetadataResponse;
        bookMeta.bookRequestId = bookReq.id;
        if (!isUpdate) {
            return NextResponse.json({bookMetadata: bookMeta, noChapters: true}, {status: 200});
        }
        if (!gcloudUrl) {
            return NextResponse.json({message: "Error creating book request, no download link returned"}, {status: 500});
        }
        // Get all headers that match fields in BookMetadataResponse, decode them, and assign them to bookMeta
        // console.log("starting headers: ", bookRes.headers)
        // bookRes.headers.forEach((value, key) => {
        //     console.log('key: ', key, 'value: ', value)
        //     switch (key.toLowerCase().trim()) {
        //         case 'title':
        //             bookMeta.title = decodeURIComponent(value);
        //             break;
        //         case 'author':
        //             bookMeta.author = decodeURIComponent(value);
        //             break;
        //         case 'chapters':
        //             bookMeta.chapters = parseInt(value);
        //             break;
        //         case 'firsttitle':
        //             bookMeta.firstTitle = decodeURIComponent(value);
        //             break;
        //         case 'firsturl':
        //             bookMeta.firstUrl = decodeURIComponent(value);
        //             break;
        //         case 'lasttitle':
        //             bookMeta.lastTitle = decodeURIComponent(value);
        //             break;
        //         case 'lasturl':
        //             bookMeta.lastUrl = decodeURIComponent(value);
        //             break;
        //     }
        // });
        console.log("parsed values: ", bookMeta)
        await prisma.bookRequest.update({
            where: {
                id: bookReq.id
            },
            data: {
                status: 'SUCCESSFUL',
                note: bookMeta.title + ' by ' + bookMeta.author + ' with ' + bookMeta.chapters + ' chapters',
                firstChapterTitle: bookMeta.firstTitle,
                firstChapterUrl: bookMeta.firstUrl,
                lastChapterTitle: bookMeta.lastTitle,
                lastChapterUrl: bookMeta.lastUrl,
                book: {
                    connectOrCreate: {
                        where: {
                          id: 'asfasdf'
                        },
                        create: {
                            title: bookMeta.title,
                            tocUrl: url,
                            author: bookMeta.author,
                        }
                    }
                }
            },
            include: {
                book: true
            }
        })
        return NextResponse.json({gcloudUrl: gcloudUrl, bookMetadata: bookMeta, noChapters: false}, {status: 200});
        // const blobber = await bookRes.blob();
        // return new NextResponse(blobber, {
        //     status: 200,
        //     headers: {
        //         'book-request-id': bookReq.id,
        //         'Content-Type': 'application/epub+zip',
        //         'Content-Disposition': `attachment; filename="${bookReq.id}.epub"`,
        //         'Content-Length': blobber.size.toString()
        //     }
        // })

        // const fp = path.join('/tmp', `${bookReq.id}.epub`)
        // await bookRes.blob().then((blob) => {
        //     return blob.stream()
        // }).then((ab) => {
        //     return fs.writeFile(fp, new Stream(ab.getReader()));
        // }).catch((e) => {
        //     console.error("Error writing blob to file:", e);
        // });
        // console.log("returning file path from web epub api");
        // return NextResponse.json({blobUrl: fp, bookMetadata: bookMeta});
    } catch (error) {
        if (error instanceof AlreadyRequestedError) {
            return NextResponse.json({message: "Book request already in progress"}, {status: 400});
        }
        console.error("Error processing book request:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}
