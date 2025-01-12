'use client';

import {IconButton, SmartLink} from '@/once-ui/components'
import React from "react";
import {Flex, Text} from '@/once-ui/components';
import styles from "@/components/about/about.module.scss";
import Link from "next/link";

// function scrollTo(
//     {route, skillId, offset}: { route?: string, skillId: string, offset: number }) {
//     const scroller = () => {
//         const element = document.getElementById(skillId);
//         if (element) {
//             const elementPosition = element.getBoundingClientRect().top;
//             const offsetPosition = elementPosition + window.scrollY - offset;
//
//             window.scrollTo({
//                 top: offsetPosition,
//                 behavior: 'smooth',
//             });
//         }
//     }
//     // Scroll immediately if no route change is needed
//     scroller();
// }
//

function RenderNeed(
    {text, skillId, route}: { text: string, skillId: string, route?: string }
) {
    return <SmartLink
        href={route + `?autoscroll=${skillId}`}>
        <Flex
            style={{cursor: 'pointer', borderRight: 'white'}}
            className={styles.hover}
            gap="8"
            alignItems="center">
                {text}
            {/*<IconButton*/}
            {/*    data-border="rounded"*/}
            {/*    variant="tertiary"*/}
            {/*    icon="helpCircle"*/}
            {/*/>*/}
        </Flex>
    </SmartLink>;
}

export default RenderNeed;