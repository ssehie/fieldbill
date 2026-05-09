# iOS TestFlight Status

Last updated: 2026-05-09

## Current Build

- App: FieldBill
- App Store Connect app id: `6762166246`
- Bundle identifier: `com.fieldbill.app`
- Version: `1.0.0`
- Latest iOS build number: `5`
- EAS build id: `17ee3fd2-41d0-402c-a54b-f897d3bd1cf4`
- EAS submission ids attempted: `6a740efc-905c-4b68-b033-e18d8ba88f43`, `d281b7ba-6d5e-4be8-96cc-abb7121e90bf`, `5489c26f-46e5-4bb8-bfb9-3eb11e9cea9a`
- IPA artifact: https://expo.dev/artifacts/eas/3XoPFBKKCcTVzkcLeYKSeA.ipa
- App Store Connect TestFlight page: https://appstoreconnect.apple.com/apps/6762166246/testflight/ios

The `1.0.0 (5)` binary is visible in App Store Connect TestFlight and attached to the external group `ReliableQA iOS`. As of 2026-05-09 03:52 America/Chicago, build `1.0.0 (5)` is still `Waiting for Review`, with 1 invite and no install/session data yet.

The external group `ReliableQA iOS` currently shows `0 Testers` and `1 Build`. A public TestFlight link was created for the group:

```text
https://testflight.apple.com/join/dYdE2Gcw
```

App Store Connect warns that testers cannot join the public link until the group has an approved build, so Apple Beta App Review remains the blocking item before any iOS paid tester marketplace can start.

## Verification Done Before Build

```powershell
npm run check:tester-release
```

Result:

- TypeScript passed.
- Expo lint passed.
- Expo Doctor passed locally.
- FieldBill tester-release preflight passed.

Warnings:

- EAS local versioning is active, so `app.json` must keep the bumped `ios.buildNumber`.
- No local `.env` file was present. This is fine for functional TestFlight testing, but purchase testing needs RevenueCat Apple keys/products.
- The working tree has uncommitted changes.

## Build Notes

The first refresh attempt created EAS build `56602e55-3012-4583-a4f1-bc3387f6cbcf` as build `3`, but it failed in prebuild because `.easignore` excluded `*.png` and removed the app icon assets from the upload.

Fix applied:

- Added `.easignore`.
- Kept local build artifacts, APK/AAB/APKS/IPA files, generated native folders, `node_modules`, `.expo`, and local secrets out of EAS uploads.
- Removed the broad `*.png` ignore so app icons and splash assets are included.

Do not pass `--what-to-test` unless the Expo account is on Enterprise. EAS rejected the auto-submit when that changelog field was provided.

Successful command:

```powershell
$env:EAS_NO_VCS='1'
npx eas-cli build -p ios --profile production --auto-submit-with-profile production --message "FieldBill iOS refresh after EAS archive fix" --non-interactive --wait --json
```

## Cost Note

EAS reported that the account had used `100%` of included build credits for the month. Additional iOS build attempts may be charged at pay-as-you-go rates by Expo.

## Next Manual Steps

1. Wait for Apple Beta App Review to finish for build `1.0.0 (5)`.
2. Open App Store Connect TestFlight: https://appstoreconnect.apple.com/apps/6762166246/testflight/ios
3. Confirm build `1.0.0 (5)` moves beyond `Waiting for Review`.
4. Share public link `https://testflight.apple.com/join/dYdE2Gcw` or add tester emails to `ReliableQA iOS` once the build is approved.
5. If Apple asks for export compliance, keep the declaration aligned with `ITSAppUsesNonExemptEncryption=false`.
6. Smoke test on a real iPhone through TestFlight.
7. If ReliableQA has not replied, use TestFi as the alternate iOS tester route. Live pricing checked 2026-05-09: `$1.99` per written-feedback tester or `$3.99` per video-feedback tester; campaigns say they fill in 24-48h and support iOS TestFlight.

## iPhone Smoke Checklist

1. Install build `1.0.0 (4)` from TestFlight.
2. Fresh launch opens onboarding/setup.
3. Complete setup.
4. Start a job.
5. Add job details and at least one part.
6. Finish the job.
7. Review the invoice.
8. Open email handoff.
9. Return to FieldBill and confirm invoice/history still render.
10. Open FieldBill Pro screen.
11. Confirm the app still lets functional testing continue if RevenueCat purchase setup is unavailable.
