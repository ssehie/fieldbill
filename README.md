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

## Local Development

```bash
npm install
npx expo start
```

Use Expo Go on Android for local development. Production Android builds go through EAS.
To enable address autocomplete, create a local `.env` file with `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` set to a Google Places API key.

## Pilot Notes

- Notes are audio-only in this pass.
- Billing data is stored locally in SQLite.
- Emailing currently opens a Gmail draft to the business email on the device.
