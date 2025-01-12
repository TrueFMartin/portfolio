const baseURL = 'parkermartin.org'

// Enable localization
const i18n = true;

// Manage localized content in the messages folder
const i18nOptions = {
    locales: ['en'],       // A list of all locales that are supported, e.g. ['en','es']
    defaultLocale: 'en'         // Locale used by default and as a fallback
}

const routes = {
    '/': true,
    '/about': true,
    '/work': true,
    '/blog': false,
    '/family': true,
    // '/api/healthcheck': true,
}

// Enable password protection on selected routes
// Set password in pages/api/authenticate.ts
const protectedRoutes = {
    '/family/secure': true
}

const effects = {
    mask: 'cursor',             // none | cursor | topLeft | topRight | bottomLeft | bottomRight
    gradient: {
        display: true,
        opacity: 0.4            // 0 - 1
    },
    dots: {
        display: true,
        opacity: 0.4,           // 0 - 1
        size: '24'              // 2 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 634
    },
    lines: {
        display: true,
    },
}

const style = {
    theme: 'dark',         // dark | light
    neutral: 'gray',         // sand | gray | slate
    brand: 'green',      // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
    accent: 'aqua',       // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
    solid: 'color',     // color | contrast
    solidStyle: 'flat',         // flat | plastic
    border: 'rounded',      // rounded | playful | conservative
    surface: 'filled',  // filled | translucent
    transition: 'all'           // all | micro | macro
}

const display = {
    location: true,
    time: true
}

const mailchimp = {
    action: 'https://url/subscribe/post?parameters',
    effects: {
        mask: 'topRight',           // none | cursor | topLeft | topRight | bottomLeft | bottomRight
        gradient: {
            display: true,
            opacity: 0.6            // 0 - 1
        },
        dots: {
            display: false,
        },
        lines: {
            display: false,
        },
    }
}

export {routes, protectedRoutes, effects, style, display, mailchimp, baseURL, i18n, i18nOptions};