import { AdMob, BannerAdSize, BannerAdPosition, AdMobError } from '@capacitor-community/admob';

let lastError: string | null = null;
let isInitialized = false;

export async function initializeAdMob() {
    try {
        await AdMob.initialize({
            testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'],
            initializeForTesting: true,
        });
        isInitialized = true;
        console.log('AdMob initialized');
    } catch (e: any) {
        lastError = e?.message || JSON.stringify(e);
        console.error('AdMob initialization failed', e);
    }
}

export async function showBanner() {
    try {
        const options = {
            adId: 'ca-app-pub-3940256099942544/6300978111', // Test Banner ID
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: true
        };
        await AdMob.showBanner(options);
        console.log('Banner shown');
    } catch (e: any) {
        lastError = e?.message || JSON.stringify(e);
        console.error('Failed to show banner', e);
        throw e;
    }
}

export async function hideBanner() {
    try {
        await AdMob.hideBanner();
    } catch (e: any) {
        lastError = e?.message || JSON.stringify(e);
        console.error('Failed to hide banner', e);
    }
}

export async function resumeBanner() {
    try {
        await AdMob.resumeBanner();
    } catch (e: any) {
        lastError = e?.message || JSON.stringify(e);
        console.error('Failed to resume banner', e);
    }
}

export function getAdMobStatus() {
    return { isInitialized, lastError };
}
