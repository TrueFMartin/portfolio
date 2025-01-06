'use client';

import {IconButton} from '@/once-ui/components'
import React from "react";
import {Flex, Text} from '@/once-ui/components';
import styles from "@/components/about/about.module.scss";

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
};


function RenderNeed(
    {text, skillId}: { text: string, skillId: string }
) {
    return <Flex
        style={{cursor: 'pointer'}}
        className={styles.hover}
        gap="8"
        alignItems="center"
        onClick={() => scrollTo(skillId, 80)}>
        <Text>
            {text}
        </Text>
        <IconButton
            data-border="rounded"
            variant="tertiary"
            icon="helpCircle"
        />
    </Flex>;
}

export default RenderNeed;