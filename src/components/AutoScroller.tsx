"use client";

import React, {useEffect} from "react";

export default function AutoScroller({shortCodeMap, offset=80}:{shortCodeMap: Map<string, string>, offset?: number}) {
    const scroller = ()=> {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('autoscroll');
        if (!id) {
            return
        }
        let element = document.getElementById(id);
        if (!element && shortCodeMap.has(id)) {
            element = document.getElementById(shortCodeMap.get(id) as string);
        }
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    }

    useEffect(() => {
        scroller();
    }, []);
    return <></>
}