# Android Internal Build

## Prerequisites

- Expo account with access to the project
- `eas-cli` available via `npx eas-cli`
- EAS login completed
- Android application id set to `com.fieldbill.app`

## Build command

```powershell
npx eas-cli build -p android --profile internal
```

## What the profile does

- Uses the `internal` profile in [eas.json](/C:/fieldbill/eas.json)
- Produces an Android `apk`
- Uses EAS internal distribution for tester sharing
- Auto-increments the native build number so testers can install newer APKs over older ones

## Versioning note

FieldBill currently uses local EAS app versioning because the remote EAS counters are behind the builds already uploaded to Apple and Google. After a successful EAS build, commit the updated [app.json](/C:/fieldbill/app.json) if EAS increments `ios.buildNumber` or `android.versionCode`.

## Share flow

1. Run the build command.
2. Open the EAS build link returned by the CLI.
3. Share that internal distribution link with testers, or download the APK and send it directly.
