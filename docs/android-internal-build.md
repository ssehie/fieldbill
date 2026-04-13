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

## Share flow

1. Run the build command.
2. Open the EAS build link returned by the CLI.
3. Share that internal distribution link with testers, or download the APK and send it directly.
