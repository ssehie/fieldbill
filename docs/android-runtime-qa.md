# Android Runtime QA

## Prerequisites

- Install the APK on a physical Android device.
- Enable USB debugging if you want log capture.
- Sign in to a mail app on the device before testing invoice export.

## Optional debug logging

QA logs are enabled in Android dev builds.

```powershell
adb logcat | Select-String "FieldBill QA"
```

## Manual test plan

1. Fresh install
   Expected: launching the app opens onboarding instead of the home screen.

2. Onboarding validation
   Leave `Business Name` blank and verify `Next` stays disabled.
   Enter an invalid phone and verify `Next` stays disabled.
   Enter a valid business name and phone and continue.

3. Onboarding completion
   Complete all steps and tap `Create First Invoice`.
   Expected: app routes straight into the first-job / first-invoice flow.

4. Kill and relaunch
   Fully close the app from Android app switcher and reopen it.
   Expected: onboarding is skipped and saved business defaults remain present.

5. Start job flow
   Start a job, add at least one part, stop the job, and open the invoice review screen.
   Expected: no dead buttons, no navigation loops, and the back button returns to the previous screen.

6. Invoice freeze test
   Create an invoice and note its total.
   Change onboarding defaults in the SQLite `settings` table or through future settings tooling.
   Reopen the original invoice.
   Expected: total, subtotal, labor total, parts subtotal, and tax amount match the saved invoice.

7. Intentional invoice edit
   Edit labor hours, rate, discount, or tax percent on the reopened invoice.
   Expected: totals update only from the edited values and remain stable after leaving and reopening the invoice.

8. App switch and resume
   Open an in-progress screen, send the app to background, then return.
   Expected: screen state is preserved.

9. Sleep and wake
   Put the device to sleep while the app is open, then wake it.
   Expected: app returns to the same screen without looping to onboarding.

10. Android back behavior
    Test the hardware back button on onboarding, start job, active job, finish job, send last bill, and history.
    Expected: onboarding steps move backward sensibly; other screens return through the stack without trapping the user.

11. Invoice export
    On `Send Last Bill`, tap `Email to Me`.
    Expected: Android mail compose opens with the invoice subject/body and attachment when audio exists.

12. Data persistence
    Reopen the app after invoice creation and after invoice editing.
    Expected: invoices, history, onboarding completion, and business defaults persist.
