# Project Notes

## 2026-05-08 16:33 AgentArch tester-readiness review

- Reviewed FieldBill before tester handoff with focus on Start Job customer selection and saved-customer duplication.
- Changed `app/start-job.tsx` so recent/saved customer choices live behind one simple customer dropdown, and the same customer is not repeated in Last Customer, Recent, and Saved sections.
- Changed `lib/fieldbill-db.ts` customer matching to normalize whitespace/case and dedupe saved/recent customer lists by normalized name plus address before display.
- Aligned Expo SDK 54 patch dependencies and reran `npm audit fix`; high `@xmldom/xmldom` audit issue was removed.
- Verification: `npm run check:tester-release` passed. Remaining warnings: local EAS versioning requires committing bumped `app.json` after builds, no local `.env` for purchase testing, and working tree has uncommitted changes.
- Remaining audit note: `npm audit --omit=dev` reports moderate PostCSS findings through Expo tooling; npm's suggested `--force` fix would downgrade Expo to 49, so it was not applied before tester release.

## 2026-05-08 17:05 AgentArch Android tester release build

- Removed `vtoolshed@hotmail.com` / V Tool Shed from active tester files: `docs/friend-tester-email-list.csv` and `docs/play-tester-emails.csv`.
- Ran `npm run check:tester-release`; passed with expected warnings for local EAS versioning, no local `.env`, and dirty working tree.
- Built Play-ready Android AAB with `npx eas-cli build -p android --profile production --non-interactive`.
- Build finished: EAS build `87de6b04-efcb-43f4-a0f4-f362601dd179`, app version `1.0.0`, Android `versionCode` `6`.
- Downloaded artifact to `builds/FieldBill-1.0.0-android-v6-play.aab`; EAS artifact URL: `https://expo.dev/artifacts/eas/hM742MrZZXx3bTFY6txH3r.aab`.
- Tried `npx eas-cli submit -p android --latest --non-interactive`; blocked because Google Play service-account keys are not configured and EAS cannot set them up in non-interactive mode.
- Cost note: EAS build may consume an Expo/EAS build credit depending on the account plan. No direct dollar charge was shown in the CLI.
- Paid tester cost snapshot looked up live on 2026-05-08: DroidSquad free community / $5 expedited Android; onTest $18 first 12 Android devices, then $2/device; TestMyApps $19 for 12 testers/14 days; ReliableQA $17 Android, $22 iOS, $32 both; My12AppTesters free credits, $8.99 starter, $14.99 pro, $79.99 enterprise; TestFi $1.99 written feedback or $3.99 video per tester for Android/iOS; Beta Family $0 starter, $49/mo Growing, $399/mo Studio; TF Invites is iOS invitation automation, not paid testers, at $6.30/mo Solo, $13.30/mo Starter, $34.30/mo Pro.
- Play Console UI upload completed using the browser on 2026-05-08. Uploaded `builds/FieldBill-1.0.0-android-v6-play.aab` to `Closed testing - Alpha`, release `6 (1.0.0)`.
- Release notes were accepted for `en-US`; the only Play warning was the missing deobfuscation file for version code 6.
- Sent 1 change for Google review from Publishing overview. Current Play Console state shown after submission: `Changes in review`, item `Closed testing - Alpha`, version `6 (1.0.0)`, description `Start full rollout`.
- User chose ReliableQA for both Android and iOS tester coverage. Cost note from live pricing snapshot: Android $17, iOS $22, both $32.
- Ran latest iOS production EAS build: `npx eas-cli build -p ios --profile production --non-interactive`.
- iOS build finished: EAS build `17ee3fd2-41d0-402c-a54b-f897d3bd1cf4`, app version `1.0.0`, iOS build number `5`.
- Downloaded IPA to `builds/FieldBill-1.0.0-ios-build5-store.ipa`; EAS artifact URL: `https://expo.dev/artifacts/eas/3XoPFBKKCcTVzkcLeYKSeA.ipa`.
- EAS bumped `app.json` `expo.ios.buildNumber` from `4` to `5`; commit this with the release changes before the next iOS build.

## 2026-05-08 18:21 AgentArch TestMyApps signup

- User bought TestMyApps credits. Billing page showed Premium purchase `$17.00`, 2 credits purchased, payment succeeded.
- Created/submitted TestMyApps run for FieldBill Android using one credit. TestMyApps state after submit: `Test run submitted. It will enter the queue; SLA timing starts when ops begins testing.`
- TestMyApps run summary: app `FieldBill`, version `1.0.0`, platform `Android`, delivery `Play Store`.
- Test instructions used: no login required; test creating a job, selecting/adding a customer, adding labor/materials, saving the job, reopening the app, and checking saved customer/job data; watch for duplicate customer entries or confusing customer selection.
- Added TestMyApps Google Group `testmyappscommunity@googlegroups.com` to the Play Console `Closed testing - Alpha` tester access. This changed the track from email-list access to Google Groups access.
- Sent the Play Console tester-access change for review. Publishing overview showed `Changes in review`, item `Closed testing - Alpha`, description `Set testers to be managed by Google Groups: testmyappscommunity@googlegroups.com`.
- TestMyApps UI only exposed Android in the new-run platform dropdown, so no iOS/TestFlight run was submitted there. One TestMyApps credit remained visible after the Android run was submitted.

## 2026-05-08 18:47 AgentArch Play tester cleanup

- Removed `vtoolshed@hotmail.com` from the Play Console FieldBill `Internal testing` email list named `email tester`.
- Verified the Play Console internal list count dropped from 8 users to 7 users after saving the email-list change.

## 2026-05-08 19:47 AgentArch devphone install and TestMyApps iOS email check

- Checked Gmail for TestMyApps / Dodo Payments / FieldBill support mail about iOS across the last 30 days; no matching support response was found.
- Devphone `ZT4228M83L` had FieldBill `versionCode` 5 installed before update.
- Java was not available on PATH, so local bundletool conversion of the Play AAB could not be used.
- Built a new EAS Android internal APK for devphone install: build `29eeb3c6-a4f3-4c16-90a9-2bc5079dde9c`, app version `1.0.0`, Android `versionCode` 7, artifact `https://expo.dev/artifacts/eas/6bjM2aF5vwsRSg6Qa8hD2w.apk`.
- Downloaded APK to `builds/FieldBill-1.0.0-android-v7-internal.apk`.
- Initial `adb install -r` failed because the existing devphone app signature did not match the EAS-signed APK. Tried keep-data uninstall first; Android still refused the install.
- Fully uninstalled `com.fieldbill.app` on the devphone, then installed the EAS-signed v7 APK. This cleared FieldBill's local app data on the devphone.
- Verified installed devphone app after update: `versionCode` 7, `versionName` 1.0.0, package launched successfully and returned a running PID.
- Cost note: the EAS internal APK build may consume EAS build minutes/credits depending on the Expo account plan. No direct dollar charge or card prompt was shown.


## 2026-05-03 13:18 AgentArch note

- Added shsehie@gmail.com to FieldBill local tester trackers: docs/friend-tester-email-list.csv and docs/play-tester-emails.csv. Still needs Play Console tester-list update if not already added there.

## 2026-05-03 13:25 AgentArch note

- Sent FieldBill Google Play internal test link to shsehie@gmail.com via Gmail: https://play.google.com/apps/internaltest/4700383710080203480
