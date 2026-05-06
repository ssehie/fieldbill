# FieldBill

FieldBill is a pilot Expo app for small field-service invoicing on a phone. The current flow is:

- start a job
- add parts
- record one audio note per job
- finish the job
- review the invoice
- open a Gmail draft to yourself with the invoice details and audio attachment
- mark the invoice sent or paid
- review status in History

## Stack

- Expo Router
- React Native
- Expo SQLite
- Expo Audio
- Expo Mail Composer
- RevenueCat (`react-native-purchases`)

## Local Development

```bash
npm install
npx expo start
```

Use Expo Go on Android for local development. Production Android builds go through EAS.
To enable address autocomplete, create a local `.env` file with `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` set to a Google Places API key.

To test Pro purchases, use a development build or store build. Expo Go does not support real native purchase flows.
Copy `.env.example` into a local `.env` and set:

- `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`
- optional for dev/test store: `EXPO_PUBLIC_REVENUECAT_APPLE_TEST_API_KEY`, `EXPO_PUBLIC_REVENUECAT_GOOGLE_TEST_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID`
- `EXPO_PUBLIC_REVENUECAT_OFFERING_ID`
- optionally `EXPO_PUBLIC_REVENUECAT_PACKAGE_ID`

## Pilot Notes

- Notes are audio-only in this pass.
- Billing data is stored locally in SQLite.
- Emailing currently opens a Gmail draft to the business email on the device.
- Monetization is `3` free invoices, then a one-time Pro unlock for unlimited invoices.

## Tester Release

Run the no-build preflight before cutting a tester APK:

```bash
npm run check:tester-release
```

Tester build checklist:

- [docs/tester-release-checklist.md](/C:/fieldbill/docs/tester-release-checklist.md)
- [docs/android-internal-build.md](/C:/fieldbill/docs/android-internal-build.md)
