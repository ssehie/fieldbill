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

## 2026-05-08 20:02 AgentArch devphone workflow QA

- Ran tester-release checks again before runtime QA: `npm run check:tester-release` passed, including TypeScript, lint, Expo Doctor 17/17, and tester preflight. Remaining warnings were local EAS versioning, no local `.env`, and dirty tree from build artifacts.
- Reset FieldBill app data on devphone `ZT4228M83L`, launched the installed EAS-signed Android `versionCode` 7 APK, and completed the first-run onboarding flow.
- Onboarding passed through business setup, invoice defaults, review, and `CREATE FIRST INVOICE`.
- Start Job passed with customer `QA Customer`, address `500 Market St`, hourly rate `125`, and created an active job.
- Active Job passed: live elapsed timer rendered, labor total updated, `ADD PART` opened, and a quick-add `GFCI` part saved. The adb keyboard entered quantity `22` while testing, so the resulting `$550.00` parts amount was a test input artifact.
- Stop Job and Review Invoice passed: labor, parts, and audio-note summary rendered, and `OPEN INVOICE` created invoice `FB-1001`.
- Invoice status passed: `Mark as Sent` moved the invoice to sent/history, and `Mark as Paid` cleared awaiting payment/open balance on Home.
- Invoice History passed: showed one invoice card for `FB-1001`, customer `QA Customer`, date `May 8, 2026`, total `$562.50`, and status `SENT`; tapping the card reopened the invoice.
- Customer dedupe / dropdown passed: starting a second job showed one `USE LAST CUSTOMER` card and filled name, address, and rate without repeating the same customer in multiple sections.
- Relaunch/persistence passed: active job survived relaunch during the test, then home totals updated after sent/paid status changes.
- Talk Note reached the Android `Allow FieldBill to record audio?` permission dialog. adb could not accept the secure permission prompt in this session, so recording/saving audio remains unverified on-device.
- Runtime log check found FieldBill QA logs for invoice persistence/save and route focus, with no `FATAL EXCEPTION` or `ReactNativeJS` crash found in the checked tail.
- QA caveat: the business email/address on invoice rendered as `qa%40fieldbill.test4123 Main St` because adb text-entry/focus combined the setup email and address fields during onboarding. Retest manually or with a cleaner input harness before treating this as a user-facing data bug.

## 2026-05-08 21:07 AgentArch iOS TestFlight submit attempt

- User could not find an iOS run option in TestMyApps, so moved to the iOS TestFlight path for external paid testers.
- Verified current FieldBill iOS config: app version `1.0.0`, iOS build number `5`, bundle id `com.fieldbill.app`, ASC app id `6762166246`.
- Verified latest EAS iOS production build exists and is finished: build `17ee3fd2-41d0-402c-a54b-f897d3bd1cf4`, artifact `https://expo.dev/artifacts/eas/3XoPFBKKCcTVzkcLeYKSeA.ipa`, local IPA `builds/FieldBill-1.0.0-ios-build5-store.ipa`.
- Ran `npx eas-cli submit -p ios --profile production --latest --non-interactive`; EAS found the App Store Connect API key `[Expo] EAS Submit 6AJs6IHeJn` / key id `9TQ9HPKA6U` and scheduled submission `6a740efc-905c-4b68-b033-e18d8ba88f43`, but the submit failed during Apple upload.
- Retried the same build with explicit id and verbose flags; EAS scheduled submission `d281b7ba-6d5e-4be8-96cc-abb7121e90bf`, but CLI still only returned `Something went wrong when submitting your app to Apple App Store Connect` without the underlying Apple error.
- Scheduled one more no-wait submission for server-side log inspection: `5489c26f-46e5-4bb8-bfb9-3eb11e9cea9a`.
- Opened Expo submission logs and App Store Connect TestFlight pages in Edge. Browser state: App Store Connect is at Apple ID login with `authResult=FAILED`, so login is required to inspect TestFlight/App Store Connect directly.
- Tried `npx eas-cli@latest submit ...`; this failed locally before starting because the npx cache was missing `tinyglobby`. This is a local npm cache issue and separate from the Apple upload failure.
- Current blocker: need the detailed Apple/EAS submission log from the opened Expo submission page or App Store Connect login to identify why Apple rejected the upload. No Apple card/payment prompt was reached.

## 2026-05-08 21:52 AgentArch iOS external TestFlight setup

- User logged into App Store Connect in Edge.
- Confirmed iOS build `1.0.0 (5)` already exists in TestFlight, which explains why EAS submit could schedule but Apple upload did not need to create a new build.
- Added/saved TestFlight build notes for build `1.0.0 (5)`:
  `Test FieldBill job-to-invoice workflow: complete onboarding, start a job, reuse or enter customer info, add parts/materials, stop the job, open the invoice, mark it sent/paid, and verify invoice history. Please watch for duplicate customer entries, confusing customer dropdown behavior, crashes, layout issues, and any audio note or permission problems.`
- Created App Store Connect external tester group `ReliableQA iOS`.
- Attached FieldBill iOS build `1.0.0 (5)` to `ReliableQA iOS` and submitted it for Apple Beta App Review.
- Current App Store Connect state after submission: external group `ReliableQA iOS`, `0 Testers`, `1 Build`; build `1.0.0 (5)` status `Waiting for Review`, platform `iOS`, expires in 90 days.
- Apple Beta App Review information entered: app description for FieldBill, feedback email `ssehie@gmail.com`, contact name `Steven Sehie`, contact phone `3163238649`, contact email `ssehie@gmail.com`, no sign-in required.
- ReliableQA site did not expose a direct checkout/order form. Sent email to `contact.reliableqa@gmail.com` requesting iOS TestFlight testing for FieldBill and asking for payment link/process, tester emails/TestFlight setup instructions, expected start time, and reporting format. Gmail sent message id `19e0aa6973f2247e`.
- Cost note: no new card/payment prompt was reached in this step. Expected ReliableQA iOS cost from prior pricing snapshot was `$22`, but the actual payment link/process is pending ReliableQA's response.

## 2026-05-09 morning console/email check

- Updated Codex before checking releases: active CLI is now `codex-cli 0.131.0-alpha.4`. npm showed stable `latest=0.130.0` and `alpha=0.131.0-alpha.4`; install completed with a Windows cleanup warning for an old locked Codex binary folder, but the active CLI verifies correctly.
- Gmail received TestMyApps/Clyrolabs message `FieldBill - TestMyApps Testing in Progress` at 2026-05-09 04:12 local. They say FieldBill Android testing has started, testers will be assigned within 6 hours, and they will provide bugs/improvement suggestions for Google Play production requirements.
- TestMyApps asked for about 3 small release updates during the testing period to show active maintenance before production-access application.
- TestMyApps asked to join Google Group `testmyappshub` and add `testmyappshub@googlegroups.com` to Play Console. Joined the group in browser with subscription set to `No email` to avoid group spam.
- Play Console browser check: account `ssehie`, 2 apps visible. FieldBill shows app status `Closed testing`, installed audience `2`, last updated `May 8, 2026`. Play Console notification panel shows a May 8 message: `App update published. Users should see changes immediately but may take longer.`
- App Store Connect browser check for FieldBill TestFlight: build `1.0.0 (5)` is still `Waiting for Review`, expires in 90 days, attached to internal `Team (Expo)` and external `ReliableQA iOS`; build row shows 1 invite and no installs/sessions yet for build 5.
- Gmail search found no ReliableQA reply yet beyond the sent request to `contact.reliableqa@gmail.com`.
- Next action: add `testmyappshub@googlegroups.com` to the FieldBill Play Console closed-testing Alpha tester access and submit/save the Play change. Then keep watching for Apple Beta App Review approval and ReliableQA's iOS payment/setup reply.

## 2026-05-09 tester access follow-through

- Followed TestMyApps/Clyrolabs instructions from email `FieldBill - TestMyApps Testing in Progress`.
- Joined Google Group `testmyappshub` with subscription set to `No email`.
- Opened FieldBill Play Console `Closed testing - Alpha` track and confirmed Google Groups access already included `testmyappscommunity@googlegroups.com`.
- Added `testmyappshub@googlegroups.com`, saved the tester-access change, and sent `1 change for review` from Publishing overview.
- Play Console state after send: `Changes in review`, item `Closed testing - Alpha`, description `Add 1 Google Group: testmyappshub@googlegroups.com`.
- Replied to Clyrolabs/TestMyApps confirming the group join, Play Console group addition, and review submission. Gmail sent message id `19e0bf29c0c15539`.
- Clyrolabs/TestMyApps iOS reply said iOS testing is paused because of device availability. Their Android testing run remains the active TestMyApps path.
- App Store Connect iOS status check: external group `ReliableQA iOS` still has `0 Testers` and `1 Build`; build `1.0.0 (5)` remains `Waiting for Review`, with 1 invite and no installs/sessions.
- Created the public TestFlight link for `ReliableQA iOS`: `https://testflight.apple.com/join/dYdE2Gcw`. App Store Connect warns testers cannot join the public link until the group has an approved build.
- Alternate iOS tester option checked live: TestFi supports iOS TestFlight campaigns, says campaigns fill in 24-48h, and lists pricing at `$1.99` per written-feedback tester or `$3.99` per video-feedback tester with no subscription/minimum. Do not launch TestFi until Apple Beta App Review approves build `1.0.0 (5)`, because the public TestFlight link is not joinable yet.
- Cost note: no new payment/card prompt was reached. Potential TestFi cost starts at `$1.99/tester` after the free/start flow, depending on campaign setup.

## 2026-05-09 active-maintenance update 1

- Implemented the first small active-maintenance update requested by TestMyApps/Clyrolabs: improved Talk Note microphone-denied handling.
- Changed `app/talk-note.tsx` so denied microphone permission now shows a clear in-app permission card, explains that FieldBill can continue without audio, and provides an `OPEN SETTINGS` action through `Linking.openSettings()`.
- Bumped Android `versionCode` through EAS local versioning. `app.json` now records Android `versionCode` `9`.
- Verification: `npm run check:tester-release` passed. Expo Doctor passed 17/17. Expected warnings remain: local EAS versioning, no local `.env`, and dirty working tree.
- Built Play-ready Android AAB with `npx eas-cli build -p android --profile production --non-interactive --wait --json`.
- Build finished: EAS build `5b42da7f-6d95-47fc-be03-f93379164faa`, app version `1.0.0`, Android versionCode `9`, artifact `https://expo.dev/artifacts/eas/cgBYF5GDYbi1kX4T3uMpjj.aab`.
- Downloaded artifact to `builds/FieldBill-1.0.0-android-v9-play.aab`.
- Tried non-UI submit with `npx eas-cli submit -p android --path builds\FieldBill-1.0.0-android-v9-play.aab --non-interactive`; still blocked because Google service-account keys are not configured for non-interactive submit.
- Browser upload blocker: Edge/desktop capture went black while Edge was still running, so the Play Console upload was not completed from UI in this pass.
- Release notes ready for Play Console closed testing:
  `Improved Talk Note microphone-permission handling. If microphone access is denied, FieldBill now shows a clearer recovery path, lets the tech continue without audio, and offers an Open Settings action.`
- Cost note: EAS build may consume Expo/EAS build credits/minutes depending on account plan. No direct dollar charge or card prompt was shown.

## 2026-05-09 active-maintenance update 1 Play upload

- Retried the Play Console upload in the user's Edge session.
- Uploaded/attached `builds/FieldBill-1.0.0-android-v9-play.aab` to FieldBill `Closed testing - Alpha`.
- Release details accepted for version `9 (1.0.0)` with release notes:
  `Improved Talk Note microphone-permission handling. If microphone access is denied, FieldBill now shows a clearer recovery path, lets the tech continue without audio, and offers an Open Settings action.`
- Play Console review step showed 1 warning and no device support changes. The warning was non-blocking; release was saved.
- Sent `1 change for review` from Publishing overview. Current Play Console state after submission: `Changes in review`, item `Closed testing - Alpha`, version `9 (1.0.0)`, description `Start full rollout`.
- Google Play quick checks were still running at submission time, with Play saying the changes will be sent for review as soon as checks complete successfully.
- Cost note: no new payment/card prompt was reached during Play Console upload/submission.

## 2026-05-09 next release/tester checks

- Next Android check: verify Google Play quick checks/review finished for closed-testing version `9 (1.0.0)`.
- Next TestMyApps/Clyrolabs check: monitor Gmail for tester assignment/results and check Play installed audience/tester activity.
- Next iOS check: wait for Apple Beta App Review approval on TestFlight build `1.0.0 (5)` before sending testers to the public link.
- If ReliableQA replies after Apple approval, send/use the public TestFlight link `https://testflight.apple.com/join/dYdE2Gcw`; otherwise TestFi remains the fallback iOS tester option.
- Prepare active-maintenance update 2 after v9 clears review or when TestMyApps feedback arrives. Candidate: small invoice/history polish or clearer customer dropdown wording, then Android `versionCode` `10`.
- Cost note: TestFi iOS fallback starts at `$1.99/tester` for written feedback or `$3.99/tester` for video feedback. No new cost was incurred by this logging step.


## 2026-05-03 13:18 AgentArch note

- Added shsehie@gmail.com to FieldBill local tester trackers: docs/friend-tester-email-list.csv and docs/play-tester-emails.csv. Still needs Play Console tester-list update if not already added there.

## 2026-05-03 13:25 AgentArch note

- Sent FieldBill Google Play internal test link to shsehie@gmail.com via Gmail: https://play.google.com/apps/internaltest/4700383710080203480
