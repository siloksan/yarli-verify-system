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

### Connect a phone or run an emulator

- Physical device: enable Developer Options and USB Debugging, then connect the phone via USB.
- Emulator: start a device from Android Studio Device Manager.

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

## 3. Build with EAS (cloud)

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

## 5. Gradle build (step-by-step with common issues)

Use this when you want a fully local Android build without EAS.

### Step 1. Generate native Android project (if missing)

```bash
cd c:\YVS
yarn workspace scanner prebuild
```

Possible trouble:
- `expo prebuild` fails because of missing env vars.
Fix:
- Ensure `apps/scanner/.env` exists and includes `EXPO_PUBLIC_*` values.

### Step 2. Open Android project once in Android Studio

Open `apps/scanner/android` in Android Studio and let it finish syncing.

Possible trouble:
- Gradle sync fails with `JDK not found` or `Invalid Gradle JDK`.
Fix:
- Install JDK 17 and set Android Studio Gradle JDK to 17.

### Step 3. Ensure SDK paths are set

Set environment variables (PowerShell example):

```powershell
$env:ANDROID_HOME="C:\Users\<user>\AppData\Local\Android\Sdk"
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
```

Possible trouble:
- `SDK location not found. Define location with sdk.dir in local.properties`.
Fix:
- In `apps/scanner/android/local.properties`, add:
  - `sdk.dir=C:\\Users\\<user>\\AppData\\Local\\Android\\Sdk`

### Step 4. Clean Gradle caches (optional, but helps flaky builds)

```bash
cd c:\YVS\apps\scanner\android
.\gradlew.bat clean
```

Possible trouble:
- `Execution failed for task :app:mergeReleaseResources`.
Fix:
- Delete `apps/scanner/android/app/build` and run `.\gradlew.bat clean` again.

### Step 5. Build release APK

```bash
cd c:\YVS\apps\scanner\android
.\gradlew.bat assembleRelease
```

Possible trouble:
- `Unable to find aapt2` or `Build-tools not found`.
Fix:
- Install Android SDK Build-Tools (latest) in Android Studio SDK Manager.

### Step 6. Locate the APK

`apps/scanner/android/app/build/outputs/apk/release/app-release.apk`

Possible trouble:
- APK not generated.
Fix:
- Check `apps/scanner/android/app/build/outputs/apk` for `debug` vs `release` and ensure `assembleRelease` completed without errors.

### Step 7. Install APK on device (optional)

```bash
cd c:\YVS\apps\scanner\android
adb install .\app\build\outputs\apk\release\app-release.apk
```

Possible trouble:
- `adb` not found.
Fix:
- Add `%ANDROID_HOME%\platform-tools` to `PATH`.

## 6. Manual install of APK build

Use this when you already have an `.apk` file (from EAS preview build or local Gradle build).

### Install via USB (recommended)

1. Enable Developer Options and USB Debugging on the phone.
2. Connect the phone via USB and allow the debugging prompt.
3. Install the APK with `adb`:

```bash
cd c:\YVS\apps\scanner\android
adb install -r .\app\build\outputs\apk\release\app-release.apk
```

Possible trouble:
- `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.
Fix:
- Uninstall the previous app first:
  - `adb uninstall com.tutel.scanner`

### Install by copying the APK to the device

1. Copy the APK to the phone (USB file transfer, email, or cloud).
2. On the phone, open the APK and allow installs from unknown sources.

Possible trouble:
- The installer is blocked.
Fix:
- Enable "Install unknown apps" for the file manager/browser you used.

## Troubleshooting

- If dependency state is broken, run:
  - `yarn install --immutable`
- If native Android cache issues appear:
  - delete `apps/scanner/android/.gradle` and rebuild
- If app points to wrong backend:
  - verify `.env` and `eas.json` values for `EXPO_PUBLIC_*` variables
