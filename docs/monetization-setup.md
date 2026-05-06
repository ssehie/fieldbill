# FieldBill Monetization Setup

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

## Environment Variables

Set these before building:

- `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID=pro`
- `EXPO_PUBLIC_REVENUECAT_OFFERING_ID=default`

Recommended for development and tester builds:

- `EXPO_PUBLIC_REVENUECAT_APPLE_TEST_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_GOOGLE_TEST_API_KEY`

Optional:

- `EXPO_PUBLIC_REVENUECAT_PACKAGE_ID`

Use `EXPO_PUBLIC_REVENUECAT_PACKAGE_ID` only if you want to force a specific package inside the offering. If omitted, FieldBill prefers the lifetime package automatically.

## Testing

RevenueCat purchase testing requires a native build. Expo Go is not enough for real purchases.

FieldBill prefers the test-store keys in `__DEV__` when they are provided, and falls back to the platform public SDK keys otherwise. For release builds, use only the real platform public SDK keys.

Recommended flow:

1. Configure the RevenueCat project, products, entitlement, and offering.
2. Add the env vars locally and in EAS.
3. Build a development client or preview build. The currently installed tester binaries do not include `react-native-purchases` until a new native build is installed.
4. Test purchase and restore on each store sandbox account.
5. Verify that invoice `4` routes to the upgrade screen.
6. Complete the unlock and confirm invoice creation continues normally.
7. Reinstall the app and confirm `Restore Purchase` re-enables Pro.

## EAS Notes

For EAS environments, set the same RevenueCat keys in the environment used by your build profile.

Examples:

- Android preview / tester build: `npx eas-cli build -p android --profile internal`
- Android Play build: `npx eas-cli build -p android --profile production`
- iOS TestFlight build: `npx eas-cli build -p ios --profile production`

The app fails open when RevenueCat is unavailable so early testers are not blocked from creating invoices.

## Current App Behavior

- Home shows remaining free invoices.
- After `3` invoices, the app routes to `FieldBill Pro` only when a purchasable package is loaded.
- If RevenueCat is missing, offline, or misconfigured, FieldBill fails open so testers can keep creating invoices.
- Active jobs are not deleted when the user hits the limit.
- Old invoices remain viewable whether or not Pro is unlocked.
- Restore flow is available from the upgrade screen.
