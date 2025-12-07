# System Architecture

## Overview
SnusTrack AI is a mobile application built with React and Capacitor, designed to help users track and analyze their nicotine consumption. The application leverages a serverless architecture, utilizing Google Cloud services for storage, authentication, and artificial intelligence, coordinated through a Firebase project configuration.

## Technology Stack

### Frontend
- **Framework**: React (Vite)
- **Mobile Runtime**: Capacitor (Android)
- **Language**: TypeScript
- **UI Library**: Lucide React (Icons), Standard CSS

### Backend & Cloud Services
- **Authentication**:  
  - **Service**: Google Sign-In (via `@codetrix-studio/capacitor-google-auth`)
  - **Infrastructure**: Firebase Authentication / Google Cloud Identity
  - **Role**: Handles user login and provides OAuth tokens for accessing Google Drive.

- **Storage (User Data)**:  
  - **Service**: Google Drive API (v3)
  - **Type**: Personal User Storage (App Data / File Scope)
  - **Mechanism**: The app directly interacts with the user's Google Drive to read/write a `snustrack_backup.json` file. This ensures privacy and data ownership as data remains in the user's personal drive.
  - **Local Sync**: Data is cached locally using the device's `localStorage` for offline capability.

- **Artificial Intelligence**:  
  - **Service**: Google Gemini API (`@google/genai`)
  - **Model**: `gemini-2.5-flash`
  - **Role**: Analyzes consumption logs to provide motivational insights and usage patterns.

- **Monetization**:
  - **Service**: AdMob
  - **Integration**: `@capacitor-community/admob`

## Data Flow
1.  **Local First**: User actions (logging usage) are saved immediately to local storage.
2.  **Cloud Sync**: When the user signs in, the app attempts to sync (upload/download) the `snustrack_backup.json` file from their Google Drive.
3.  **AI Analysis**: On demand, a summary of the local logs is sent to the Gemini API to generate text-based analysis.

## Sequence Diagram
The following PlantUML diagram illustrates the core user flows: Authentication, Data Sync, and AI Analysis.

```plantuml
@startuml
skinparam participantStyle native

actor User
participant "App (React)" as App
participant "LocalStorage" as Local
participant "AuthService" as Auth
participant "Google Identity" as GoogleAuth
participant "StorageService" as Storage
participant "Google Drive API" as Drive
participant "GeminiService" as AI
participant "Google Gemini API" as Gemini

== Initialization ==
User -> App: Open App
App -> Local: Load Logs & Settings
Local --> App: Return Data

== Authentication & Sync ==
User -> App: Click "Sign In with Google"
App -> Auth: signIn()
Auth -> GoogleAuth: Request OAuth Token
GoogleAuth --> Auth: Return AccessToken & UserInfo
Auth --> App: Authenticated

note right of App
  App uses AccessToken to 
  access Drive API
end note

App -> Storage: syncWithDrive(AccessToken)
Storage -> Drive: Search for 'snustrack_backup.json'
alt File Exists
    Storage -> Drive: PATCH (Update File)
    Drive --> Storage: Success
else File Not Found
    Storage -> Drive: POST (Create File)
    Drive --> Storage: Success
end
Storage --> App: Sync Complete

== AI Analysis ==
User -> App: Click "Analyze Habits"
App -> AI: analyzeHabits(logs, settings)
AI -> Gemini: POST /generateContent (Prompt + Data Summary)
Gemini --> AI: Return Analysis Text
AI --> App: Display Insight
@enduml
```

## Key Configuration Files
- **`capacitor.config.ts`**: Configures the App ID (`com.snustrack.app`) and Google Auth scopes.
- **`android/app/google-services.json`**: Links the Android app to the Firebase/Google Cloud project for authentication and services.
- **`services/storageService.ts`**: Contains the logic for direct REST calls to Google Drive.
