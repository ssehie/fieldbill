# FieldBill Monetization Setup

## Current status - 2026-05-24

- App-side RevenueCat wiring exists and `react-native-purchases` is installed.
- Android Play Console already has one one-time product matching the planned ID: `fieldbill_pro_lifetime`, display name `FieldBill Pro`, with one `lifetime` purchase option visible through signed-in Play Console API data.
- RevenueCat account `ssehie@gmail.com` is verified. Project `fieldbill` (`3fe9596f`) exists.
- RevenueCat Android app `FieldBill Android` is configured for package `com.fieldbill.app`, public SDK key is set in EAS, and app id is `app87ed3fec9b`.
- RevenueCat Android product `fieldbill_pro_lifetime` (`prodbc42966e33`) is attached to entitlement `pro` (`entlcf87fedd47`).
- RevenueCat current offering `default` (`ofrngc5bc65c372`) contains package `$rc_lifetime` (`pkgee66913e7a3`) with the Android product.
- EAS project environments `production` and `preview` now include:
  - `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true`
  - `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`
  - `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID=pro`
  - `EXPO_PUBLIC_REVENUECAT_OFFERING_ID=default`
- `eas.json` explicitly maps `internal` and `release-apk` builds to the EAS `preview` environment and `production` builds to the EAS `production` environment.
- `npx eas-cli config -p android -e production --json` and `npx eas-cli config -p android -e internal --json` confirm EAS loads the RevenueCat variables from those environments.
- Google Cloud service account `RevenueCat Service Account` was created in project `api-project-294089098252`.
- Play Console service-account user `revenuecat-service-account@api-project-294089098252.iam.gserviceaccount.com` is active for FieldBill with app-info read, app-quality read, financial-data, and orders/subscriptions permissions.
- RevenueCat Google Play credentials are uploaded and protected: app credentials show `RC__PROTECTED` with service-account key details for project `api-project-294089098252`.
- Google Cloud Pub/Sub API and Google Play Android Developer API are enabled.
- RevenueCat Google developer notifications are connected with `pub_sub_enabled: true` and topic `projects/api-project-294089098252/topics/Play-Store-Notifications`.
- The local temporary Google service-account JSON key was deleted after upload and Pub/Sub connection.
- App Store Connect is not signed in on this machine. Apple redirects to login with `authResult=FAILED`, so the iOS non-consumable cannot be verified or created until Apple sign-in/2FA is completed.
- Android native purchase readiness was fixed: `com.android.vending.BILLING` is declared and `MainActivity` now uses `singleTop`, which is purchase-safe for payment-app handoffs.
- `npm run check:tester-release` passes. Remaining expected warnings are local EAS versioning, no local `.env`, and the current dirty working tree.
- EAS Android production AAB build `105dd818-2f05-4590-88d8-d814dddf07f4` finished with build profile `production`, app version `1.0.0`, and versionCode `11`. AAB artifact: `https://expo.dev/artifacts/eas/32dGg22nwp47cKEcovmWij.aab`. Logs: `https://expo.dev/accounts/ssehie/projects/fieldbill/builds/105dd818-2f05-4590-88d8-d814dddf07f4`.
- Local AAB: `C:\fieldbill\builds\FieldBill-1.0.0-android-v11-play.aab`; SHA256 `BEE42DE16A2C7C722ED4B9A0A74EACBC6AB18B791F0F3C876A043356D6518AE7`.
- Play Console `Closed testing - Alpha` has version `11 (1.0.0)` uploaded and saved in Publishing overview as `1` change not yet sent for review.
- Play Console preview warning is non-blocking: no deobfuscation file is associated with version code `11`.
- Play Console quick checks completed and no blocking issue appeared.
- The remaining Play Console action is `Send 1 change for review`; do not click it without explicit user confirmation.

FieldBill uses a simple purchase model:

- first `3` invoices are free
- one-time Pro unlock after that
- no subscription

## Product Setup

Use one entitlement in RevenueCat:

- entitlement id: `pro`

Use one non-renewing product per store:

- Apple App Store: non-consumable
- Google Play: one-time product

Recommended product id on both stores:

- `fieldbill_pro_lifetime`

Attach that product to the `pro` entitlement and place it in a current offering, for example:

- offering id: `default`
- package: RevenueCat lifetime package, or a single custom package

RevenueCat Android setup completed:

1. Project: `fieldbill` / `3fe9596f`.
2. Android app: `FieldBill Android` / `app87ed3fec9b` / `com.fieldbill.app`.
3. Product: `fieldbill_pro_lifetime` / `prodbc42966e33` / non-consumable.
4. Entitlement: `pro` / `entlcf87fedd47`.
5. Offering: `default` / `ofrngc5bc65c372`.
6. Package: `$rc_lifetime` / `pkgee66913e7a3`.
7. EAS `production` and `preview` variables are set for Android monetization.

Remaining Android launch work:

1. Wait for Google/RevenueCat propagation if RevenueCat store status is not green immediately.
2. With explicit user confirmation, send the queued `Closed testing - Alpha` v11 change for Google review.
3. After v11 is installable through Play testing, run an Android sandbox purchase and restore test against `fieldbill_pro_lifetime`.
4. Do not start a paid production rollout until sandbox purchase/restore passes and Google production access is approved.
5. Complete iOS App Store Connect IAP setup separately after Apple sign-in/2FA.

## Environment Variables

Monetization is off by default. Enable it only after the store products and RevenueCat wiring are ready:

- `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true`

Set these before building:

- `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID=pro`
- `EXPO_PUBLIC_REVENUECAT_OFFERING_ID=default`

Set these in EAS once RevenueCat keys exist:

```powershell
npx eas-cli env:create --environment production --name EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED --value true --visibility plaintext --force
npx eas-cli env:create --environment production --name EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY --value <apple_public_sdk_key> --visibility plaintext --force
npx eas-cli env:create --environment production --name EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY --value <google_public_sdk_key> --visibility plaintext --force
npx eas-cli env:create --environment production --name EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID --value pro --visibility plaintext --force
npx eas-cli env:create --environment production --name EXPO_PUBLIC_REVENUECAT_OFFERING_ID --value default --visibility plaintext --force
```

Do not use private RevenueCat REST API keys in Expo public variables. Only use the app-specific public SDK keys.

Recommended for development and tester builds:

- `EXPO_PUBLIC_REVENUECAT_APPLE_TEST_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_GOOGLE_TEST_API_KEY`

Optional:

- `EXPO_PUBLIC_REVENUECAT_PACKAGE_ID`

Use `EXPO_PUBLIC_REVENUECAT_PACKAGE_ID` only if you want to force a specific package inside the offering. If omitted, FieldBill prefers the lifetime package automatically.

## Testing

RevenueCat purchase testing requires a native build. Expo Go is not enough for real purchases.

FieldBill prefers the test-store keys in `__DEV__` when they are provided, and falls back to the platform public SDK keys otherwise. For release builds, use only the real platform public SDK keys.

Do not ship a paid Android production rollout until RevenueCat/Google propagation is green, sandbox purchase/restore passes, and Google production access is approved. The EAS `production` variables are already set so the next production AAB will include the Android purchase path.

Recommended flow:

1. Configure the RevenueCat project, products, entitlement, and offering.
2. Add the env vars locally and in EAS.
3. Build a development client or preview build. The currently installed tester binaries do not include `react-native-purchases` until a new native build is installed.
4. Test purchase and restore on each store sandbox account.
5. Verify that invoice `4` routes to the upgrade screen.
6. Complete the unlock and confirm invoice creation continues normally.
7. Reinstall the app and confirm `Restore Purchase` re-enables Pro.

For iOS, the first in-app purchase must be submitted with a new app version. Create the non-consumable in App Store Connect, add metadata/review screenshot, then attach the IAP to the next iOS version before submitting to App Review.

## EAS Notes

For EAS environments, set the same RevenueCat keys in the environment used by your build profile.

Examples:

- Android preview / tester build: `npx eas-cli build -p android --profile internal`
- Android Play build: `npx eas-cli build -p android --profile production`
- iOS TestFlight build: `npx eas-cli build -p ios --profile production`

Current profile-to-environment map:

- `development` -> `development`
- `internal` -> `preview`
- `release-apk` -> `preview`
- `production` -> `production`

The app fails open when monetization is disabled or RevenueCat is unavailable, so early testers and store reviewers are not blocked from creating invoices.

## Current App Behavior

- Home shows remaining free invoices.
- Monetization is hidden unless `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true` and a purchasable package is loaded.
- After `3` invoices, the app routes to `FieldBill Pro` only when monetization is enabled and a purchasable package is loaded.
- If monetization is disabled, RevenueCat is missing, offline, or misconfigured, FieldBill fails open so testers can keep creating invoices.
- Active jobs are not deleted when the user hits the limit.
- Old invoices remain viewable whether or not Pro is unlocked.
- Restore flow is available from the upgrade screen.
