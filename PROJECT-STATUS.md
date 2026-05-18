# Project Notes

## 2026-05-17 TestMyApps dashboard notification check

- Checked the live TestMyApps dashboard after it showed `4` unread notifications. The notification summary tile did not open a separate drawer when clicked.
- FieldBill run detail still shows `IN TESTING`, `Day 9 of 16`, `16 / 16` active testers, `0` tester submissions, and latest overview update `Testing Clock Started`.
- Visible FieldBill client progress updates include the May 14 Praveen Kumar request to include accessible Privacy Policy and Terms and Conditions links in the app and Play Store listing, plus the older May 9 receipt/assignment update.
- No released FieldBill report is available yet; TestMyApps still says the final report will appear once released.
- Play Console notification checked on 2026-05-17 showed FieldBill app update published on May 15: `App update published. Users should see changes immediately but may take longer.`
- Next action remains verifying Play Console listing legal links and App Store Connect state directly. Android v10 appears published from the Play Console notification, but the store listing legal-link fields still need direct confirmation.
- Cost note: no new direct cost for the dashboard check.

## 2026-05-15 TestMyApps terms/email/build-contract check

- Checked the current public TestMyApps pages for the FieldBill tester obligation:
  - `how-it-works` describes the expected handoff as a Play Console testing link, APK, or TestFlight invite with any tester instructions needed for real-device testing.
  - `terms-and-conditions` says TestMyApps provides tester assignment, feedback, and reporting, but does not guarantee Google Play/App Store approval or bug-free results.
  - Terms also require that we have rights to share the app and allow TestMyApps to share the app with testers for testing purposes.
  - Public pricing now says live package pricing is by quote; the local FieldBill run remains the already-purchased TestMyApps Premium/credit path logged on 2026-05-08.
- Contract stance for this build: FieldBill's submitted TestMyApps run is Android / Play Store delivery, so the correct tester-facing path is Play Console `Closed testing - Alpha`, not a raw AAB handout unless Clyrolabs/TestMyApps explicitly asks for APK/AAB access.
- Current build state is aligned with their feedback and public terms once it is uploaded to Play closed testing: Android `versionCode` `10`, local AAB `builds\FieldBill-1.0.0-android-v10-play.aab`, release notes ready.
- Reran `npm run check:tester-release` after the terms/email check; it passed TypeScript, lint, Expo Doctor `17/17`, and tester preflight. Warnings remain expected for local EAS versioning, no local `.env`, and dirty working tree.
- Gmail check: no new inbound Clyrolabs/TestMyApps response was found after Steve's 2026-05-15 reply `19e2da0f494fe34c`. Latest relevant inbound remains the 2026-05-14 FieldBill progress/feedback request asking for Privacy Policy and Terms links plus regular push releases.
- Next action: upload `builds\FieldBill-1.0.0-android-v10-play.aab` to Google Play `Closed testing - Alpha`, send/save/review the release, then notify Clyrolabs/TestMyApps that testers can update. Do not claim the tester build is live until Play Console shows the new closed-testing release is sent or available.
- Cost: no new direct cost for the web/mail/build-contract check. The prior TestMyApps purchase was already logged at `$17.00`; EAS/Play usage may consume plan credits/minutes, but no new charge prompt was shown.

## 2026-05-15 Android v10 Play submission

- Uploaded/attached Android `versionCode` `10` to Google Play Console `Closed testing - Alpha` using the Play Console browser flow.
- Initial direct upload consumed the v10 bundle in Play's app-bundle library; Play then reported `Version code 10 has already been used`. Corrected by clearing the duplicate errored upload row and using `Add from library` to attach app bundle `10 (1.0.0)` to the draft release.
- Release review page validated before save:
  - New app bundle: `10 (1.0.0)`;
  - Previous release not included: `9 (1.0.0)`;
  - supported device counts remained unchanged: Phone `12,162`, Tablet `6,295`, TV `4`, Car `9`, Chromebook `72`, Android XR `1`;
  - release notes matched the TestMyApps feedback update.
- Saved the Alpha release, went to Publishing overview, clicked `Send 1 change for review`, confirmed `Send changes for review`, and waited for quick checks to complete.
- Final Play Console state at 2026-05-15T18:35:32-05:00: `Changes in review`; message shown: `Your changes are now in review. We may find additional issues when reviewing your app.` Item changed: `Closed testing - Alpha`, `10 (1.0.0)`, `Start full rollout`.
- Managed publishing is off, so the closed-testing update should publish automatically after Google approval.
- Tester notice gate: do not tell Clyrolabs/TestMyApps testers can update until Play Console shows the v10 release approved/available, or until a Google Play app-update-published notification arrives.
- Paid/pro scaffold status for this release: RevenueCat/pro code exists, but monetization remains off by default unless `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true` is set. No local `.env` exists, so the review/tester build fails open and should not block invoice creation behind an unfinished paid unlock.
- Cost: no new direct Google Play charge or card prompt during the browser submission. Earlier EAS build credit/minute usage still applies to the already-built AAB.

## 2026-05-15 TestMyApps FieldBill Feedback

- Gmail check found new Clyrolabs/TestMyApps FieldBill feedback from 2026-05-14.
- Tester observations to fix in the next Android maintenance release:
  - onboarding profile page has confusing duplicate address search/manual behavior;
  - Start Job button is not fully visible after profile onboarding on at least one tester device;
  - parts can be added and viewed during an active job, but existing parts cannot be edited;
  - final invoice review gives too much screen space to Email/Mark Sent/Mark Paid actions and too little to invoice content;
  - TestMyApps asked for Privacy Policy and Terms/Conditions links inside the app and aligned Play listing links.
- Replied to Clyrolabs on 2026-05-15, copied `support@testmyapps.app`, confirming the feedback was received and will be handled in the next release before notifying them to update testers. Sent Gmail message id `19e2da0f494fe34c`.
- Apple iOS review status remains `Changes needed`; the Gmail body still does not include the exact issue, so App Store Connect review submission `cf9b172e-3c31-4d83-ad77-1b67d8f9e570` still needs direct review-page inspection.
- Verification already run before this note: `npm run check:tester-release` passed with expected warnings for local EAS versioning and no local `.env`.
- Cost: no direct cost for review or email reply. A new EAS build may consume Expo/EAS credits/minutes.

## 2026-05-15 Android Maintenance Build v10

- Implemented the TestMyApps/Clyrolabs maintenance fixes:
  - simplified address entry by removing the confusing manual/search toggle from `AddressAutocompleteInput`;
  - added bottom-safe Start Job footer spacing so the start action remains visible around device navigation bars;
  - added active-job part editing through `app\active-job.tsx`, `app\add-part.tsx`, and part update/delete helpers in `lib\fieldbill-db.ts`;
  - compacted final invoice actions so Email/Mark Sent/Mark Paid use less vertical screen space;
  - added in-app Privacy Policy and Terms links on onboarding and Home;
  - added hosted Terms documents under `docs\terms\` and listing-link notes in `docs\store-listing-copy.md`.
- `npm run check:tester-release` passed before and after the build. Final check after EAS bumped Android `versionCode` to `10` passed with expected warnings for local EAS versioning, no local `.env`, and dirty working tree.
- Built Android production AAB with EAS build `2aa2a809-d9ae-4d84-951e-adcf844620f1`.
- EAS bumped `app.json` Android `versionCode` from `9` to `10`; commit this bump with the release patch before the next store build.
- EAS artifact: `https://expo.dev/artifacts/eas/6gmMhdrGFzybYN7xFBiGS6.aab`.
- Local AAB: `builds\FieldBill-1.0.0-android-v10-play.aab`.
- Non-interactive Play submit was attempted and failed because Google service-account keys are not configured and EAS cannot set them up in `--non-interactive` mode.
- Play release notes: `Maintenance update from tester feedback: simplified address entry, improved Start Job button visibility, added active-job part editing, compacted invoice review actions, and added in-app Privacy Policy and Terms links.`
- Cost: EAS build may consume Expo/EAS build credits/minutes depending on account plan. No direct dollar charge or card prompt was shown.

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

## 2026-05-09 TestFi iOS campaign checkout

- Opened TestFi in Edge and completed developer onboarding far enough to build a FieldBill iOS campaign.
- Campaign details entered: app `FieldBill`, platform `Mobile, iOS`, TestFlight link `https://testflight.apple.com/join/dYdE2Gcw`, written-feedback test type, 10-minute session, first-come-first-served tester acceptance.
- Tester count set to `4`, estimated cost `$7.96` (`4 x $1.99`).
- Test description asks testers to complete the FieldBill iOS TestFlight job-to-invoice workflow, watch for duplicate customer entries, confusing customer dropdown behavior, crashes, layout issues, and audio note/permission problems.
- Proceeded to Stripe checkout for `CDrop LLC`. Checkout page shows `TestFi Campaign: FieldBill`, total due `$7.96`, contact email `ssehie@gmail.com`, and payment options including Link, Amazon Pay, Klarna, card, Cash App Pay, and bank.
- Stopped at payment method selection because the next step needs payment/card or payment-provider action.
- Cost note: no payment was submitted in this pass.

## 2026-05-09 live tester/release status check

- Google Play Console app list: FieldBill is `Closed testing`, installed audience `2`, last updated `May 9, 2026`.
- Google Play Console notification panel shows `App update published. Users should see changes immediately but may take longer.` dated `May 9`.
- FieldBill Play `Closed testing - Alpha` track is `Active`; latest release is `9 (1.0.0)`, available to selected testers, released `May 9 5:10 AM`, `177 countries / regions`.
- Play tester access still uses Google Groups and includes both `testmyappscommunity@googlegroups.com` and `testmyappshub@googlegroups.com`.
- TestFi dashboard: FieldBill iOS campaign is `ACTIVE`, `4 testers`, `0 testers recruited`, total spent `$7.96`; campaign card shows `$1.00/tester`.
- Gmail check found no new Apple/TestFlight approval email and no new TestMyApps results after the earlier Clyrolabs `testing in progress` message.
- App Store Connect browser check could not verify iOS status because the session is no longer logged in and is showing the Apple login page.

## 2026-05-09 evening FieldBill tester follow-up

- Gmail check found FieldBill TestFi activity: five `Tester Joined` notifications and four `New Written Feedback Submitted` notifications.
- TestFi joined tester names visible in Gmail: John Zaks, Akinnibi John, Vishnu, Enoiy, and Alexander.
- TestFi feedback text is not included in Gmail; opened `https://www.testfi.app/developer_dashboard` in Edge for dashboard review.
- TestMyApps/Clyrolabs still has only the earlier `FieldBill - TestMyApps Testing in Progress` email in Gmail; no later bug/results email was found.
- Apple/TestFlight Gmail search found no FieldBill approval/update email.
- ReliableQA Gmail search found no inbound reply. Sent a follow-up to `contact.reliableqa@gmail.com` with the FieldBill iOS public TestFlight link `https://testflight.apple.com/join/dYdE2Gcw` and asked for payment/order process, tester setup instructions, expected start time, and reporting format.
- Cost note: no new direct cost was incurred by the follow-up. Existing TestFi/TestMyApps spend remains as previously logged.

## 2026-05-10 tester dashboard check

- Checked the existing Edge window only; did not open or duplicate Edge windows.
- Google Play Console home dashboard shows FieldBill app status `Closed testing`, installed audience `13`, last updated `May 9, 2026`.
- Google Play Console notification panel shows `App update published. Users should see changes immediately but may take longer.` dated `May 9`.
- TestFi dashboard shows FieldBill iOS campaign `CLOSED`, `4 testers`, total spent `$7.96`, and completed campaign status visible.
- TestMyApps dashboard shows FieldBill Android run details: app `FieldBill`, version `1.0.0`, platform `Android`, build type `Play Store`, status `SUBMITTED`, latest update `Testing Clock Started`, SLA due `May 25, 1:59 PM`.
- TestMyApps report status still says the team is processing the run and the final report will appear once released.
- TestMyApps dashboard also shows PsiGrid queued separately; FieldBill is the older active Android run.
- Cost note: no new cost incurred during this dashboard check.

## 2026-05-10 Apple production submission prep

- Ran `npm run check:tester-release`; passed TypeScript, lint, Expo Doctor `17/17`, and tester-release preflight.
- Retried `npx eas-cli submit -p ios --latest --profile production --non-interactive --verbose`.
  - EAS found App Store Connect API key `[Expo] EAS Submit 6AJs6IHeJn` / key id `9TQ9HPKA6U`.
  - EAS found existing build `17ee3fd2-41d0-402c-a54b-f897d3bd1cf4`, app version `1.0.0`, build number `5`.
  - EAS scheduled submission `4129c41c-03b8-4044-a937-d526eedba142`.
  - Apple/EAS still returned only `Something went wrong when submitting your app to Apple App Store Connect`.
- Created App Store production packet: `C:\fieldbill\docs\app-store-production-submission.md`.
- Generated App Store-sized screenshots from the existing FieldBill store screenshots:
  - iPhone 6.7 inch: `C:\fieldbill\assets\store\app-store\iphone-6.7\fieldbill-ios-01.png` through `fieldbill-ios-04.png`, each `1290 x 2796`.
  - iPad Pro 12.9 inch landscape: `C:\fieldbill\assets\store\app-store\ipad-12.9-landscape\fieldbill-ipad-01.png` through `fieldbill-ipad-04.png`, each `2732 x 2048`.
- Opened App Store Connect for FieldBill in Edge: `https://appstoreconnect.apple.com/apps/6762166246/appstore/ios/version/inflight`.
- Remaining blocker: the production App Store Connect form must be completed in the logged-in browser because this session does not have a browser-control tool or a local App Store Connect API key file. Required browser steps are screenshots, metadata, App Privacy, pricing/availability, IAP/product decision, build selection, App Review info, and `Add for Review` / submit.
- Highest review risk before clicking submit: FieldBill includes RevenueCat / FieldBill Pro code. Either configure and test Apple non-consumable `fieldbill_pro_lifetime` with RevenueCat before production review, or submit a new build that hides/defers the paid unlock path until the product is ready.
- Cost note: no direct Apple submission cost was incurred. Extra EAS iOS rebuilds may cost money because earlier logs showed the Expo account had used `100%` of included monthly build credits.

## 2026-05-10 Apple production submission completed

- Completed the logged-in App Store Connect production submission for FieldBill iOS version `1.0`, build `1.0.0 (5)`.
- Uploaded and accepted App Store screenshots:
  - iPhone 6.5-inch slot: 3 screenshots from `assets/store/app-store/iphone-6.5/`.
  - iPad 12.9-inch slot: 3 screenshots from `assets/store/app-store/ipad-12.9-landscape/`.
- Filled and saved production metadata: promotional text, description, keywords, support URL, subtitle, category `Business`, copyright, and review notes.
- Set App Privacy to `Data Not Collected` and published the privacy update in App Store Connect.
- Set Age Ratings to `4+` / Brazil `AL` / Korea `ALL`.
- Attached iOS build `5`, set sign-in not required, and filled review contact information for Steven Sehie.
- Set Content Rights to no third-party content.
- Set pricing to `$0.00` and availability to all `175` countries or regions on app release.
- Submitted `1` item to Apple review. App Store Connect showed `1 Item Submitted`; iOS version status changed to `Waiting for Review`.
- Cost note: no new direct Apple charge, card prompt, or EAS rebuild was incurred during the browser submission. The app was submitted as free.

## 2026-05-11 monetization release gate

- Added an explicit monetization gate: paid unlock is disabled unless `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true` is present and the relevant RevenueCat platform key is configured.
- Updated the FieldBill Pro screen so a free/review build does not advertise a broken purchase button or restore flow when monetization is disabled.
- Updated tester preflight so disabled monetization is treated as an intentional safe state, and RevenueCat keys are required only after the explicit enable flag is set.
- Updated `docs\monetization-setup.md` with the enable flag and the rule that EAS production should not enable monetization until Apple/Google products, RevenueCat entitlement/offering, sandbox purchase, and restore are tested.
- Release stance: current app review/tester path remains free and fail-open. Monetization path is preserved but must be enabled deliberately in a future build after store product setup is verified.
- Cost note: no new direct cost. Future EAS rebuilds may consume paid credits if the included quota is exhausted.

## 2026-05-12 Apple review changes needed

- Gmail check found two App Store Connect emails for FieldBill iOS around 2026-05-12 09:28-09:29 Central: `There's an issue with your FieldBill (iOS) submission.` and `Your App Review Feedback`.
- Apple status changed from `Waiting for Review` to `Changes needed` for FieldBill iOS version `1.0`, submitted 2026-05-10 06:44 PM PDT.
- Submission ID: `cf9b172e-3c31-4d83-ad77-1b67d8f9e570`; app id path in the Apple link points at `6762166246`.
- The email did not include the specific rejection reason. Next action is to open the App Review details page in App Store Connect, read the exact issue, patch FieldBill, and resubmit.
- Cost note: no direct cost from checking Gmail or recording the review result. A resubmission that requires a new EAS iOS build may consume paid build credits if the included quota is still exhausted.


## 2026-05-03 13:18 AgentArch note

- Added shsehie@gmail.com to FieldBill local tester trackers: docs/friend-tester-email-list.csv and docs/play-tester-emails.csv. Still needs Play Console tester-list update if not already added there.

## 2026-05-03 13:25 AgentArch note

- Sent FieldBill Google Play internal test link to shsehie@gmail.com via Gmail: https://play.google.com/apps/internaltest/4700383710080203480

## 2026-05-17 status refresh

- Checked Gmail for new FieldBill, Google Play, App Store Connect, Clyrolabs, TestMyApps, and `App update published` mail after the May 15 Clyrolabs reply. No newer FieldBill release/tester/app-review mail was found.
- Current blocker remains authenticated store-console verification: confirm whether Android v10 is approved/live in Play Console and open App Store Connect review details for iOS submission `cf9b172e-3c31-4d83-ad77-1b67d8f9e570`.
- No FieldBill code changes were made in this pass.
- Cost note: no direct cost incurred. A future EAS iOS rebuild may consume paid build credits if quota is exhausted.
