# FieldBill App Store Production Submission

Last updated: 2026-05-10

## Current State

- App Store Connect app id: `6762166246`
- Bundle id: `com.fieldbill.app`
- App version: `1.0.0`
- iOS build: `1.0.0 (5)`
- EAS build id: `17ee3fd2-41d0-402c-a54b-f897d3bd1cf4`
- Local IPA: `C:\fieldbill\builds\FieldBill-1.0.0-ios-build5-store.ipa`
- TestFlight public link: `https://testflight.apple.com/join/dYdE2Gcw`
- Privacy policy URL: `https://ssehie.github.io/fieldbill/privacy-policy/`

`npm run check:tester-release` passed on 2026-05-10. Current warnings are local EAS versioning, no local `.env`, and an untracked handoff file.

## Store Listing

### Subtitle

Mobile invoices for field work

### Promotional Text

Start jobs, track labor and parts, review invoices, and send clean billing details from the field.

### Description

FieldBill helps independent contractors and field service workers create clear invoices from the job site.

Use FieldBill to start and finish jobs, save customer and job address details, track labor time, add parts and materials, review totals, and open an email draft when an invoice is ready.

FieldBill supports a focused service-work workflow: active jobs, invoice review, hourly rates, parts, discounts, tax, payment terms, sent and paid status, business profile details, optional internal audio notes, and optional location-assisted address entry.

FieldBill does not require an account and is designed to keep most job and invoice data local to your device. Optional features may use device or third-party services only when you choose them, such as address lookup, calendar events, email drafts, and purchase restoration.

FieldBill is built for small service businesses that need a simple mobile invoice workflow without a complicated back-office system.

### Keywords

invoice,contractor,field service,jobs,labor,parts,billing,estimate,work order

### Support URL

`https://ssehie.github.io/fieldbill/privacy-policy/`

### Marketing URL

Leave blank unless a dedicated marketing page is added.

### Copyright

`2026 Steve Sehie`

## Screenshots

Generated App Store-ready screenshots:

- iPhone 6.7 inch: `C:\fieldbill\assets\store\app-store\iphone-6.7\`
  - `fieldbill-ios-01.png` through `fieldbill-ios-04.png`
  - size: `1290 x 2796`
- iPad Pro 12.9 inch landscape: `C:\fieldbill\assets\store\app-store\ipad-12.9-landscape\`
  - `fieldbill-ipad-01.png` through `fieldbill-ipad-04.png`
  - size: `2732 x 2048`

`app.json` has `ios.supportsTablet = true`, so upload iPad screenshots unless tablet support is intentionally removed in a later build.

## App Review Information

- Sign-in required: No
- Contact first name: `Steven`
- Contact last name: `Sehie`
- Contact email: `ssehie@gmail.com`
- Contact phone: `3163238649`

### Notes

FieldBill does not require an account. Reviewers can start from a fresh install, complete setup with sample business details, start a job, add parts or labor, finish the job, review the invoice, and open the email handoff. Microphone, location, and calendar permissions are optional and are requested only when the related feature is used.

## App Privacy Answers

Use the published privacy policy as the source of truth.

Likely disclosures:

- Contact Info: user-entered business/customer names, phone numbers, email addresses, and addresses. Used for app functionality. Not linked to tracking. Not used for advertising.
- User Content: invoice/job notes and optional audio notes. Used for app functionality. Stored locally unless the user exports/emails it.
- Location: optional approximate/precise location only when the user chooses location-assisted address entry. Used for app functionality.
- Purchases: purchase status and transaction details through Apple App Store/RevenueCat for FieldBill Pro unlock/restore.
- Diagnostics: only if Apple/Expo crash diagnostics are enabled in App Store Connect or the build environment; otherwise do not add app-collected diagnostics.

Tracking: No.

Data sale or third-party advertising: No.

## Pricing And Availability

Production price choice needed before submission:

- If FieldBill should launch free with optional Pro unlock, set app price to free and configure the non-consumable in-app purchase.
- If Pro is not configured/tested yet, do not advertise or submit a broken paid unlock. Either configure/test RevenueCat and the Apple non-consumable first, or hide/defer the paid path in a new build.

## In-App Purchase

Current intended product:

- Product type: non-consumable
- Product id: `fieldbill_pro_lifetime`
- RevenueCat entitlement: `pro`
- RevenueCat offering: `default`

Production blocker to verify:

- Apple non-consumable exists in App Store Connect.
- RevenueCat Apple app/API key is set for EAS production.
- Product is attached to the RevenueCat `pro` entitlement and default offering.
- Sandbox purchase and restore have been tested on iOS.

## Export Compliance

`app.json` has:

```json
"ITSAppUsesNonExemptEncryption": false
```

Use standard encryption/no non-exempt encryption unless the app later adds custom cryptography or restricted encryption features.

## Submission Steps

1. Open App Store Connect app `6762166246`.
2. Open the iOS app version `1.0.0`.
3. Upload screenshots from `assets\store\app-store`.
4. Fill metadata from this file.
5. Complete App Privacy from the privacy section above.
6. Confirm pricing and availability.
7. Resolve the in-app purchase decision.
8. Select build `1.0.0 (5)`.
9. Fill App Review information and notes.
10. Click `Add for Review`, resolve any App Store Connect warnings, then submit to App Review.

## Cost

No direct Apple submission cost if the Apple Developer Program membership is active. Extra EAS iOS builds may cost money because earlier logs showed the Expo account had used 100% of included monthly build credits.
