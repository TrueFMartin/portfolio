import {ReactElement} from "react";
import {MapOf, Record} from "immutable";

export declare type Image = {
    width: number;
    height: number;
    alt: string;
    src: string;
    orientation?: string;
};

export declare type ContactInfo = {
    email: {
        primary: string;
        secondary: string;
    };
    phone: string;
};

export declare type Person = {
    firstName: string;
    lastName: string;
    readonly name: string;
    role: string;
    avatar: string;
    locationTz: string;
    locationActual: string;
    readonly location: string;
    languages: string[];
};

export declare type SocialLink = {
    name: string;
    icon: string;
    link: string;
};


export declare type WorkExperience = {
    isEmpty: boolean;
    key: string;
    company: string;
    role: string;
    timeframe: string;
    achievements: string[];
    images: Image[];
};

export declare type Institution = {
    isEmpty: boolean;
    name: string;
    description: string;
    result: string;
    images: Image[];
};

export declare type Skill = {
    isEmpty: boolean;
    title: string;
    key: string;
    description: string;
    images: Image[];
};

declare type MinimalSection = {
    display: boolean;
    title: string;
}

declare type Section = MinimalSection & {
    description: ReactElement;
};

export declare type Technical = MinimalSection & {
    idToTitle: Map<string, string>;
    skills: Skill[];
};

export declare type About = {
    label: string;
    title: string;
    description: string;
    tableOfContent: {
        display: boolean;
        subItems: boolean;
    };
    displayAvatar: boolean;
    calendar:  {
        display: boolean;
        link: string;
    };
    intro: Section & {
        title: string;
    };
    work: MinimalSection & {
        experiences: WorkExperience[];
    };
    studies: MinimalSection & {
        institutions: Institution[];
    };
    technical: Technical;
};

export declare type Home = {
    label: string;
    title: string;
    description: string;
    headline: ReactElement;
    subline: ReactElement;
};

export declare type Blog = {
    label: string;
    title: string;
    description: string;
};

export declare type Work = {
    label: string;
    title: string;
    description: string;
};

export declare type Gallery = {
    label: string;
    title: string;
    description: string;
    images: Image[];
};

export declare type Newsletter = {
    display: boolean;
    title: JSX.Element;
    description: JSX.Element;
};

export declare type Needs = {
    display: boolean;
    db: string;
    robust: string;
    cloud: string;
    microservices: string;
    devops: string;
    authentication: string;
};

export declare type I18nContent = {
    person: Person;
    social: SocialLink[];
    newsletter: Newsletter;
    home: Home;
    about: About;
    blog: Blog;
    work: Work;
    gallery: Gallery;
    needs: Needs;
};
