export const BookActions: {
    RELEASE_SUBSCRIBE: string;
    RELEASE_UNSUBSCRIBE: string;
    AUTO_EMAIL: string;
    EMAIL_REMINDER: string;
    MANUAL_REQUEST: string
} = {
    RELEASE_SUBSCRIBE: "release_subscribe",
    RELEASE_UNSUBSCRIBE: "release_unsubscribe",
    AUTO_EMAIL: "auto_email",
    EMAIL_REMINDER: "email_reminder",
    MANUAL_REQUEST: "manual_request",
}

type PermissionToActionType = Readonly<{
    RELEASE_SUBSCRIBE: boolean,
    RELEASE_UNSUBSCRIBE: boolean,
    AUTO_EMAIL: boolean,
    EMAIL_REMINDER: boolean,
    MANUAL_REQUEST: boolean,
}>;

export const PermissionToAction: {
    NONE: PermissionToActionType,
    READ_SINGLE: PermissionToActionType,
    READ_MANY: PermissionToActionType,
    APPROVE_USERS: PermissionToActionType
} & Record<string, PermissionToActionType> = {
    NONE: {
        RELEASE_SUBSCRIBE: false,
        RELEASE_UNSUBSCRIBE: false,
        AUTO_EMAIL: false,
        EMAIL_REMINDER: false,
        MANUAL_REQUEST: false,
    },
    READ_SINGLE: {
        RELEASE_SUBSCRIBE: false,
        RELEASE_UNSUBSCRIBE: false,
        AUTO_EMAIL: false,
        EMAIL_REMINDER: true,
        MANUAL_REQUEST: true,
    },
    READ_MANY: {
        RELEASE_SUBSCRIBE: true,
        RELEASE_UNSUBSCRIBE: true,
        AUTO_EMAIL: true,
        EMAIL_REMINDER: true,
        MANUAL_REQUEST: true,
    },
    APPROVE_USERS: {
        RELEASE_SUBSCRIBE: true,
        RELEASE_UNSUBSCRIBE: true,
        AUTO_EMAIL: true,
        EMAIL_REMINDER: true,
        MANUAL_REQUEST: true,
    },
}

export const UserActions = {
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete",
    APPROVE: "approve",
    REJECT: "reject",
    PUBLISH: "publish",
    UNPUBLISH: "unpublish",
    VIEW: "view",
    ADD: "add",
    REMOVE: "remove",
    LOGIN: "login",
    LOGOUT: "logout",
    REGISTER: "register",
    FORGOT_PASSWORD: "forgot_password",
    RESET_PASSWORD: "reset_password",
    CHANGE_PASSWORD: "change_password",
    CHANGE_EMAIL: "change_email",
    CHANGE_USERNAME: "change_username",
    CHANGE_ROLE: "change_role",
    CHANGE_PERMISSIONS: "change_permissions",
    CHANGE_SETTINGS: "change_settings",
    CHANGE_AVATAR: "change_avatar",
    CHANGE_BANNER: "change_banner",
    CHANGE_THEME: "change_theme",
    CHANGE_LANGUAGE: "change_language",
    CHANGE_TIMEZONE: "change_timezone",
    CHANGE_CURRENCY: "change_currency",
    CHANGE_COUNTRY: "change_country",
    CHANGE_PHONE: "change_phone",
    CHANGE_NAME: "change_name",
    CHANGE_ADDRESS: "change_address",
    CHANGE_BIO: "change_bio",
    CHANGE_WEBSITE: "change_website",
    CHANGE_SOCIAL: "change_social",
    CHANGE_NOTIFICATIONS: "change_notifications",
    CHANGE_PRIVACY: "change_privacy",
    CHANGE_SECURITY: "change_security",
    CHANGE_SUBSCRIPTION: "change_subscription",
    CHANGE_PAYMENT: "change_payment",
    CHANGE_ORDER: "change_order",
    CHANGE_CART: "change_cart",
    CHANGE_WISHLIST: "change_wishlist",
    CHANGE_FAVORITES: "change_favorites",
    CHANGE_HISTORY: "change_history",
    CHANGE_BOOKMARKS: "change_bookmarks",
    CHANGE_RECENT: "change_recent",
    CHANGE_SAVED: "change_saved",
    CHANGE_LIKED: "change_liked",
    CHANGE_RATED: "change_rated",
    CHANGE_REVIEWED: "change_reviewed",
    CHANGE_COMMENTED: "change_commented",
    CHANGE_FOLLOWED: "change_followed",
    CHANGE_BLOCKED: "change_blocked",
    CHANGE_REPORTED: "change_reported",
    CHANGE_SPAM: "change_spam",
}