# Next Codex Startup - fieldbill

## Last Action

Updated: 2026-05-15T18:35:32

Exit checkpoint: TestMyApps/Clyrolabs Android feedback was patched, Android v10 was submitted to Google Play `Closed testing - Alpha`, and Play Console now shows the v10 change in review.

Changes implemented:
- simplified onboarding/start-job address entry by removing the confusing manual/search toggle;
- added bottom-safe Start Job footer spacing;
- added edit/delete flow for active-job parts;
- compacted final invoice Email/Mark Sent/Mark Paid actions;
- added in-app Privacy Policy and Terms links;
- added hosted Terms docs at `docs\terms\`.

Build:
- Android versionCode: `10`
- EAS build: `2aa2a809-d9ae-4d84-951e-adcf844620f1`
- EAS artifact: `https://expo.dev/artifacts/eas/6gmMhdrGFzybYN7xFBiGS6.aab`
- Local AAB: `C:\fieldbill\builds\FieldBill-1.0.0-android-v10-play.aab`
- Final verification: `npm run check:tester-release` passed after the build and again after the TestMyApps terms/email check with expected warnings for local EAS versioning, no local `.env`, and dirty working tree.

Play submission:
- Uploaded/attached app bundle `10 (1.0.0)` to `Closed testing - Alpha`.
- Corrected the first duplicate upload by using Play Console `Add from library` after Play had consumed versionCode `10`.
- Saved the release, then sent `1` change for Google review from Publishing overview.
- Final checked Play Console state: `Changes in review`; item `Closed testing - Alpha`, `10 (1.0.0)`, `Start full rollout`.
- Managed publishing is off, so the Alpha update should publish automatically after Google approval.

TestMyApps/Clyrolabs contract state:
- Public TestMyApps pages currently describe build/access handoff through Play Console testing link, APK, or TestFlight invite, managed tester coordination, and feedback/reporting.
- Their terms say they do not guarantee app-store approval or bug-free results, and that we grant permission to share the app with testers for testing purposes.
- FieldBill's submitted TestMyApps run is Android / Play Store delivery, so the correct tester path is Play Console `Closed testing - Alpha`; do not send the raw AAB as the tester-facing route unless Clyrolabs/TestMyApps explicitly asks for it.
- Gmail check found no new inbound Clyrolabs/TestMyApps response after Steve's sent reply `19e2da0f494fe34c`.

Next startup: check Play Console/Gmail for v10 approval or `App update published`. Do not tell Clyrolabs/TestMyApps testers can update until v10 is approved/available.

Paid/pro scaffold: RevenueCat/pro code exists, but monetization is off by default unless `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true` is set. No local `.env` exists, so this review/tester build fails open and should not block invoice creation behind an unfinished paid unlock.

Apple iOS still needs direct App Store Connect review-page inspection for submission `cf9b172e-3c31-4d83-ad77-1b67d8f9e570`; the Gmail body still does not include the exact rejection issue.

Check on next startup:
- Open this handoff: `C:\fieldbill\NEXT-CODEX-STARTUP.md`
- Verify the last action still matches live state before continuing.

