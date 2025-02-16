import { signIn as authSignIn } from "@/lib/auth-client"; //import the auth client

// Add more as needed, right now, only "google".
export async function signIn(provider: "google") {
    return await authSignIn.social({
        /**
         * The social provider id
         * @example "github", "google", "apple"
         */
        provider: provider,
        /**
         * a url to redirect after the user authenticates with the provider
         * @default "/"
         */
        callbackURL: "/family/user",
        /**
         * a url to redirect if an error occurs during the sign in process
         */
        errorCallbackURL: "/error",
        /**
         * a url to redirect if the user is newly registered
         */
        newUserCallbackURL: "/family/user",
        /**
         * disable the automatic redirect to the provider.
         * @default false
         */
        disableRedirect: false,
    });
}