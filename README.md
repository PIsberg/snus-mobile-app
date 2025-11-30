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


Changes Made
Built Web Assets: Ran npm run build to generate the production-ready web assets in the dist folder.
Initialized Android Platform: Ran npx cap add android to create the native Android project structure.
Synced Capacitor: Ran npx cap sync to copy the web assets and configuration to the Android project.
Verification Results
Build Verification
Web Build: Successful. dist folder created.
Android Platform: Successful. android directory created.
Sync: Successful. Web assets copied to android/app/src/main/assets/public.

Next Steps
To finish the deployment process, you need to use Android Studio:

Open the Project: Run npx cap open android in your terminal. This will open the project in Android Studio.
Generate Signed Bundle:
In Android Studio, go to Build > Generate Signed Bundle / APK.
Select Android App Bundle.
Create a new key store (or use an existing one) and follow the prompts.
Select the release build variant.
Upload to Play Console:
Locate the generated .aab file (usually in android/app/release).
Upload this file to your Google Play Console account.
TIP

Make sure to update your capacitor.config.ts with the correct appId if you haven't already, as this will be your package name on Google Play.