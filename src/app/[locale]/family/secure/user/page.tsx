import {Arrow, Avatar, Button, Flex, Grid, Heading, RevealFx, Text} from "@/once-ui/components";
import { baseURL, renderContent } from "@/app/resources";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import React from "react";
import {PermissionProfile} from "@/components/user/PermissionProfile";
import {auth} from "@/auth";
import {MakeRequestButton} from "@/components/user/MakeRequestButton";

export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {

	const t = await getTranslations();
	const { gallery } = renderContent(t);

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
			url: `https://${baseURL}/${locale}/family/secure/user`,
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

export default function User(
	{ params: {locale}}: { params: { locale: string }}
) {
	const session = auth();
	unstable_setRequestLocale(locale);
	const t = useTranslations();
	const { gallery, person } = renderContent(t);
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
					<Grid
					columns={"repeat(2, 1fr)"}
					>
						<MakeRequestButton/>
						<PermissionProfile/>
					</Grid>

				</Flex>

			</Flex>
        </Flex>
    );
}