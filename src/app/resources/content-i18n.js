import {
    work as workImages,
    skills as skillImages,
    education as educationImages
} from "../../../public/images/about/image-metadata"

const createI18nContent = (t) => {
    const person = {
        firstName: 'True',
        lastName: 'Martin',
        get name() {
            return `${this.firstName} ${this.lastName}`;
        },
        role: t("person.role"),
        avatar: '/images/avatar.png',
        locationTz: 'America/Detroit',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
        locationActual: 'Greenville, SC',
        get location() {
            return `${this.locationActual}`;
        },
        languages: []  // optional: Leave the array empty if you don't want to display languages
    }

    const contact = {
        email: {
            primary: "true@parkermartin.org",
            secondary: "truefmartin@gmail.com"
        },
        phone: "479-244-7912"
    }

    const newsletter = {
        display: true,
        title: <>{t("newsletter.title", {...person})}</>,
        description: <>{t("newsletter.description")}</>
    }

    const social = [
        // Links are automatically displayed.
        // Import new icons in /once-ui/icons.ts
        {
            name: 'GitHub',
            icon: 'github',
            link: 'https://github.com/truefmartin',
        },
        {
            name: 'LinkedIn',
            icon: 'linkedin',
            link: 'https://www.linkedin.com/in/franklin-true-martin-91611323a/',
        },
        {
            name: 'X',
            icon: 'x',
            link: '',
        },
        {
            name: 'Email',
            icon: 'email',
            link: 'mailto:' + contact.email.primary,
        },
    ]

    const home = {
        label: t("home.label"),
        title: t("home.title", {...person}),
        description: t("home.description", {...person}),
        headline: <>{t("home.headline")}</>,
        subline: <>{t("home.subline", {...person})}</>
    }

    const about = {
        label: t("about.label"),
        title: t("about.title"),
        description: t("about.description", {...person}),
        tableOfContent: {
            display: true,
            subItems: true
        },
        displayAvatar: true,
        calendar: {
            display: true,
            link: 'https://cal.com/true-martin/30min'
        },
        intro: {
            display: true,
            title: t("about.intro.title"),
            description: <>{t("about.intro.description", {...person})}</>
        },
        work: {
            display: true, // set to false to hide this section
            title: t("about.work.title"),
            experiences: [
                {
                    get isEmpty() {
                        return this.company === '';
                    },
                    // Define what the base object looks like, even though it's empty
                    company: '',
                    key: '',
                    timeframe: '',
                    role: '',
                    achievements: [],
                    images: [
                        {
                            src: '',
                            alt: '',
                            width: 0,
                            height: 0,
                        }
                    ],
                }
            ] // Populate dynamically
        },
        studies: {
            display: true, // set to false to hide this section
            title: 'Education',
            institutions: [
                {
                    get isEmpty() {
                        return this.name === '';
                    },
                    // Define what the base object looks like, even though it's empty
                    name: '',
                    description: '',
                    result: '',
                    images: [
                        {
                            src: '',
                            alt: '',
                            width: 0,
                            height: 0,
                        }
                    ],
                }
            ] // Populate dynamically
        },
        technical: {
            display: true, // set to false to hide this section
            title: t("about.technical.title"),
            skills: [
                {
                    get isEmpty() {
                        return this.title === '';
                    },
                    // Define what the base object looks like, even though it's empty
                    title: '',
                    key: '',
                    description: '',
                    images: [
                        {
                            src: '',
                            alt: '',
                            width: 0,
                            height: 0,
                        }
                    ],
                }
            ]
        }
    }

    const aboutWork = t.raw("about.work.experiences")
    // For each `about.work.experiences.` not used above,
    // add a new experience object:
    for (const [title, experience] of Object.entries(aboutWork)) {
        const images = []
        const metadata = workImages.get(experience.key)
        if (metadata && metadata.enabled) {
            metadata.images.forEach(image => {
                images.push({
                    src: image.path,
                    alt: experience.key,
                    width: image.width,
                    height: image.height,
                })
            })
        }

        about.work.experiences.push({
            key: experience.key,
            company: title,
            timeframe: experience.timeframe,
            role: experience.role,
            achievements: experience.achievements ? experience.achievements.split(";") : [],
            images: images,
        })
    }

    const aboutStudies = t.raw("about.studies.institutions")
    // For each `about.studies.institutions.` not used above,
    // add a new institution object:
    for (const [title, institution] of Object.entries(aboutStudies)) {
        const images = []
        const metadata = educationImages.get(institution.key)
        if (metadata && metadata.enabled) {
            metadata.images.forEach(image => {
                images.push({
                    src: image.path,
                    alt: title,
                    width: image.width,
                    height: image.height,
                })
            })
        }
        about.studies.institutions.push({
            name: title,
            description: institution.description,
            result: institution.result,
            images: images,
        })
    }

    const skills = t.raw("about.technical.skills")
    // For each `about.technical.skills.` not used above,
    // add a new skill object:
    for (const [title, skill] of Object.entries(skills)) {
        const images = []
        const metadata = skillImages.get(skill.key)
        if (metadata && metadata.enabled) {
            metadata.images.forEach(image => {
                images.push({
                    src: image.path,
                    alt: image.path.split("/").pop(),
                    width: image.width,
                    height: image.height,
                })
            })
        }
        about.technical.skills.push({
            title: title,
            key: skill.key,
            description: skill.description,
            images: images,
        })
    }


    const blog = {
        label: t("blog.label"),
        title: t("blog.title"),
        description: t("blog.description", {name: person.name})
        // Create new blog posts by adding a new .mdx file to app/blog/posts
        // All posts will be listed on the /blog route
    }

    const work = {
        label: t("work.label"),
        title: t("work.title"),
        description: t("work.description", {name: person.name})
        // Create new project pages by adding a new .mdx file to app/blog/posts
        // All projects will be listed on the /home and /work routes
    }

    const gallery = {
        label: t("gallery.label"),
        title: t("gallery.title"),
        description: t("gallery.description", {name: person.name}),
        // Images from https://pexels.com
        images: [
            {
                src: '/images/gallery/img-01.jpg',
                alt: 'image',
                orientation: 'vertical',
                height: 800,
                width: 400,
            },
        ]
    }
    return {
        person,
        social,
        newsletter,
        home,
        about,
        blog,
        work,
        gallery
    }
};

export {createI18nContent};