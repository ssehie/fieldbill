# iOS TestFlight Status

Last updated: 2026-05-21

## Current Build

- App: FieldBill
- App Store Connect app id: `6762166246`
- Bundle identifier: `com.fieldbill.app`
- Version: `1.0.0`
- Latest iOS build number: `6`
- EAS build id: `0226a1eb-d7cc-479a-b1c7-1f7133966f7f`
- EAS submission id: `b7ab4410-c4a2-47f0-bb2e-de5d4743d8da`
- IPA artifact: https://expo.dev/artifacts/eas/gpuoSMQqW2KojGnGnaiBV.ipa
- App Store Connect TestFlight page: https://appstoreconnect.apple.com/apps/6762166246/testflight/ios
- App Store submission id: `cf9b172e-3c31-4d83-ad77-1b67d8f9e570`
- Current App Store review status: `Approved for distribution` / eligible for distribution as of Apple email received `2026-05-21T22:10:48Z`
- App Store URL: https://apps.apple.com/app/fieldbill/id6762166246
- Public URL check: HTTP `200`, resolved to `https://apps.apple.com/us/app/fieldbill/id6762166246`, title `FieldBill App - App Store`

The `1.0.0 (6)` binary was built after Apple's microphone-purpose-string rejection. Live App Store Connect work on 2026-05-20 attached build `1.0.0 (6)` to iOS version `1.0`, updated the App Review notes with the explicit optional microphone/job talk-note explanation, and resubmitted the app. Apple approval arrived by Gmail on 2026-05-21: FieldBill iOS has been approved for distribution, and submission `cf9b172e-3c31-4d83-ad77-1b67d8f9e570` is complete and eligible for distribution.

The external group `ReliableQA iOS` currently shows `0 Testers` and `1 Build`. A public TestFlight link was created for the group:

```text
https://testflight.apple.com/join/dYdE2Gcw
```

App Store Connect previously warned that testers cannot join the public link until the group has an approved build. The Apple review blocker is now resolved, but recheck the link before sending paid iOS testers to it.

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
- The current working tree was clean before this document refresh.

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

## Historical Build 5 Notes

Build `1.0.0 (5)` was the original production/TestFlight submission and was rejected under Guideline `5.1.1(ii)` because the microphone purpose string was not specific enough. Build `1.0.0 (6)` is the replacement build with the corrected `NSMicrophoneUsageDescription`.

## Next Manual Steps

1. Run an iPhone smoke test from the public App Store page or TestFlight.
2. Verify App Store Connect Agreements, Tax, and Banking if install, pricing, or availability does not behave as expected.
3. Recheck public link `https://testflight.apple.com/join/dYdE2Gcw` before sending it to paid iOS testers.
4. If Apple asks for export compliance, keep the declaration aligned with `ITSAppUsesNonExemptEncryption=false`.
5. Smoke test on a real iPhone through TestFlight.
6. If ReliableQA has not replied, use TestFi as the alternate iOS tester route. Live pricing checked 2026-05-09: `$1.99` per written-feedback tester or `$3.99` per video-feedback tester; campaigns say they fill in 24-48h and support iOS TestFlight.

## iPhone Smoke Checklist

1. Install build `1.0.0 (6)` from TestFlight.
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
