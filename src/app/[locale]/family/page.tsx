import {Arrow, Avatar, Button, Flex, Grid, Heading, RevealFx, Text} from "@/once-ui/components";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import {baseURL, renderContent} from "@/app/resources";
import {getTranslations, unstable_setRequestLocale} from "next-intl/server";
import {useTranslations} from "next-intl";
import React from "react";
import {getDefaultAutoSelectFamily} from "node:net";

export async function generateMetadata(
    {params: {locale}}: { params: { locale: string } }
) {

    const t = await getTranslations();
    const {gallery} = renderContent(t);

    const title = gallery.title;
    const description = gallery.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://${baseURL}/${locale}/gallery`,
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

export default function Family(
    {params: {locale}}: { params: { locale: string } }
) {
    unstable_setRequestLocale(locale);
    const t = useTranslations();
    const {gallery, person} = renderContent(t);
    const family = gallery
    return (
        <Flex fillWidth>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ImageGallery',
                        name: gallery.title,
                        description: gallery.description,
                        url: `https://${baseURL}/gallery`,
                        image: gallery.images.map((image) => ({
                            '@type': 'ImageObject',
                            url: `${baseURL}${image.src}`,
                            description: image.alt,
                        })),
                        author: {
                            '@type': 'Person',
                            name: person.name,
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
            >
                <Flex
                    fillWidth
                    direction="column"
                    paddingY="l" gap="m">
                    <Flex
                        direction="column"
                        fillWidth maxWidth="s">
                        <RevealFx
                            translateY="4" fillWidth justifyContent="flex-start" paddingBottom="m">
                            <Heading
                                wrap="balance"
                                variant="display-strong-l">
                                {family.title}
                            </Heading>
                        </RevealFx>
                        <RevealFx
                            translateY="8" delay={0.2} fillWidth justifyContent="flex-start" paddingBottom="m">
                            <Text
                                wrap="balance"
                                onBackground="neutral-weak"
                                variant="heading-default-xl">
                                {family.description}
                            </Text>
                        </RevealFx>
                    </Flex>
                    <Grid
                        columns={"repeat(2, 1fr)"}

                    >
                        <Flex
                            padding={"s"}
                            justifyContent={"right"}>
                            <Button size={"l"} href={`/${locale}/family/secure`}> Yes </Button>
                        </Flex>
                        <Flex
                            padding={"s"}
                            justifyContent={"left"}>
                            <Button size={"l"} href={`/${locale}/`}> No </Button>
                        </Flex>
                    </Grid>
                </Flex>
            </Flex>
        </Flex>
    );
}