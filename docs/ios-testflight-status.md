# iOS TestFlight Status

Last updated: 2026-04-26

## Current Build

- App: FieldBill
- App Store Connect app id: `6762166246`
- Bundle identifier: `com.fieldbill.app`
- Version: `1.0.0`
- Latest iOS build number: `4`
- EAS build id: `3029642b-e17e-4601-aef7-5d4e305ba3f0`
- EAS submission id: `52d71e57-4255-460d-b965-657ecf82a0c8`
- IPA artifact: https://expo.dev/artifacts/eas/6WWq4WXeg9ehc3mXBJtwW5.ipa
- App Store Connect TestFlight page: https://appstoreconnect.apple.com/apps/6762166246/testflight/ios

The `1.0.0 (4)` binary was built and submitted to App Store Connect on 2026-04-26. Apple still has to finish processing before it can be selected for TestFlight testing.

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

1. Wait for Apple processing to finish.
2. Open App Store Connect TestFlight: https://appstoreconnect.apple.com/apps/6762166246/testflight/ios
3. Confirm build `1.0.0 (4)` appears under iOS builds.
4. Add internal testers or the intended TestFlight group.
5. If Apple asks for export compliance, keep the declaration aligned with `ITSAppUsesNonExemptEncryption=false`.
6. Smoke test on a real iPhone through TestFlight.

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

