# Scanner App

Expo-based mobile scanner app in the Yarli Verify System monorepo.

## Tech stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- Android package id: `com.tutel.scanner`

## 1. Install process

### Prerequisites

- Node.js `>=20.22`
- Corepack enabled
- Yarn `4.12.0`
- Android Studio (for local Android development)
- JDK 17 (usually included with Android Studio)

### Setup from monorepo root

```bash
cd c:\YVS
corepack enable
corepack prepare yarn@4.12.0 --activate
yarn install --immutable
```

### Scanner environment variables

Create/update `apps/scanner/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://82.202.137.69:3000
EXPO_PUBLIC_WEB_CLIENT_BASE_URL=http://82.202.137.69:80
```

`EXPO_PUBLIC_*` variables are embedded into the app at build time.

## 2. Development process (Android Studio)

### One-time Android Studio setup

1. Install Android Studio.
2. Install SDK components:
   - Android SDK Platform (latest stable)
   - Android SDK Build-Tools
   - Android Emulator
3. Create an emulator in Device Manager (for example Pixel + Android 14/15 image).
4. Ensure `ANDROID_HOME` points to your SDK and `platform-tools` is in `PATH`.

### Run app on Android emulator/device

From monorepo root:

```bash
cd c:\YVS
yarn workspace scanner android
```

This command runs `expo run:android` and launches the app in a native Android build.

### Useful dev commands

```bash
cd c:\YVS\apps\scanner
npx expo start --dev-client
```

- Press `a` to open Android target from Expo CLI.
- Use Metro logs for JS/runtime debugging.
- For native debugging/profiling, open `apps/scanner/android` in Android Studio.

## 3. Production build process

Production artifacts are built with Expo official cloud tool: EAS Build.

### EAS configuration

`apps/scanner/eas.json` contains:

- `preview` profile: Android `apk` (internal distribution, direct install on many devices)
- `production` profile: Android `app-bundle` (`.aab`, for Google Play)
- Build-time env values for `EXPO_PUBLIC_API_BASE_URL` and `EXPO_PUBLIC_WEB_CLIENT_BASE_URL`

### Build APK (install directly on devices)

```bash
cd c:\YVS\apps\scanner
npx eas login
npx eas build -p android --profile preview
```

After build completes, download the generated `.apk` from the EAS build page.

### Build AAB (Google Play)

```bash
cd c:\YVS\apps\scanner
npx eas build -p android --profile production
```

After build completes, download the generated `.aab` from the EAS build page and upload it to Google Play Console.

### Optional: submit to Google Play via EAS

```bash
npx eas submit -p android --profile production
```

## 4. Local build process

Use this when you want to build on your machine instead of Expo cloud.

### Required local environment

- `JAVA_HOME` -> JDK 17 path (for example `C:\Program Files\Microsoft\jdk-17...`)
- `ANDROID_HOME` -> Android SDK path (for example `C:\Users\<user>\AppData\Local\Android\Sdk`)
- `PATH` should include:
  - `%ANDROID_HOME%\platform-tools`
  - `%ANDROID_HOME%\emulator`
  - `%ANDROID_HOME%\cmdline-tools\latest\bin`

### Local build with EAS (official Expo, local runner)

```bash
cd c:\YVS\apps\scanner
npx eas build -p android --profile preview --local
```

Important:

- `eas build --local` for Android requires macOS or Linux.
- On Windows you will get: `Unsupported platform, macOS or Linux is required to build apps for Android`.
- On Windows, use one of these instead:
  - EAS cloud build: `npx eas build -p android --profile preview`
  - Native local Gradle build (section below).

### Local build with Gradle (native Android)

```bash
cd c:\YVS\apps\scanner\android
.\gradlew.bat assembleRelease
```

APK output:

`apps/scanner/android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

- If dependency state is broken, run:
  - `yarn install --immutable`
- If native Android cache issues appear:
  - delete `apps/scanner/android/.gradle` and rebuild
- If app points to wrong backend:
  - verify `.env` and `eas.json` values for `EXPO_PUBLIC_*` variables
