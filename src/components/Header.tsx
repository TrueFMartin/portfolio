"use client";

import {useParams} from "next/navigation";
import React, {useEffect, useState, useTransition} from "react";

import {Flex, Icon, IconButton, Text, ToggleButton} from "@/once-ui/components"
import styles from '@/components/Header.module.scss'

import {routes, display} from '@/app/resources'

import {routing} from '@/i18n/routing';
import {Locale, usePathname, useRouter} from '@/i18n/routing';
import {renderContent} from "@/app/resources";
import {useTranslations} from "next-intl";
import {i18n} from "@/app/resources/config";
import {Warning} from "postcss";

type TimeDisplayProps = {
    timeZone: string;
    locale?: string;  // Optionally allow locale, defaulting to 'en-US'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({timeZone, locale = 'en-US'}) => {
    const [currentTime, setCurrentTime] = useState(['', '']);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZoneName: 'short',
            };
            const timeString = new Intl.DateTimeFormat(locale, options).format(now);
            const utcOptions = options
            utcOptions.timeZone = 'UTC'
            const utcTimeString = new Intl.DateTimeFormat(locale, utcOptions).format(now);
            setCurrentTime([timeString, utcTimeString]);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [timeZone, locale]);

    return (
        // There are four elements to the time display:
        // 1. A hidden text element that will be greater than the width of
        //    the maximum content width, ensuring the parent block is as wide
        // 2. The local time display
        // 3. A bottom border that spans the width of the parent block, this is just a white horizontal bar.
        // 4. The UTC time display
        <>
            {(() => {
                const [local, utc] = currentTime;
                return (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'right',
                        width: 'fit-content', // Matches width of the widest content
                        position: 'relative',
                        fontFamily: 'monospace'// Allows child elements to position relative to this parent
                    }}>
                        {/* Hidden Text Element to set max width*/}
                        <span style={{visibility: 'hidden', whiteSpace: 'nowrap'}}> 000:00:00 UTC </span>
                        {/* Local Time Section */}
                        <div style={{
                            whiteSpace: 'nowrap',
                            textAlign: 'right'
                        }}>
                            {local}
                        </div>

                        {/* Bottom Border */}
                        <div style={{
                            minWidth: 'max-content',
                            borderBottom: '2px solid white',
                            width: '100%', // Matches the width of the parent
                        }}></div>
                        {/* UTC Time Section */}
                        <div style={{
                            whiteSpace: 'nowrap',
                            textAlign: 'right'
                        }}>
                            {utc}
                        </div>
                    </div>);
            })()}
        </>
    );
};

export default TimeDisplay;

export const Header = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname() ?? '';
    const params = useParams();

    function handleLanguageChange(locale: string) {
        const nextLocale = locale as Locale;
        startTransition(() => {
            router.replace(
                pathname,
                {locale: nextLocale}
            )
        })
    }

    function lastModified(daysBack: number) {
        const now = new Date();
        const dateSubtracted = now.setDate(now.getDate() - daysBack);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Intl.DateTimeFormat(undefined, options).format(dateSubtracted);
    }

    const t = useTranslations();
    const {person, home, about, blog, work, gallery} = renderContent(t);

    return (
        <>
            <Flex
                className={styles.mask}
                position="fixed" zIndex={9}
                fillWidth minHeight="80" justifyContent="center">
            </Flex>
            <Flex style={{height: 'fit-content'}}
                  className={styles.position}
                  as="header"
                  zIndex={9}
                  fillWidth padding="8"
                  justifyContent="center">
                <Flex
                    paddingLeft="12" fillWidth
                    alignItems="center"
                    textVariant="body-default-s">
                    {display.location && (
                        <Flex hide="s">
                            {person.locationActual}
                        </Flex>
                    )}
                </Flex>
                <Flex fillWidth justifyContent="center">
                    <Flex
                        background="surface" border="neutral-medium" borderStyle="solid-1" radius="m-4" shadow="l"
                        padding="4"
                        justifyContent="center">
                        <Flex
                            gap="4"
                            textVariant="body-default-s">
                            {routes['/'] && (
                                <ToggleButton
                                    prefixIcon="home"
                                    href={`/${params?.locale}`}
                                    selected={pathname === "/"}>
                                    <Flex paddingX="2" hide="s">{home.label}</Flex>
                                </ToggleButton>
                            )}
                            {routes['/about'] && (
                                <ToggleButton
                                    prefixIcon="person"
                                    href={`/${params?.locale}/about`}
                                    selected={pathname === "/about"}>
                                    <Flex paddingX="2" hide="s">{about.label}</Flex>
                                </ToggleButton>
                            )}
                            {routes['/work'] && (
                                <ToggleButton
                                    prefixIcon="grid"
                                    href={`/${params?.locale}/work`}
                                    selected={pathname.startsWith('/work')}>
                                    <Flex paddingX="2" hide="s">{work.label}</Flex>
                                </ToggleButton>
                            )}
                            {routes['/blog'] && (
                                <ToggleButton
                                    prefixIcon="book"
                                    href={`/${params?.locale}/blog`}
                                    selected={pathname.startsWith('/blog')}>
                                    <Flex paddingX="2" hide="s">{blog.label}</Flex>
                                </ToggleButton>
                            )}
                            {routes['/family'] && (
                                <ToggleButton
                                    prefixIcon="gallery"
                                    href={`/${params?.locale}/family`}
                                    selected={pathname.startsWith('/family')}>
                                    <Flex paddingX="2" hide="s">{gallery.label}</Flex>
                                </ToggleButton>
                            )}
                        </Flex>
                    </Flex>
                </Flex>

                <Flex fillWidth justifyContent="center" alignItems="center">
                    <Flex
                    background={"warning-strong"}
                    paddingX={"4"}
                    radius={"xs"}
                    marginRight={"20"}
                    >
                    <Flex
                    padding={"4"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flex={1}
                    >
                        <Icon
                            name={"warningTriangle"}
                            size="xl">
                        </Icon>
                        <Text
                        align={"center"}
                        wrap={"stable"}
                        >
                            This website is under development,
                            last updated on {lastModified(8)}
                        </Text>
                        <Icon
                            name={"warningTriangle"}
                            size="xl">
                        </Icon>
                    </Flex>
                    </Flex>
                    <Flex
                        paddingRight="12"
                        justifyContent="flex-end"
                        alignItems="center"
                        textVariant="body-default-s"
                        gap="20">
                        {routing.locales.length > 1 &&
                            <Flex
                                background="surface" border="neutral-medium" borderStyle="solid-1" radius="m-4"
                                shadow="l"
                                padding="4" gap="2"
                                justifyContent="center">
                                {i18n && routing.locales.map((locale, index) => (
                                    <ToggleButton
                                        key={index}
                                        selected={params?.locale === locale}
                                        onClick={() => handleLanguageChange(locale)}
                                        className={isPending && 'pointer-events-none opacity-60' || ''}
                                    >
                                        {locale.toUpperCase()}
                                    </ToggleButton>
                                ))}
                            </Flex>
                        }
                        <Flex hide="s">
                            {display.time && (
                                <TimeDisplay timeZone={person.locationTz}/>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}