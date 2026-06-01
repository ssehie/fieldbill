# Tester Release Checklist

Use this before spending a build credit.

## 1. Run the no-build checks

```powershell
npm run check:tester-release
```

What this covers:

- TypeScript compile
- lint
- Expo doctor
- native version baseline in [app.json](/C:/fieldbill/app.json)
- tester/store EAS profile shape in [eas.json](/C:/fieldbill/eas.json)
- `react-native-purchases` dependency
- local `.env` hints
- dirty working tree warning

## 2. Decide what kind of tester build you need

For a plain functional Android tester build:

- no RevenueCat setup is required
- FieldBill will fail open if purchases are unavailable
- testers can still onboard, create invoices, save, reopen, and share

For purchase testing:

- configure RevenueCat entitlement `pro`
- configure offering `default`
- configure the one-time product
- set the public SDK keys in EAS for the environment used by the build

## 3. Build the tester APK

```powershell
npx eas-cli build -p android --profile internal
```

That profile is configured to:

- produce an installable APK
- use internal distribution
- auto-increment native build numbers

## 4. After the build finishes

1. Open the EAS build link.
2. Download the APK or share the link directly.
3. If [app.json](/C:/fieldbill/app.json) was bumped by EAS, commit that version change before the next build.

## 5. Smoke test on device

Minimum tester pass:

1. Fresh install opens onboarding.
2. Complete onboarding.
3. Create and save an invoice.
4. Close and reopen the app.
5. Confirm the invoice is still there.
6. Open share/export once.

Purchase test pass, if billing is configured:

1. Create invoices until invoice `4`.
2. Confirm the app routes to Pro only when a purchasable package is loaded.
3. Complete unlock or restore.
4. Confirm invoice creation continues.

## Notes

- FieldBill currently uses local EAS app versioning. That is intentional because the remote EAS counters are behind the already-uploaded store builds.
- The release rule is simple: after any EAS tester or store build, commit the updated [app.json](/C:/fieldbill/app.json).
- Current iOS/TestFlight status is tracked in [ios-testflight-status.md](/C:/fieldbill/docs/ios-testflight-status.md).
- Android billing harness is green as of 2026-05-25. Future Android purchase retests should use the dev-account Play Store install path and verify a Google test instrument before buying.
- Do not repurchase the Android non-consumable for a clean test without first refunding/revoking the prior test order in Play Console or switching to a fresh tester account.
- iOS billing is the next open harness lane. App Store Connect IAP `fieldbill_pro_lifetime` is `Ready to Submit`, but do not mark iOS green until the IAP is submitted through the app-version review path, RevenueCat Apple wiring is complete, sandbox purchase passes, and restore passes.
- iOS RevenueCat Apple wiring is complete as of 2026-05-26: EAS has the Apple public SDK key, entitlement `pro` has the App Store product, and offering `default` includes it. Remaining iOS gates are the new iOS build, sandbox purchase, restore, and user-approved App Review/IAP submission path.
- iOS monetization build `1.0.1 (8)` was uploaded to App Store Connect/TestFlight as EAS build `41fe864d-a2c7-4d69-97a6-cfe338250277`. Use this build for the iOS sandbox purchase/restore harness after Apple processing finishes.
- iOS Sandbox Apple Account `ssehie+fieldbill-ios-sandbox-20260526-062600@gmail.com` was created in App Store Connect. Use it for the iPhone purchase flow; do not use a production Apple ID or real card for the harness pass.
- App Store Connect TestFlight shows build `1.0.1 (8)` attached to internal group `Team (Expo)`. External `Add Group` / beta review was not clicked.
