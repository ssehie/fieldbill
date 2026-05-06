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
