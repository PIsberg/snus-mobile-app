import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// defined in capacitor.config.ts, but for web we might need to load the script or init explicitly if not using the config completely.
// GoogleAuth.initialize() is recommended to be called early.

export interface UserInfo {
    id: string;
    email: string;
    givenName: string;
    familyName: string;
    imageUrl: string;
    accessToken: string;
}

export const AuthService = {
    initialize: async () => {
        try {
            await GoogleAuth.initialize({
                clientId: '111269543550-6ggs0lqbv5n4u1f813nct90arjsgg8p5.apps.googleusercontent.com',
                scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appdata'],
                grantOfflineAccess: true,
            });
        } catch (e) {
            console.error("Auth initialize failed", e);
        }
    },

    signIn: async (): Promise<UserInfo | null> => {
        try {
            const result = await GoogleAuth.signIn();
            if (result) {
                // GoogleAuth returns 'authentication' object with accessToken.
                return {
                    id: result.id,
                    email: result.email,
                    givenName: result.givenName || '',
                    familyName: result.familyName || '',
                    imageUrl: result.imageUrl || '',
                    accessToken: result.authentication.accessToken
                };
            }
        } catch (e) {
            console.error("Sign in failed", e);
        }
        return null;
    },

    signOut: async () => {
        try {
            await GoogleAuth.signOut();
        } catch (e) {
            console.error("Sign out failed", e);
        }
    },

    refresh: async (): Promise<UserInfo | null> => {
        // Refresh isn't fully supported by the plugin in the way we expect (returning full user info).
        // We rely on explicit sign-in for now.
        return null;
    }
};
