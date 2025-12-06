<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Build for Android

1. **Build and Sync**:
   Run the following command to build the web assets and sync them to the Android project:
   ```bash
   npm run cap:sync
   ```
   *Note: This command runs `npm run build` followed by `npx cap sync`.*

2. **Open Android Studio**:
   Open the native Android project in Android Studio:
   ```bash
   npx cap open android
   ```

3. **Generate Signed Bundle**:
   - In Android Studio, go to **Build > Generate Signed Bundle / APK**.
   - Select **Android App Bundle**.
   - Create a new key store (or choose an existing one).
   - Select the **release** build variant.
   - Click **Finish** to generate the `.aab` file for the Play Store.

## Recurring Updates

When you make changes to your web code (React/TypeScript):

1. **Rebuild and Sync**:
   Always run this command to update the native Android project with your latest changes:
   ```bash
   npm run cap:sync
   ```

2. **Build in Android Studio**:
   - If Android Studio is already open, just click the **Sync Project with Gradle Files** button (elephant icon) if needed.
   - Then run **Build > Generate Signed Bundle / APK** again to create a new updated bundle.

## Upload to Google Play Console

1. **Create an App**:
   - Go to the [Google Play Console](https://play.google.com/console).
   - Click **Create app**.
   - Enter your App Name ("SnusTrack AI"), select **App**, and select **Free** (or Paid).
   - Accept the declarations and click **Create app**.

2. **Set up your App**:
   - Dashboard will guide you through steps like "Set up your store listing", "Content rating", etc. Complete these.

3. **Create a Release**:
   - In the left menu, go to **Release > Production** (or **Testing > Internal testing** for a beta).
   - Click **Create new release**.
   - Click **Choose signing key** and use "Google Play App Signing" (recommended).
   - Under **App bundles**, drag and drop the `.aab` file you generated (usually found in `android/app/release/app-release.aab` on your computer).
   - Enter a release name (e.g., "1.0.0") and release notes.
   - Click **Next**, review any warnings, and then **Save** and **Start rollout**.