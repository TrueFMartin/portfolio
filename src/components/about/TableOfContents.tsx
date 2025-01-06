'use client';

import React from 'react';
import { Flex, Text } from '@/once-ui/components';
import {Sidebar} from "@/once-ui/components/Sidebar";
import styles from './about.module.scss';

interface TableOfContentsProps {
    structure: {
        title: string;
        display: boolean;
        items: string[];
    }[];
    about: {
        tableOfContent: {
            display: boolean;
            subItems: boolean;
        };
    };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about }) => {
    const scrollTo = (id: string, offset: number) => {
        const element = document.getElementById(id);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
        return element !== null;
    };

    if (!about.tableOfContent.display) return null;

    return (
        <Flex
            style={{
                left: '0',
                whiteSpace: 'nowrap'
            }}
            alpha={"accent-weak"}
            border={"brand-strong"}
            gap="32"
            paddingRight={"m"}
            padding={"s"}
            direction="column" hide="m">
            {
                structure
                .filter(section => section.display && section.items && section.items.length > 0)
                .map((section, sectionIndex) => (
                <Flex key={sectionIndex} gap="12" direction="column">
                    <Flex
                        style={{ cursor: 'pointer', borderRadius: '8px' }}
                        className={styles.hover}
                        padding={"2"}
                        background={sectionIndex % 2 === 0 ? "accent-strong" : "brand-strong"}
                        gap="8"
                        align={"left"}
                        alignItems="center"
                        onClick={() => scrollTo(section.title, 80)}>
                        <Flex
                            height="1" minWidth="16"
                            style={{
                                backgroundColor: 'white'
                            }}
                        >
                        </Flex>
                        <Text>
                            {section.title}
                        </Text>
                    </Flex>
                    {about.tableOfContent.subItems && (
                        <>
                            {section.items.filter(
                                item => item.length > 0
                            ).map((item, itemIndex) => (
                                <Flex
                                    hide="l"
                                    key={itemIndex}
                                    style={{ cursor: 'pointer' }}
                                    className={styles.hover}
                                    gap="12" paddingLeft="24"
                                    alignItems="center"
                                    onClick={() => scrollTo(item, 80) || scrollTo(section.title, 80)}>
                                    <Flex
                                        height="1" minWidth="8"
                                        style={{
                                            // backgroundColor: 'white'
                                        }}
                                        background="neutral-strong"
                                    >
                                    </Flex>
                                    <Text>
                                        {item}
                                    </Text>
                                </Flex>
                            ))}
                        </>
                    )}
                </Flex>
            ))}
        </Flex>
    );
};

export default TableOfContents;