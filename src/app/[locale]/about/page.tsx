import {Avatar, Button, Flex, Heading, Icon, IconButton, SmartImage, Tag, Text} from '@/once-ui/components';
import {baseURL, renderContent} from '@/app/resources';
import TableOfContents from '@/components/about/TableOfContents';
import AutoScroller from '@/components/AutoScroller';
import styles from '@/components/about/about.module.scss'
import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {useTranslations} from 'next-intl';
import "@/app/[locale]/about/about-declared";
import {
    I18nContent,
    Image,
    Skill,
    Work,
    WorkExperience,
    Person,
    Institution,
    Needs,
    Technical
} from "@/app/[locale]/about/about-declared";

export async function generateMetadata(
    {params: {locale}}: { params: { locale: string } }
) {
    const t = await getTranslations();
    const res: I18nContent = renderContent(t);
    const person = res.person;
    const about = res.about;
    const social = res.social;
    const title = about.title;
    const description = about.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://${baseURL}/${locale}/about`,
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

function renderExperiences(experiences: WorkExperience[]) {
    return <Flex
        direction="column"
        fillWidth gap="l" marginBottom="40">
        {experiences.map((experience, index) => (
            !experience.isEmpty &&
            <Flex
                key={`${experience.company}-${experience.role}-${index}`}
                fillWidth
                direction="column">
                <Flex
                    fillWidth
                    justifyContent="space-between"
                    alignItems="flex-end"
                    marginBottom="4">
                    <Text
                        id={experience.company}
                        variant="heading-strong-l">
                        {experience.company}
                    </Text>
                    <Text
                        variant="heading-default-xs"
                        onBackground="neutral-weak">
                        {experience.timeframe}
                    </Text>
                </Flex>
                <Text
                    variant="body-default-s"
                    onBackground="brand-weak"
                    marginBottom="m">
                    {experience.role}
                </Text>
                <Flex
                    as="ul"
                    direction="column" gap="16">
                    {experience.achievements.map((achievement: string, index: any) => (
                        <Text
                            as="li"
                            variant="body-default-m"
                            key={`${experience.company}-${index}`}>
                            {achievement}
                        </Text>
                    ))}
                </Flex>
                {experience.images && experience.images.length > 0 && renderImages(experience.images)}
            </Flex>
        ))}
    </Flex>;
}

function RenderInstitutions(institutions: Institution[]) {
    return <Flex
        direction="column"
        fillWidth gap="l" marginBottom="40">
        {institutions.map((institution, index) => (
            !institution.isEmpty &&
            <Flex
                key={`${institution.name}-${index}`}
                fillWidth gap="4"
                direction="column">
                <Text
                    id={institution.name}
                    variant="heading-strong-l">
                    {institution.name}
                </Text>
                <Text
                    variant="heading-default-xs"
                    onBackground="neutral-weak">
                    {institution.description}
                </Text>
                {institution.images && institution.images.length > 0 && renderImages(institution.images)}
            </Flex>
        ))}
    </Flex>;
}

function renderSkills(skills: Skill[]) {
    return <Flex
        direction="column"
        fillWidth gap="l">
        {skills.map((skill: Skill, index) => (
            !skill.isEmpty &&
            <Flex
                direction="column" fillWidth>
                <Flex
                    key={`${skill}-${index}`}
                    id={skill.title}
                    fillWidth gap="4"
                    direction="column">
                    <Text
                        variant="heading-strong-l">
                        {skill.title}
                    </Text>
                    <Text
                        variant="body-default-m"
                        onBackground="neutral-weak">
                        {skill.description}
                    </Text>
                </Flex>
                {skill.images && skill.images.length > 0 && renderImages(skill.images)}
            </Flex>
        ))}
    </Flex>;
}

function renderImages(images: Image[]) {
    return <Flex
        fillWidth paddingTop="m" paddingLeft="40"
        wrap>
        {images.map((image, index) => (
            <Flex
                key={index}
                border="neutral-medium"
                borderStyle="solid-1"
                radius="m"
                minWidth={image.width} height={image.height}>
                <SmartImage
                    enlarge
                    radius="m"
                    sizes={image.width.toString()}
                    alt={image.alt}
                    src={image.src}/>
            </Flex>
        ))}
    </Flex>;
}

export default function About(
    {params: {locale}}: { params: { locale: string } }
) {
    unstable_setRequestLocale(locale);
    const t = useTranslations();
    const res: I18nContent = renderContent(t);
    const person = res.person;
    const about = res.about;
    const social = res.social;
    const needs = res.needs;
    const structure = [
        {
            title: about.intro.title,
            display: about.intro.display,
            items: []
        },
        {
            title: about.work.title,
            display: about.work.display,
            items: about.work.experiences.map(experience => experience.company)
        },
        {
            title: about.studies.title,
            display: about.studies.display,
            items: about.studies.institutions.map(institution => institution.name)
        },
        {
            title: about.technical.title,
            display: about.technical.display,
            items: about.technical.skills.map(skill => skill.title)
        },
    ]
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
                        '@type': 'Person',
                        name: person.name,
                        jobTitle: person.role,
                        description: about.intro.description,
                        url: `https://${baseURL}/about`,
                        image: `${baseURL}/images/${person.avatar}`,
                        sameAs: social
                            .filter((item) => item.link && !item.link.startsWith('mailto:')) // Filter out empty links and email links
                            .map((item) => item.link),
                        worksFor: {
                            '@type': 'Organization',
                            name: about.work.experiences[0].company || ''
                        },
                    }),
                }}
            />
            <AutoScroller
                shortCodeMap={about.technical.idToTitle}
            />
            <Flex>
                <Flex
                    style={{
                        left: '0'
                    }}
                    position={"fixed"}
                    direction={"column"}
                    hide="s"
                    flex={5}
                >
                    {about.tableOfContent.display && (
                        <Flex

                            style={{
                                left: '0', top: '10%',
                            }}
                            // paddingLeft="24" gap="32"
                            direction="column"
                        >
                            <TableOfContents
                                structure={structure}
                                about={about}/>
                        </Flex>
                    )}
                </Flex>

                <Flex
                    fillWidth
                    mobileDirection="column" justifyContent="center">
                    {about.displayAvatar && (
                        <Flex
                            className={styles.avatar}
                            minWidth="160" paddingX="l" paddingBottom="xl" gap="m"
                            flex={3} direction="column" alignItems="center">
                            <Avatar
                                src={person.avatar}
                                size="xl"/>

                            {person.languages.length > 0 && (
                                <Flex
                                    wrap
                                    gap="8">
                                    {person.languages.map((language, index) => (
                                        <Tag
                                            key={index}
                                            size="l">
                                            {language}
                                        </Tag>
                                    ))}
                                </Flex>
                            )}
                        </Flex>
                    )}
                    <Flex
                        className={styles.blockAlign}
                        style={{left: "60%"}}
                        flex={9} maxWidth={"l"} direction="column">
                        <Flex
                            id={about.intro.title}
                            fillWidth minHeight="160"
                            direction="column" justifyContent="center"
                            marginBottom="32">
                            {about.calendar.display && (
                                <Flex
                                    className={styles.blockAlign}
                                    style={{
                                        backdropFilter: 'blur(var(--static-space-1))',
                                        border: '1px solid var(--brand-alpha-medium)',
                                        width: 'fit-content'
                                    }}
                                    alpha="brand-weak" radius="full"
                                    fillWidth padding="4" gap="8" marginBottom="m"
                                    alignItems="center">
                                    <Flex paddingLeft="12">
                                        <Icon
                                            name="calendar"
                                            onBackground="brand-weak"/>
                                    </Flex>
                                    <Flex
                                        paddingX="8">
                                        Schedule a call
                                    </Flex>
                                    <IconButton
                                        href={about.calendar.link}
                                        data-border="rounded"
                                        variant="tertiary"
                                        icon="chevronRight"/>
                                </Flex>
                            )}
                            <Heading
                                className={styles.textAlign}
                                variant="display-strong-xl">
                                {person.name}
                            </Heading>
                            <Text
                                className={styles.textAlign}
                                variant="display-default-xs"
                                onBackground="neutral-weak">
                                {person.role}
                            </Text>
                            {social.length > 0 && (
                                <Flex
                                    className={styles.blockAlign}
                                    paddingTop="20" paddingBottom="8" gap="8" wrap>
                                    {social.map((item) => (
                                        item.link && (
                                            <Button
                                                key={item.name}
                                                href={item.link}
                                                prefixIcon={item.icon}
                                                label={item.name}
                                                size="s"
                                                variant="tertiary"/>
                                        )
                                    ))}
                                </Flex>
                            )}
                        </Flex>

                        {about.intro.display && (
                            <Flex
                                direction="column"
                                textVariant="body-default-l"
                                fillWidth gap="m" marginBottom="xl">
                                {about.intro.description}
                            </Flex>
                        )}

                        {about.work.display && (
                            <>
                                <Heading
                                    as="h2"
                                    id={about.work.title}
                                    variant="display-strong-s"
                                    marginBottom="m">
                                    {about.work.title}
                                </Heading>
                                {renderExperiences(about.work.experiences)}
                            </>
                        )}

                        {about.studies.display && (
                            <>
                                <Heading
                                    as="h2"
                                    id={about.studies.title}
                                    variant="display-strong-s"
                                    marginBottom="m">
                                    {about.studies.title}
                                </Heading>
                                {RenderInstitutions(about.studies.institutions)}
                            </>
                        )}

                        {about.technical.display && (
                            <>
                                <Heading
                                    as="h2"
                                    id={about.technical.title}
                                    variant="display-strong-s" marginBottom="40">
                                    {about.technical.title}
                                </Heading>
                                {renderSkills(about.technical.skills)}
                            </>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
