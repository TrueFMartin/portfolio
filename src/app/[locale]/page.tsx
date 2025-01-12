import React from 'react';

import { Heading, Flex, Text, Button,  Avatar, RevealFx, Arrow } from '@/once-ui/components';
import { Projects } from '@/components/work/Projects';

import { baseURL, routes, renderContent } from '@/app/resources'; 
import { Mailchimp } from '@/components';
import { Posts } from '@/components/blog/Posts';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import {Needs, Technical} from "@/app/[locale]/about/about-declared";
import RenderNeed from "@/components/about/Needs";

export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {
	const t = await getTranslations();
    const { home } = renderContent(t);
	const title = home.title;
	const description = home.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}`,
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

function RenderNeeds(needs: Needs) {
	return <Flex
		background={"accent-weak"}
		border={"accent-strong"}
		borderStyle={"solid-1"}
		radius={"m"}
		gap={"m"}
		margin={"m"}
		padding={"m"}
		fillWidth={true}
	>
		{/*TODO in the future, add a Record of need value => skillId somewhere*/}
		<RenderNeed route={"/about"} text={needs.db} skillId={"data"} />
		<RenderNeed route={"/about"} text={needs.robust} skillId={"infrastructure"}/>
		<RenderNeed route={"/about"} text={needs.cloud} skillId={"cloud"}/>
		<RenderNeed route={"/about"} text={needs.microservices} skillId={"infrastructure"}/>
		<RenderNeed route={"/about"} text={needs.authentication} skillId={"languages"}/>
	</Flex>;
}

export default function Home(
	{ params: {locale}}: { params: { locale: string }}
) {
	unstable_setRequestLocale(locale);
	const t = useTranslations();
	const { home, about, person, needs } = renderContent(t);
	return (
		<Flex
			maxWidth="m" fillWidth gap="xl"
			direction="column" alignItems="center">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: home.title,
						description: home.description,
						url: `https://${baseURL}`,
						image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
						publisher: {
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
								{home.headline}
							</Heading>
						</RevealFx>
						<RevealFx
							translateY="8" delay={0.2} fillWidth justifyContent="flex-start" paddingBottom="m">
							<Text
								wrap="balance"
								onBackground="neutral-weak"
								variant="heading-default-xl">
								{home.subline}
							</Text>
						</RevealFx>
						<RevealFx translateY="12" delay={0.4}>
							<Flex fillWidth>
								<Button
									id="about"
									data-border="rounded"
									href={`/${locale}/about`}
									variant="tertiary"
									size="m">
									<Flex
										gap="8"
										alignItems="center">
										{about.displayAvatar && (
											<Avatar
												style={{marginLeft: '-0.75rem', marginRight: '0.25rem'}}
												src={person.avatar}
												size="m"/>
											)}
											{t("about.title")}
											<Arrow trigger="#about"/>
									</Flex>
								</Button>
							</Flex>
						</RevealFx>
					</Flex>
				
			</Flex>
			{/*<RevealFx translateY="16" delay={0.6}>*/}
			{/*	/!*<Projects range={[1,1]} locale={locale}/>*!/*/}
			{/*</RevealFx>*/}
			<Flex>
				{needs.display && (
					<Flex
						// style={{
						// 	left: '0', top: '50%',
						// }}

						gap="8"
						// alignItems="center"
					>
						{RenderNeeds(needs)}
					</Flex>
				)}
			</Flex>
		</Flex>
	);
}
