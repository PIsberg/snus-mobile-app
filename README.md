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
   
   Enable Google Drive API. Configure OAuth Consent Screen (User Type: External, scope: drive.file, drive.appdata). Create Credentials: Android Client ID: Use package name com.snustrack.app and your SHA-1 fingerprint. Web Client ID: For web testing / token exchange.
To enable the Google Drive API, configure your OAuth Consent Screen, and create credentials for your Android and Web applications, follow these steps:

1. Enable the Google Drive API
Navigate to the APIs & Services Dashboard in your Google Cloud project ( snus-track-app ).
Click on "+ ENABLE APIS AND SERVICES" at the top.
Search for "Google Drive API" and select it from the results.
Click the "Enable" button.
2. Configure OAuth Consent Screen
This step defines how your application will appear to users when they grant access to their Google Drive.

In the Google Cloud Console, go to "APIs & Services" > " OAuth consent screen ".
User Type: Select "External" and click "CREATE".
App Information:
App name: Provide a user-facing name for your application (e.g., "Snus Track App").
User support email: Select an email address for user support.
App logo: (Optional) Upload a logo for your application.
App domain: (Optional) Provide your application homepage and authorized domains.
Developer contact information: Enter an email address.
Click "SAVE AND CONTINUE".
Scopes:
Click "ADD OR REMOVE SCOPES".
Search for and select the following scopes:
.../auth/drive.file
.../auth/drive.appdata
Click "UPDATE".
Click "SAVE AND CONTINUE".
Test users: For external user types, you'll need to add test users if your app is not yet published. Add any Google accounts you want to use for testing.
Click "SAVE AND CONTINUE".
Review your settings and then click "BACK TO DASHBOARD".
3. Create Credentials
You'll need two types of OAuth 2.0 Client IDs: one for your Android application and one for your web backend (for testing or token exchange).

a. Create Android Client ID
This credential will be used by your Android application to authenticate users and access their Google Drive.

In the Google Cloud Console, go to "APIs & Services" > " Credentials ".
Click "+ CREATE CREDENTIALS" and select "OAuth client ID".
Application type: Select "Android".
Name: Provide a name for this client ID (e.g., "Snus Track Android App").
Package name: Enter com.snustrack.app .
SHA-1 certificate fingerprint: Enter your SHA-1 fingerprint. You can obtain this using the keytool command.
Click "CREATE".
Make a note of the Client ID generated.
b. Create Web Client ID
This credential is typically used by your backend server to exchange authorization codes for access and refresh tokens, or for web-based testing.

In the Google Cloud Console, go to "APIs & Services" > " Credentials ".
Click "+ CREATE CREDENTIALS" and select "OAuth client ID".
Application type: Select "Web application".
Name: Provide a name for this client ID (e.g., "Snus Track Web Server").
You can leave "Authorized JavaScript origins" and "Authorized redirect URIs" empty for now if this is solely for token exchange or backend use where no direct browser redirects are involved.
Click "CREATE".
Make a note of the Client ID and Client Secret generated.

Run android app npx cap run android