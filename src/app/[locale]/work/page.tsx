import {getPosts} from '@/app/utils/utils';
import {Flex, Grid} from '@/once-ui/components';
import {Projects} from '@/components/work/Projects';
import {baseURL, renderContent} from '@/app/resources';
import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {useTranslations} from 'next-intl';

export async function generateMetadata(
    {params: {locale}}: { params: { locale: string } }
) {

    const t = await getTranslations();
    const {work} = renderContent(t);

    const title = work.title;
    const description = work.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://${baseURL}/${locale}/work/`,
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

export default function Work(
    {params: {locale}}: { params: { locale: string } }
) {
    unstable_setRequestLocale(locale);
    let allProjects = getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]);

    const t = useTranslations();
    const {person, work} = renderContent(t);

    return (
        <Flex
            fillWidth maxWidth="m"
            direction="column">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        headline: work.title,
                        description: work.description,
                        url: `https://${baseURL}/projects`,
                        image: `${baseURL}/og?title=Design%20Projects`,
                        author: {
                            '@type': 'Person',
                            name: person.name,
                        },
                        hasPart: allProjects.map(project => ({
                            '@type': 'CreativeWork',
                            headline: project.metadata.title,
                            description: project.metadata.summary,
                            url: `https://${baseURL}/projects/${project.slug}`,
                            image: `${baseURL}/${project.metadata.image}`,
                        })),
                    }),
                }}
            />
            {/*<Projects locale={locale}/>*/}
            <Flex
                direction={"column"}
            >
                <Grid
                    alpha={"accent-medium"}
                    padding={"xs"}
                    radius={"m"}
                    columns={"repeat(3, 1fr) 1fr"}
                    border={"accent-strong"}
                    borderStyle={"solid-1"}
                >
                    <Flex
                    justifyContent={"center"}
                    textVariant={"heading-default-xl"}
                    >
                        First
                    </Flex>
                    <Flex
                        justifyContent={"center"}
                        textVariant={"heading-default-xl"}
                    >
                        Second
                    </Flex>
                    <Flex
                        justifyContent={"center"}
                        textVariant={"heading-default-xl"}
                    >
                        Third
                    </Flex>
                    <Flex
                        justifyContent={"center"}
                        textVariant={"heading-default-xl"}
                    >
                        Fourth
                    </Flex>
                </Grid>
                <Flex
                height={"xl"}
                justifyContent={"center"}
                alignItems={"center"}
                alpha={"accent-weak"}
                radius={"l"}
                marginTop={"s"}
                border={"accent-strong"}
                borderStyle={"solid-2"}
                textVariant={"display-strong-m"}
                >
                    TODO
                </Flex>
            </Flex>
        </Flex>
    );
}