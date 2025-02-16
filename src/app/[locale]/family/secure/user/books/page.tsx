import {Flex, Heading, Logo} from "@/once-ui/components";
import {baseURL, renderContent} from "@/app/resources";
import {getTranslations, unstable_setRequestLocale} from "next-intl/server";
import {useTranslations} from "next-intl";
import React from "react";
import {ProvideUrl} from "@/components/books/ProvideUrl";

export async function generateMetadata(
    {params: {locale}}: { params: { locale: string } }
) {

    const t = await getTranslations();
    const {gallery} = renderContent(t);

    const title = "User Page";
    const description = "User page to view user status";
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://${baseURL}/${locale}/family/secure/user/books`,
            images: [
                {
                    url: ogImage,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    };
}

export default function Books(
    {params: {locale}}: { params: { locale: string } }
) {
    unstable_setRequestLocale(locale);
    const t = useTranslations();
    const {person} = renderContent(t);

    const logoUrl = `/images/common/open_book_text.png`;
    return (
        <Flex fillWidth alignItems={"center"}
              justifyContent={"center"}
              direction={"column"}>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ImageGallery',
                        name: 'Books',
                        description: 'Request and view books',
                        url: `https://${baseURL}/${locale}/family/secure/user/books`,
                        image: {
                            '@type': 'ImageObject',
                            url: `${baseURL}${logoUrl}`,
                            description: 'Epub Updated Logo',
                        },
                        author: {
                            '@type': 'Person',
                            name: 'True Martin',
                            image: {
                                '@type': 'ImageObject',
                                url: `${baseURL}${person.avatar}`,
                            },
                        },
                    }),
                }}
            />
            <Flex
                alignItems={"center"}
                justifyContent={"center"}
                direction={"column"}
            >
                <Logo iconSrc={logoUrl} size={'m'}/>
                <Heading style={{borderStyle: 'solid'}} padding={'m'}>Books</Heading>
                <Flex
                    fillWidth
                    direction="column"
                    paddingY="l" gap="m">
                    <Flex>
                        <ProvideUrl/>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}