# Project Notes

## 2026-06-01 Full Store Health Pass

- Switched AgentArch active project to `fieldbill` and confirmed `C:\fieldbill` as the active path.
- Public Apple lookup for app ID `6762166246` returns FieldBill `1.0.1` in the U.S. storefront and `0` results for sampled EU storefronts `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl`.
- Public Google Play URL returns HTTP `200` and contains `FieldBill`: `https://play.google.com/store/apps/details?id=com.fieldbill.app&hl=en_US&gl=US`.
- Signed-in App Store Connect read-only evidence:
  - iOS page shows `iOS App Version 1.0.1` and `1.0.1 Ready for Distribution`.
  - Pricing and Availability shows `175 Countries or Regions`, `148 Available`, and `27 Cannot Sell`.
  - IAP page shows `Approved (1)` for `FieldBill Pro Lifetime` / `fieldbill_pro_lifetime` / `Non-Consumable` / `Approved`.
  - Business page shows Free Apps Agreement active, Paid Apps Agreement active, bank account `chime (9177)` active, and U.S. Form W-9 active.
  - Compliance still shows `Digital Services Act`, `27 Countries or Regions`, last updated `May 28, 2026`, status `In Review`.
- Screenshot evidence: `C:\Projects\research\pc-control\captures\shot-20260601-173044557.png`, `C:\Projects\research\pc-control\captures\shot-20260601-173241317.png`, `C:\Projects\research\pc-control\captures\shot-20260601-173334287.png`, `C:\Projects\research\pc-control\captures\shot-20260601-173421490.png`, and `C:\Projects\research\pc-control\captures\shot-20260601-173504470.png`.
- Local `npm run check:tester-release` failed only at Expo Doctor package-version validation: `expo` expected `~54.0.35` but found `54.0.34`; `expo-font` expected `~14.0.12` but found `14.0.11`; `expo-router` expected `~6.0.24` but found `6.0.23`.
- Current conclusion: iOS `1.0.1`, IAP, and paid business setup are green outside the EU; EU remains blocked by Apple DSA review; Android listing is reachable; local release check needs Expo patch-level dependency alignment.
- No app code, store settings, release actions, ads, or emails were changed in this pass.

## 2026-05-31 Apple DSA Fix Attempt

- User requested getting the EU/DSA issue done.
- Restarted the token-protected PC Control helper and used the signed-in Edge/App Store Connect session.
- Reopened FieldBill App Information / App Store Regulations & Permits / Digital Services Act.
- The app-specific DSA modal already has `This is a trader app` selected; `Next` is disabled because there is no app-specific change to save.
- Reopened App Store Connect Business / Agreements / Compliance.
- Account-level `Digital Services Act` still shows `27 Countries or Regions`, last updated `May 28, 2026`, status `In Review`.
- Clicking the country/region `View` link only opens the EU country list; clicking the row/status exposes no edit or submit action.
- Current conclusion: the remaining EU block is Apple-controlled compliance review, not a local FieldBill code/build/store-metadata action available in the UI.
- Escalation date: if Apple has not cleared the DSA review by `2026-06-17`, contact Apple Developer Support with the evidence that the app-specific trader status is selected but account compliance remains `In Review`.

## 2026-05-31 Apple DSA / EU Availability Recheck

- Restarted the token-protected PC Control helper and used the signed-in Edge/App Store Connect session for read-only inspection only.
- App Store Connect App Information now shows the Digital Services Act section with: `This developer has identified itself as a trader for this app.`
- App Store Connect Pricing and Availability shows FieldBill app availability as `148 Available` and `27 Cannot Sell`.
- The `27 Cannot Sell` detail is the EU country set; visible rows include Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, and Denmark.
- The EU rows show status `Trader Status Not Provided`; the `View` tooltip says trader status is required for distribution on the App Store in the European Union.
- Public Apple lookup confirms the split: `us` returns FieldBill `1.0.1`, while sampled EU stores `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl` return `0` results.
- Screenshot evidence: `C:\Projects\research\pc-control\captures\shot-20260531-150200706.png`, `C:\Projects\research\pc-control\captures\shot-20260531-150417598.png`, `C:\Projects\research\pc-control\captures\shot-20260531-150537764.png`, and `C:\Projects\research\pc-control\captures\shot-20260531-150615645.png`.
- Current conclusion: FieldBill iOS `1.0.1` and first IAP are production-ready outside the blocked EU set, but EU distribution is not production-green until Apple/App Store Connect has trader status provided for those 27 countries or regions.

## 2026-05-30 Public GitHub Ad Page

- Business Outreach created a clean public GitHub repo for FieldBill promotion: `https://github.com/ssehie/fieldbill-public-ad`.
- Published public ad page: `https://ssehie.github.io/fieldbill-public-ad/`.
- Improved the public ad page with share/index metadata plus `robots.txt` and `sitemap.xml`.
- Published an owned GitHub Release announcement: `https://github.com/ssehie/fieldbill-public-ad/releases/tag/v2026.05.30-fieldbill-public-ad`.
- The public ad page links to the verified App Store and Google Play listings.
- The public repo contains only promotional page files and copied public store imagery; it does not include app source, customer data, contact lists, outreach logs, or private campaign notes.
- Business Outreach added targeted field-tech paid/sponsor research for HVAC-Talk, LawnSite, PlumbingZone, PaintTalk, ElectricianU, and Reddit Ads community targeting.
- No external email, paid ad, directory submission, Reddit post, LinkedIn post, Facebook post, or Product Hunt submission was sent from this action.

## 2026-05-30 iOS 1.0.1 And IAP Green

- Direct signed-in App Store Connect app list shows FieldBill `iOS 1.0.1 Ready for Distribution`.
- Direct signed-in App Store Connect version page shows `iOS App Version 1.0.1` and `1.0.1 Ready for Distribution`.
- Direct signed-in App Store Connect In-App Purchases page shows `Approved (1)`.
- IAP `FieldBill Pro Lifetime` / product ID `fieldbill_pro_lifetime` / type `Non-Consumable` is `Approved`.
- Screenshot evidence: `C:\Projects\research\pc-control\captures\shot-20260530-032837214.png`, `C:\Projects\research\pc-control\captures\shot-20260530-032941247.png`, and `C:\Projects\research\pc-control\captures\shot-20260530-033008869.png`.
- Operator tested TestFlight and confirmed version `1.0.1` came in and the purchase unlock worked.
- PC Control helper was stopped after the check; no App Store Connect state-changing action was taken.
- Current conclusion: iOS `1.0.1`, first IAP approval, and TestFlight purchase unlock are green. Remaining check is public App Store propagation/release state and DSA status.

## 2026-05-30 Apple Review Completed For iOS 1.0.1

- Gmail found new App Store Connect mail from `2026-05-30T02:55:43Z`: `Review of your FieldBill (iOS) submission is complete.`
- Apple states submission `612917e4-30f5-4240-a241-099bd6075046` is completed and eligible for distribution.
- Accepted item: FieldBill App Version `1.0.1` for iOS.
- Public Apple lookup still reports production app version `1.0`, so `1.0.1` is not publicly live yet.
- Direct App Store Connect page check through PC Control redirected to Apple login; fresh sign-in is needed to inspect release/IAP/DSA page state.
- PC Control helper was stopped after the check; no App Store Connect state-changing action was taken.
- Current conclusion: App Review approval is achieved by email evidence. Next gates are direct release-state inspection, IAP propagation/status, DSA status, and TestFlight/sandbox purchase + restore retest.

## 2026-05-29 Apple Business Info Recheck

- Operator reported the remaining Apple business setup was completed and requested a fresh App Store Connect page check.
- Restarted the token-protected PC Control helper from `C:\Projects\research\pc-control` and used the signed-in Edge/App Store Connect session for read-only inspection.
- Business/Agreements page now shows the paid business side cleared: Paid Apps Agreement `Active`, bank account `chime (9177)` `Active`, and `U.S. Form W-9` submitted `May 29, 2026` with status `Active`.
- DSA compliance still shows `In Review`, last updated `May 28, 2026`, for `27 Countries or Regions`.
- App Store Connect app list/version page still shows iOS `1.0.1` as `Waiting for Review`; iOS `1.0` remains `Ready for Distribution`.
- TestFlight still shows version `1.0.1`, build `8`, upload `Complete`, build status `Ready to Submit`, internal group `Team (Expo)`, `1` invite, `2` installs, `16` sessions, no crashes/feedback.
- Authenticated App Store Connect API confirms IAP `FieldBill Pro Lifetime` / `fieldbill_pro_lifetime` / Apple ID `6773188154` remains `WAITING_FOR_REVIEW`, `isAppStoreReviewInProgress: true`, with no approved/ready/rejected IAP rows.
- Authenticated App Store Connect API confirms review submission `612917e4-30f5-4240-a241-099bd6075046` for iOS `1.0.1` remains `WAITING_FOR_REVIEW`; submitted `2026-05-28T03:01:29.324Z`.
- Stopped the PC Control helper after the recheck; port `8787` is no longer listening and `control\stop.flag` is present.
- Current conclusion: the previous Paid Apps Agreement/bank/tax blocker is cleared. Remaining visible gates are Apple review for `1.0.1` and first IAP, DSA review, and then a fresh iPhone TestFlight/sandbox purchase plus restore retest after Apple state has propagated.

## 2026-05-29 Paid Apps Agreement Signed

- Operator completed Apple 2FA and explicitly requested completing the Paid Apps Agreement.
- Used the token-protected PC Control helper from `C:\Projects\research\pc-control` against the logged-in Edge/App Store Connect session.
- App Store Connect Business/Agreements page showed the legal entity update had cleared and exposed `View and Agree to Terms` for the Paid Apps Agreement.
- Opened the Paid Apps Agreement terms, checked the agreement checkbox, and clicked `Agree`.
- Apple accepted the agreement action; the Paid Apps Agreement now shows effective dates `May 29, 2026 - Mar 27, 2027` with status `Pending User Info`.
- New visible blockers: Apple requires a bank account before paying proceeds and a U.S. Form W-9 tax form before the paid/IAP path can be considered production-ready.
- Bank/tax details were not entered by Codex.
- DSA compliance remains `In Review`, last updated `May 28, 2026`, for `27 Countries or Regions`.
- Stopped the PC Control helper after the pass; port `8787` is no longer listening and `control\stop.flag` is present.
- Current conclusion: the Paid Apps Agreement signing step is done, but iOS monetization is still blocked by Apple business user info, DSA review, App Review/IAP review completion, and a fresh TestFlight/sandbox purchase + restore retest.

## 2026-05-29 PC Control App Store Connect Live Recheck

- Operator logged back into App Store Connect and requested using PC Control.
- Started the loopback PC Control helper from `C:\Projects\research\pc-control` after removing its local `control\stop.flag`.
- Used the helper for read-only Edge/CDP inspection of the logged-in App Store Connect session; no Apple-side write action was taken.
- Live iOS version page now confirms: `iOS App 1.0.1` is `Waiting for Review`; `1.0` remains `Ready for Distribution`.
- Version `1.0.1` has build `8` / `1.0.1` attached and shows the version metadata/edit page while waiting for review.
- Live In-App Purchases page confirms first IAP is included in review: `FieldBill Pro Lifetime`, product ID `fieldbill_pro_lifetime`, `Non-Consumable`, status `Waiting for Review`.
- Live App Review submissions page shows the `1.0.1` submission from Wednesday at `10:01 PM`, submitted by `Steven Sehie`, `1 Item`, status `Waiting for Review`; the May 20 `1.0` submission is `Review Completed`.
- Live TestFlight page shows version `1.0.1`, build `8`, upload status `Complete`, build status `Ready to Submit`, internal group `Team (Expo)`, `1` invite, `2` installs, `16` sessions, no crashes or feedback shown.
- Live Business/Agreements page still shows the monetization contract blocker: legal entity information must be updated before signing the Paid Apps Agreement.
- Agreements state remains: Free Apps Agreement `Active`; Paid Apps Agreement `New`.
- DSA compliance remains `In Review`, last updated `May 28, 2026`, for `27 Countries or Regions`.
- Current conclusion: `1.0.1` plus first IAP is correctly submitted and waiting for Apple review, but not production-ready yet. The remaining gates are Apple review completion, DSA approval, legal entity update, Paid Apps Agreement signing, then sandbox/TestFlight purchase and restore retest.

## 2026-05-29 iOS Production Readiness Check

- Checked current iOS/App Store state without starting any build, release, review, paid agreement signing, or IAP purchase action.
- Live Edge/App Store Connect Business page still shows the monetization blocker: `To offer apps or other in-app purchases, you must update your legal entity information prior to signing the Paid Apps Agreement.`
- App Store Connect Agreements state observed: Free Apps Agreement `Active`; Paid Apps Agreement `New`.
- App Store Connect Compliance state observed: Digital Services Act last updated `May 28, 2026`, status `In Review`, for `27 Countries or Regions`.
- Direct App Store Connect app pages for iOS version, TestFlight, In-App Purchases, and App Information redirected to Apple login with `authResult=FAILED`; a fresh Apple login/2FA is needed before direct App Review status can be trusted.
- Gmail check found the latest App Store Connect mail after the 1.0.1 submission is only the DSA receipt email `We received your trader contact information` from `2026-05-28T19:43:35Z`; no newer `1.0.1` App Review completion email was found.
- Public App Store listing is live, but Apple's public lookup still reports FieldBill production version `1.0`, bundle `com.fieldbill.app`, free, current version release date `2026-05-21T22:10:37Z`.
- EAS confirms the latest iOS store build `41fe864d-a2c7-4d69-97a6-cfe338250277` finished as app version `1.0.1`, build `8`, production/store profile, but that only proves the binary exists; it does not prove App Store production release.
- Public TestFlight link `https://testflight.apple.com/join/dYdE2Gcw` still returns HTTP `200` and shows the FieldBill beta join page.
- Current conclusion: iOS production is live for the existing free `1.0` app, but the `1.0.1` monetized/IAP release is not production-green. Remaining gates are fresh App Store Connect login, direct `1.0.1` review status check, DSA approval, legal entity update/Paid Apps Agreement, then sandbox/TestFlight purchase and restore retest.

## 2026-05-28 Apple DSA Trader Compliance

- Completed the App Store Connect Digital Services Act trader flow for FieldBill using the signed-in developer account.
- Declared Steve Sehie as a trader under DSA for EU distribution.
- Entered public trader contact details: `419 W 5th Ave, El Dorado, KS 67042-1828, United States`, `+1 (316) 323-8649`, and `ssehiedeveloper@gmail.com`.
- Verified the email and phone codes through the devphone/Gmail path.
- Uploaded `C:\Projects\images\Apple_Verification_ID.pdf` for both name and address identification document steps.
- Confirmed the public contact information. App Store Connect now shows `Digital Services Act` last updated `May 28, 2026` with status `In Review` for `27 Countries or Regions`.
- Remaining visible Apple monetization blocker: update legal entity information before signing the Paid Apps Agreement.
- Current stop point: wait for Apple DSA review, continue watching iOS `1.0.1` App Review, and handle the legal entity/Paid Apps Agreement path before relying on paid IAP availability.

## 2026-05-27 iOS App Review submission

- Resumed the signed-in Edge App Store Connect session through Ark PC Control.
- Filled the required `What's New in This Version` field for iOS App Version `1.0.1`: `Adds App Store metadata and screenshot updates for the initial FieldBill release.`
- Saved metadata, clicked `Add for Review`, and App Store Connect showed the draft submission item `iOS App 1.0.1` ready to submit.
- Clicked `Submit for Review`.
- Verified App Store Connect confirmation: `1 Item Submitted`; Apple notes review can take up to 48 hours.
- No Android Play production state, EAS build, release action, paid tester order, or in-app purchase was started.
- Current stop point: wait for Apple review/submission status and IAP propagation, then retest the iPhone TestFlight/sandbox purchase sheet and restore path.

## 2026-05-27 iOS IAP version attachment

- Inspected the signed-in Chrome App Store Connect session for FieldBill; no Android Play production state was changed.
- iPhone screenshot `C:\Projects\images\error.jpg` confirmed the Pro route opens and RevenueCat reaches Apple product fetch, but StoreKit cannot fetch the App Store Connect product: `fieldbill_pro_lifetime`.
- App Store Connect `In-App Purchases` showed Apple's first-IAP gate: the first in-app purchase must be submitted with a new app version and selected from that version's `In-App Purchases and Subscriptions` section before App Review.
- Confirmed product `FieldBill Pro Lifetime` / `fieldbill_pro_lifetime` / Apple ID `6773188154` is `Ready to Submit`, non-consumable, available in all countries or regions, and has pricing configured.
- Created iOS App Store version `1.0.1` in `Prepare for Submission`.
- Attached build `8` / version `1.0.1` to the new App Store version.
- Attached `FieldBill Pro Lifetime` / `fieldbill_pro_lifetime` to the new version's `In-App Purchases and Subscriptions` section and saved the version.
- Did not click `Add for Review`, submit to App Review, release, start a new EAS build, start a paid tester order, or make a purchase.
- Current stop point: the App Store version-side IAP attachment is fixed. The remaining Apple gate is submitting version `1.0.1` plus the first IAP for App Review when explicitly approved.

## 2026-05-27 Android production Play Console check

- Checked the signed-in PC Edge Play Console production track for FieldBill.
- No release controls, rollout controls, App Review actions, paid ads, or store changes were clicked.
- Production track is `Active`.
- Latest production release is `11 (1.0.0)` for `Phones, Tablets, Chrome OS, Android XR`.
- Track summary shows `177 countries / regions` and `11 installs`.
- Release dashboard is scoped to `Release: Most recent (11 (1.0.0))`.
- Play Console shows `2 actions recommended`: deprecated edge-to-edge APIs/parameters, and resizability/orientation restrictions for large-screen support. These are UX recommendations, not release blockers.
- Gmail has IARC `Live Rating Notice: FieldBill` dated Wednesday, May 27, 2026 for storefront `Google Play`.
- Public Play URL returned HTTP `200` with title `FieldBill - Apps on Google Play`: `https://play.google.com/store/apps/details?id=com.fieldbill.app&hl=en_US&gl=US`.
- Current stop point: Android production is live enough to promote publicly; continue the free promotion lane and keep the iOS StoreKit/RevenueCat issue separate.

## 2026-05-26 Android free advertising prep

- Recovered after the lost adverts connection and resumed the no-build Android outreach path.
- Sent 10 additional individual FieldBill Android advert/outreach emails from `ssehie@gmail.com` using the documented feedback-focused copy.
- New recipients: `office@shawneeelectric.com`, `totalelectric@totalelectco.com`, `morriselectricalservice@gmail.com`, `operations@816SOLARPROS.COM`, `ADMIN@AAELECTRICALINC.COM`, `JStapleton@AidenMorrisElectric.com`, `office@arrowcircleelectric.com`, `permits@bearpawelectric.com`, `contact@bickimerelectric.com`, `caseyelectricinc@sbcglobal.net`.
- Logged the new 10 sends in `docs/worldwide-outreach-log.csv` with Gmail SENT message IDs, bringing the logged Android advert/outreach send count to 30.
- Created `docs/public-forum-advert-posting.md` with paste-ready public forum copy, allowed-advert Reddit targets, and a free directory queue.
- Created `docs/public-forum-100-adverts.csv` with 100 public forum/directory advert placements: 78 ready, 13 needing rule checks, 5 needing current thread lookup, and 4 low-fit fallbacks.
- Put the full Reddit comment on the Windows clipboard and opened the top Reddit targets in the default browser for logged-in posting.
- Added the public forum / allowed advert thread lane to `docs/worldwide-android-campaign.md`.
- User then asked for 100 more in different countries, interrupted once, then resumed with `proceed`; created `docs/public-forum-100-country-adverts.csv`.
- The second queue has 100 country-targeted placements: 30 ready, 32 needing rule checks, and 38 needing current allowed-thread lookup.
- Current stop point: first 100-placement public advert queue exists, but rows should not be marked posted until a real public post/listing URL is captured.
- Sent 20 live FieldBill Android advert/outreach emails from connected Gmail account `ssehie@gmail.com` to targeted public contractor/trade contacts already present in `docs/tester-outreach-targets.csv`.
- Verified Gmail sent-mail search for subject `FieldBill Android invoice app feedback` returned 20 message IDs from this pass.
- Logged the 20 sent adverts in `docs/worldwide-outreach-log.csv` with message IDs.
- Created `docs/free-advertising-kit.md` to promote the already-tested Android build without cutting another build.
- After user approved a full-force worldwide Android promotion push, added `docs/worldwide-android-campaign.md`, `docs/worldwide-outreach-log.csv`, and `docs/android/index.html`.
- Copied the Android screenshot contact sheet into `docs/assets/store/phone-screenshots/contact-sheet.png` so the GitHub Pages Android landing page has a locally served visual asset.
- Android promotion target remains the known-good Play package `com.fieldbill.app`, URL `https://play.google.com/store/apps/details?id=com.fieldbill.app`.
- Kit includes policy guardrails, direct outreach copy, Facebook/Reddit/Product Hunt/maker-community copy, target trades, and a launch-day checklist.
- Looked up current public guidance for Google Play store-listing/promotion policy, Reddit self-promotion limits, and Product Hunt launch basics; the campaign docs record those references.
- Public search currently surfaces `fieldbill.app`, which appears to be a different product; campaign docs warn not to use that domain for this app unless ownership is verified later.
- Verified local references in `docs/android/index.html`; privacy, terms, Play URL, and screenshot asset paths resolve.
- No Android build, Play rollout, paid ad buy, bulk SMS, App Review action, or release action was started. The only live promotion action was the 30 individual Gmail outreach sends.
- Recommended next action: check Gmail for replies/bounces to the 30 outreach sends, then continue with at most another 10-20 individual contractor messages or one allowed Facebook group/Reddit post after checking rules.

## 2026-05-26 FieldBill Context Switch To RF Watch

- Logged the current FieldBill stop point before switching to RF Watch / Tricorder prep.
- Current unresolved iOS purchase issue remains StoreKit/App Store Connect product fetch, not a missing RevenueCat offering or missing Pro route.
- Latest FieldBill verification before switching: `npm run check:tester-release` passed; `git diff --check` only reported expected CRLF warnings.
- No new EAS build, App Review action, release, paid tester order, or in-app purchase was started after the screenshot follow-up.
- Return action: check App Store Connect product `fieldbill_pro_lifetime`, bundle `com.fieldbill.app`, Paid Apps Agreement, tax, banking, price, availability, IAP status, and sandbox propagation before any new iOS build.

## 2026-05-26 iPhone upgrade path lost after free path

- User reported that the upgrade path appeared after opening the upgrade screen, but after going back to the free/trial path the upgrade path disappeared again in the installed TestFlight build.
- Researched the RevenueCat/App Store error shown in the screenshot. Primary docs support the current diagnosis: FieldBill is configured enough to call RevenueCat, but StoreKit is not returning the App Store Connect product in sandbox/TestFlight.
- Called RevenueCat's public offerings API with the iOS SDK key. RevenueCat returned current offering `default`, package `$rc_lifetime`, and product identifier `fieldbill_pro_lifetime`, so the RevenueCat offering/product mapping is live.
- Patched `app/(tabs)/index.tsx` again so the configured `FieldBill Pro` action appears immediately after the primary Home action, before draft/history actions, even when no purchasable package is returned.
- Current installed TestFlight build `1.0.1 (8)` does not contain this Home action-order patch; a new iOS build is required after the live Apple/RevenueCat product-fetch issue is fixed.
- Next live checks are now concentrated on App Store Connect / StoreKit: product `fieldbill_pro_lifetime`, bundle `com.fieldbill.app`, Paid Apps Agreement, tax, banking, product price, availability, status, and sandbox propagation.
- No EAS build, App Review action, release, or in-app purchase was started for this follow-up.

## 2026-05-26 iPhone RevenueCat product fetch error

- User saved the iPhone error screenshot at `C:\Users\ssehie\OneDrive\Desktop\error.jpg`; SHA256 `01E7DF47F41085F7F9B89C8E77858D18114D4AE69CAB5F214DBBACACD39AA33E`.
- Screenshot shows `FieldBill Pro`, so the deep link / Pro route works.
- On-device RevenueCat error: `There is an issue with your configuration... None of the products registered in the RevenueCat dashboard could be fetched from App Store Connect... https://rev.cat/why-are-offerings-empty`.
- Verified again that EAS production has monetization `true`, Apple RevenueCat public SDK key `appl_MIVjCmUjykCdBmvVcYIKWyBeWxv`, entitlement `pro`, and offering `default`. The local IPA inspection already confirmed the Apple key is embedded in build `1.0.1 (8)`.
- Diagnosis: this is not a missing RevenueCat API key and not a missing Pro screen. StoreKit/RevenueCat cannot fetch the App Store Connect product registered in the RevenueCat offering.
- Patched `app/upgrade.tsx` so the next build shows `Store product is not available yet` when the app is configured but no App Store package loads, rather than saying to add the RevenueCat key.
- `npm run check:tester-release` passed after the patch. TypeScript, lint, Expo Doctor, and FieldBill preflight are green; expected warnings remain local EAS versioning, no local `.env`, and dirty working tree.
- Next checks should be live App Store Connect and RevenueCat, before any new EAS build: exact product ID `fieldbill_pro_lifetime`, app/bundle `6762166246` / `com.fieldbill.app`, IAP status/availability/price, Paid Apps Agreement/Agreements/Tax/Banking, and RevenueCat App Store app/offering/package attachment.

## 2026-05-26 iPhone TestFlight purchase UI not visible

- User installed iOS TestFlight build `1.0.1 (8)` on iPhone and reported that the purchase part was not visible.
- Verified EAS production env still loads monetization for iOS: `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true`, Apple RevenueCat public SDK key `appl_MIVjCmUjykCdBmvVcYIKWyBeWxv`, entitlement `pro`, and offering `default`.
- Inspected the local IPA and confirmed the Apple RevenueCat public SDK key is present in `main.jsbundle`, so the installed build should be configured for RevenueCat.
- Root app-side UX issue found: Home only showed the Pro card/button when `canGateInvoices` was true, which requires a purchasable package to already be returned. If StoreKit/RevenueCat did not return the package, Home hid the purchase entry instead of showing an unavailable/checking state.
- Patched `app/(tabs)/index.tsx` so monetized builds show the FieldBill Pro card and action whenever monetization is configured. If the package is not loaded yet, Home now says `Pro purchase is not available yet` and shows a `FieldBill Pro` button that opens `/upgrade` for retry/restore status.
- `npm run check:tester-release` passed after the patch. TypeScript, lint, Expo Doctor, and FieldBill preflight are green; expected warnings remain local EAS versioning, no local `.env`, and dirty working tree.
- Current TestFlight build `1.0.1 (8)` does not include this patch. A new iOS build is required before this Home visibility fix appears on iPhone.
- For immediate diagnosis on the installed build, use `fieldbill://upgrade` from Safari on the iPhone to open the existing Pro screen directly. If the product still does not load there, recheck live App Store Connect IAP availability/status and RevenueCat offering/product attachment before spending another iOS build.
- Do not start another EAS iOS build without explicit user approval because previous notes flagged possible Expo pay-as-you-go cost.

## 2026-05-26 unexpected stop recovery check

- Reconstructed the FieldBill stop point from `NEXT-CODEX-STARTUP.md`, `PROJECT-STATUS.md`, the EAS build record, local artifact hash, git state, process listeners, and ADB state.
- EAS build `41fe864d-a2c7-4d69-97a6-cfe338250277` is confirmed `FINISHED` for iOS `1.0.1 (8)`, distribution `STORE`, profile `production`, artifact `https://expo.dev/artifacts/eas/99E5pJMiiyS2uoreT31Nfk.ipa`.
- Local IPA `C:\fieldbill\builds\FieldBill-1.0.1-ios-b8-monetization.ipa` still matches SHA256 `726320DE4A2D0EEDC0A9AEB89320FDE3AC979583B8BFC72D31CF16AA09EB0658`.
- No FieldBill Metro/dev server is currently listening. The Expo listener on port `8084` is from `C:\Projects\musical-resonance`, not FieldBill.
- Devphone `ZT4228M83L` is connected over ADB.
- `npm run check:tester-release` passed after the recovery check. TypeScript, lint, Expo Doctor, and FieldBill preflight are green; expected warnings remain local EAS versioning, no local `.env`, and dirty working tree.
- No app code was changed during this recovery check. The active next gate remains iOS internal TestFlight install, Sandbox Apple Account purchase against `fieldbill_pro_lifetime`, restore, and explicit approval before any App Review/IAP submit or release action.

## 2026-05-26 iOS monetization build uploaded

- User approved proceeding with the iOS monetization build even though EAS previously reported included build credits at `100%`.
- Verified production EAS config before building: bundle `com.fieldbill.app`, monetization enabled, Apple RevenueCat key loaded, entitlement `pro`, offering `default`.
- `npm run check:tester-release` passed before and after the build work.
- First monetized iOS build `1.0.0 (7)` finished, but EAS submit failed with `SUBMISSION_SERVICE_IOS_OLD_APP_VERSION` because App Store Connect had already received app version `1.0.0`.
- Bumped FieldBill to app version `1.0.1`.
- Replacement EAS iOS build `41fe864d-a2c7-4d69-97a6-cfe338250277` finished as `1.0.1 (8)`.
- EAS submit `aaa0fd4f-c0f7-4175-a049-e07bacedca99` finished successfully and uploaded build `1.0.1 (8)` to App Store Connect/TestFlight.
- Created App Store Connect Sandbox Apple Account `ssehie+fieldbill-ios-sandbox-20260526-062600@gmail.com` under `Users and Access > Sandbox`. The generated password is intentionally not recorded in git-tracked docs.
- App Store Connect TestFlight shows version `1.0.1`, build `8`, status `Ready to Submit Expires in 90 days`, and internal group `Team (Expo)` attached. External `Add Group` / beta review was not clicked.
- IPA artifact: `https://expo.dev/artifacts/eas/99E5pJMiiyS2uoreT31Nfk.ipa`.
- Local IPA: `C:\fieldbill\builds\FieldBill-1.0.1-ios-b8-monetization.ipa`; SHA256 `726320DE4A2D0EEDC0A9AEB89320FDE3AC979583B8BFC72D31CF16AA09EB0658`.
- `app.json`, `package.json`, and `package-lock.json` now carry version `1.0.1`; `app.json` carries `ios.buildNumber` `8`.
- Remaining iOS monetization gates: install build `1.0.1 (8)` through internal TestFlight on iPhone, sign into the Sandbox Apple Account for purchase testing, sandbox purchase, restore, and user-approved App Review/IAP submission path.
- Cost: EAS iOS build(s) were started after user approval and may be billable by Expo. No App Review submission, release, paid tester order, or in-app purchase was started.

## 2026-05-26 iOS RevenueCat Apple wiring complete

- Created App Store Connect In-App Purchase API key `FieldBill RevenueCat` for RevenueCat.
- Apple key ID: `RZ8H9ML2DQ`; issuer ID: `b37cafad-5d9a-45e0-b657-3184416b446a`.
- Uploaded the `.p8` key to RevenueCat for the `fieldbill (App Store)` app and deleted the local downloaded key file afterward. Do not recreate/download another private key unless RevenueCat credentials need to be rotated.
- RevenueCat App Store app `fieldbill (App Store)` is configured for bundle `com.fieldbill.app` and shows valid Apple credentials.
- RevenueCat Apple public SDK key `appl_MIVjCmUjykCdBmvVcYIKWyBeWxv` is set in EAS `production` and `preview` as `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`.
- RevenueCat Apple product `fieldbill_pro_lifetime` is attached to entitlement `pro`.
- RevenueCat offering `default` package `$rc_lifetime` now contains both Android and App Store `FieldBill Pro` products.
- EAS env verification passed for `production` and `preview`; `eas config -p ios -e production --json` confirms production variables load for iOS config.
- `npm run check:tester-release` passed with expected warnings: local EAS versioning, no local `.env`, and dirty docs/worktree.
- Remaining iOS gates: approve any paid EAS iOS build cost, build/install a new iOS binary with the Apple RevenueCat key, run iOS sandbox purchase plus restore, and submit the first IAP through an app-version review path only after explicit user approval.
- Cost: no new cost; no EAS build, paid tester order, app submission, release, or purchase was started.

## 2026-05-25 iOS App Store Connect IAP created

- App Store Connect is signed in and the FieldBill iOS non-consumable now exists.
- Product type: non-consumable.
- Reference name: `FieldBill Pro Lifetime`.
- Product ID: `fieldbill_pro_lifetime`.
- Apple ID: `6773188154`.
- Localization: English (U.S.), display name `FieldBill Pro`, description `Unlock unlimited invoices in FieldBill.`
- Availability: all countries or regions selected; `Remove from Sale` is off.
- Price schedule: United States base price `$29.99`; App Store Connect generated regional prices.
- Review screenshot uploaded from `assets\store\app-store\iap-review-fieldbill-pro-iphone-65.png` (`1242 x 2688`). The first cropped `720 x 1448` asset was rejected by App Store Connect for invalid screenshot dimensions.
- IAP status changed from `Missing Metadata` to `Ready to Submit`.
- Current iOS app version page shows `1.0 Ready for Distribution`; no app review submission/release action was clicked in this pass.
- Remaining iOS monetization gates: attach/submit the IAP with the next iOS app-version review path, wire RevenueCat Apple to entitlement `pro` and offering `default`, then run iOS sandbox purchase and restore.
- Cost: no new cost; no EAS build, paid tester order, app submission, or purchase was started.

## 2026-05-25 Android production-ready harness rule; iOS next

- Android monetization is now classified as production-ready from the app/billing harness side.
- Evidence threshold met: Play-delivered FieldBill v11, Google `Test card, always approves`, no-charge test-order notice, RevenueCat entitlement `pro`, FieldBill UI `Pro Unlock` = `Active`, and restore success.
- Harness rule: future Android billing tests must preserve the dev-account Play Store install path (`ssehiedeveloper@gmail.com`) and must verify a Google test instrument before pressing buy.
- Harness rule: do not casually repurchase the same Android non-consumable; refund/revoke the test order in Play Console first or use a fresh tester account for a clean purchase pass.
- Android can proceed from a billing-readiness standpoint. Remaining Android release gates, if any, are Play Console/business rollout gates rather than FieldBill purchase wiring.
- iOS is now the active monetization lane. It is not green until App Store Connect has the non-consumable `fieldbill_pro_lifetime`, RevenueCat Apple wiring is complete, and TestFlight/sandbox purchase plus restore pass.
- Cost: no new cost; this entry records the harness rule and milestone.

## 2026-05-25 Android sandbox purchase and restore passed

- Joined `testmyappscommunity@googlegroups.com` on the devphone as `ssehiedeveloper@gmail.com` with subscription set to `No email`.
- Opened the FieldBill Play testing opt-in URL with `authuser=1`; the dev account enrolled and showed `You are a tester.`
- Uninstalled FieldBill, cleared full Play Store app data only with `cmd package clear com.android.vending`, then switched Play Store back from the default `ssehie@gmail.com` state to `Ssehie Developer / ssehiedeveloper@gmail.com`.
- Reinstalled FieldBill from Google Play and verified `versionCode=11`, `versionName=1.0.0`, `installerPackageName=com.android.vending`, installed at `2026-05-25 20:44:09`.
- Opened `fieldbill://upgrade`; Google Play purchase sheet showed `Test card, always approves` and `This is a test order, you will not be charged.`
- Completed the `1-tap buy` sandbox purchase. FieldBill returned to `Unlimited invoices are unlocked.` and `Pro Unlock` = `Active`.
- Logcat evidence: `[FieldBill QA] billing.purchase.success` with `entitlementId:"pro"` and `packageId:"$rc_lifetime"`; customer info showed `hasProAccess:true`.
- Ran `Restore Purchase`; logcat showed `[FieldBill QA] billing.restore.completed` with `restoredProAccess:true`.
- Current Android monetization gate: passed for closed-test Alpha v11. Future retests should use the dev-account Play Store install path and verify a test instrument before pressing buy.
- Cost: no real charge; Google Play displayed the no-charge test-order notice.

## 2026-05-25 Play Billing Lab installed; test cards still absent

- Installed `Play Billing Lab` (`com.google.android.apps.play.billingtestcompanion`) from Google Play.
- Opened it as `Steve Sehie / ssehie@gmail.com`; dashboard is available.
- Visible Play Billing Lab controls are configuration settings, subscription settings, and response simulator. Response simulator exposes response-code simulation, not a test-card picker.
- Cleared Play Store cache only with `pm clear --cache-only com.android.vending`, force-stopped Play Store, and retried the FieldBill purchase sheet.
- FieldBill temporarily reopened at first-run intro during the retry path; tapped `Skip intro` and restored the `FieldBill Pro` upgrade screen.
- Final payment-method check still showed only real methods for `ssehie@gmail.com` and no visible Google `Test card`.
- Backed out to FieldBill; no purchase completed.
- Current gate: either use a funded real method for one live purchase/void/refund test, or investigate why Google test instruments are not surfacing for the already-listed license tester account. Do not clear full Play Store data without user confirmation.
- Cost: Play Billing Lab install was free; no purchase completed and no Pro entitlement granted.

## 2026-05-25 Play Console license tester list verified

- Opened Play Console developer account `8439387974199008185` and navigated to `Settings > Monetization > License testing`.
- License testers are set to email list `email tester` with `7` users.
- The list includes both `ssehie@gmail.com` and `ssehiedeveloper@gmail.com`.
- License response is `RESPOND_NORMALLY`.
- Retried the Android purchase sheet and opened Google Play `Payment methods` for `ssehie@gmail.com`.
- Payment selector still showed only real instruments (`Visa-8871`, `Amex-5972`, `Mastercard-7087`, PayPal, other cards, Google Pay balance) and no visible `Test card`.
- Tapping `+ more` opened the add-card flow, so the phone was backed out to FieldBill.
- Current gate: use Play Billing Lab or refresh Play Store billing/account state until test instruments appear, then retry with `Test card, always approves`.
- Cost: no purchase completed and no Pro entitlement granted.

## 2026-05-25 Android purchase declined / not allowed

- Human completed the Google account verification prompt and Google Play returned to FieldBill after the payment was declined.
- FieldBill upgrade screen now shows `The device or user is not allowed to make the purchase.`
- Logcat shows `ProxyBillingActivity` finished with billing `responseCode: 3`.
- RevenueCat emitted `PurchasesError(code=PurchaseNotAllowedError ... Billing Unavailable ... message='The device or user is not allowed to make the purchase.')`.
- FieldBill emitted `[FieldBill QA] billing.purchase.failed` with the same message.
- No `billing.purchase.success` event appeared and Pro remains locked.
- Current gate: verify the active Play account/license-tester/payment setup or select an approving test instrument, then retry purchase and restore.
- Cost: no successful purchase recorded by FieldBill/RevenueCat; no Pro entitlement granted.

## 2026-05-25 Android purchase flow blocked at Google account verification

- User confirmed `Visa-8871` is a test/payment-safe card and authorized continuing the purchase flow.
- Relaunched `fieldbill://upgrade`, opened the Play purchase sheet, and pressed `Buy`.
- Google Play moved to an account verification sheet for `ssehie@gmail.com`.
- Checked `Remember me on this device`; Play displayed the warning that disabling authentication may allow unauthorized purchases.
- UI automation shows the account field is a password-type field and `Verify` remains disabled until the password is entered, so automation stopped.
- No RevenueCat `billing.purchase.success` or `billing.purchase.failed` app result was emitted because the flow did not return to FieldBill.
- Current gate: human must enter the Google account password on-device once, then resume entitlement/restore verification. If Google remembers the device, future sandbox passes should get past this screen without waiting.
- Cost: no confirmed charge and no successful purchase recorded; stopped at Google verification.

## 2026-05-25 Android Play install verified; sandbox purchase blocked on license-test state

- User approved replacing the sideloaded app; uninstalled `com.fieldbill.app` v7 from device `ZT4228M83L`.
- Installed FieldBill from the Google Play closed-test listing and verified `versionCode=11`, `versionName=1.0.0`, `installerPackageName=com.android.vending`, installed at `2026-05-25 17:55:31`.
- Opened `fieldbill://upgrade`; the RevenueCat package loaded and the app showed `FieldBill Pro`, `$29.99`, `0` invoices created, and `3` free invoices left.
- Tapped `Unlock Pro $29.99` only far enough to display the Google Play purchase sheet.
- Purchase sheet showed real payment method `Visa-8871`, `$29.99 + tax`, and no visible sandbox/test-card wording, so the `Buy` action was not pressed.
- Current gate: verify Play Console `Settings > License testing` and test-payment setup for the active phone account, then retry sandbox purchase and restore only when the sheet shows test-purchase signals instead of a real card/tax flow.
- Cost: no direct cost; stopped before any purchase/charge.

## 2026-05-25 Android closed-test Alpha v11 published

- Reused the existing Chrome window and closed five old RF/route-map tabs before inspecting Play Console.
- Publishing overview shows `You have no unpublished changes`.
- Play Console notification dated May 24 says `App update published. Users should see changes immediately but may take longer.`
- Test and release shows Closed testing `alpha` with release `11 (1.0.0)`.
- Closed testing - Alpha detail shows the track is `Active`, latest release is `11 (1.0.0)`, available to selected testers, `177` countries / regions, released on May 24 at 3:02 PM.
- Current gate is no longer Google review for v11; next gate is Android sandbox purchase/restore against `fieldbill_pro_lifetime`, then RevenueCat entitlement `pro` verification.
- Do not start any paid production rollout until sandbox purchase/restore passes and Google production access is approved.
- Cost: no direct cost; no EAS build or paid service was started.

## 2026-05-25 Waiting on Google review; local readiness still green

- Ran `npm run check:tester-release`; TypeScript, lint, Expo doctor, and tester preflight passed.
- Expo doctor reported `18/18 checks passed`.
- Tester preflight passed with only expected warnings: local EAS versioning and no local `.env`; Git working tree is clean.
- Gmail search found no official Google/FieldBill approval or rejection email newer than the v11 send-for-review checkpoint.
- No Edge/Play Console browser session is currently running on this machine.
- Current gate remains Play Console review for closed-test Alpha v11, then Android sandbox purchase/restore against `fieldbill_pro_lifetime`.
- Cost: no direct cost; no EAS build or paid service was started.

## 2026-05-24 Android closed-test v11 uploaded and queued

- Downloaded the finished EAS Android production app bundle to `C:\fieldbill\builds\FieldBill-1.0.0-android-v11-play.aab`.
- Local AAB details: `80,971,892` bytes; SHA256 `BEE42DE16A2C7C722ED4B9A0A74EACBC6AB18B791F0F3C876A043356D6518AE7`.
- Tried direct EAS submit first with `npx eas-cli submit -p android --id 105dd818-2f05-4590-88d8-d814dddf07f4 --non-interactive --verbose`; it failed because EAS cannot set up Google Service Account keys in non-interactive mode.
- Used the signed-in Edge Play Console session instead.
- Uploaded `FieldBill-1.0.0-android-v11-play.aab` to Play Console `Closed testing - Alpha`.
- Play Console accepted app bundle version `11 (1.0.0)`, API levels `24+`, target SDK `36`, screen layouts `4`, ABIs `4`, required features `4`.
- Release notes were added for `en-US` and the closed-test release draft was saved.
- Preview warning is non-blocking: no deobfuscation file is associated with the app bundle. No R8/ProGuard mapping upload is configured for this Expo/RN build.
- Publishing overview now shows `1` unsent change: `Closed testing - Alpha`, version `11 (1.0.0)`, description `Start full rollout`.
- Play Console quick checks completed and the page says the changes can now be sent for review; the final visible action is `Send 1 change for review`.
- Do not click `Send 1 change for review` without explicit user confirmation. Managed publishing is off, so approved closed-test changes can publish automatically after Google review.
- Android sandbox purchase/restore for `fieldbill_pro_lifetime` still cannot be completed until this monetized build is installable through Play testing.

## 2026-05-24 Android closed-test v11 sent for review

- User confirmed `send`; clicked Play Console `Send 1 change for review`, then confirmed the modal action `Send changes for review`.
- Play Console Publishing overview now shows `Changes in review`.
- Reviewed change: `Closed testing - Alpha`, version `11 (1.0.0)`, description `Start full rollout`.
- Play Console message: changes are now in review and Google may find additional issues while reviewing the app.
- Because managed publishing is off, approved changes may publish automatically after review.
- Next action: monitor Play Console/Gmail for review result; once v11 is installable by testers, run Android sandbox purchase and restore against `fieldbill_pro_lifetime`.

## 2026-05-24 Android production AAB build finished

- Started EAS Android production app-bundle build for Play testing with `npx eas-cli build -p android --profile production --non-interactive --no-wait --json`.
- Build ID: `105dd818-2f05-4590-88d8-d814dddf07f4`.
- EAS logs URL: `https://expo.dev/accounts/ssehie/projects/fieldbill/builds/105dd818-2f05-4590-88d8-d814dddf07f4`.
- AAB artifact URL: `https://expo.dev/artifacts/eas/32dGg22nwp47cKEcovmWij.aab`.
- Build profile: `production`; distribution: `STORE`; platform: `ANDROID`; app version: `1.0.0`; app build version/versionCode: `11`.
- EAS loaded the production monetization variables for FieldBill before upload.
- EAS auto-bumped `expo.android.versionCode` in `app.json` from `10` to `11`.
- Final remote status at `2026-05-24T11:41:15-05:00`: `FINISHED`.
- Local checks completed before starting the build:
  - `npx tsc --noEmit`: passed.
  - `npm run lint`: passed.
  - `npx expo-doctor`: passed, `18/18 checks passed`.
  - `npm run preflight:tester`: passed with expected warnings for local EAS versioning, no local `.env`, and dirty working tree.
- RevenueCat direct browser/CDP status probe was attempted from the signed-in Edge session, but the internal endpoint fetch timed out. Prior verified state still stands: RevenueCat Google credentials are uploaded/protected and Pub/Sub developer notifications are connected.
- Next action: upload the resulting `.aab` to Play Console internal or closed testing, then run Google Play sandbox purchase and restore against `fieldbill_pro_lifetime`.
- Cost: this can consume EAS build quota/build minutes; no direct local cost.

## 2026-05-24 Android RevenueCat Google service credentials completed

- Google Cloud service account `RevenueCat Service Account` was created in project `api-project-294089098252`.
- Play Console service-account user `revenuecat-service-account@api-project-294089098252.iam.gserviceaccount.com` is active for FieldBill with the scoped app permissions RevenueCat needs: view app info, view app quality info, view financial data, and manage orders/subscriptions.
- Uploaded the service-account JSON to RevenueCat for Android app `FieldBill Android` (`app87ed3fec9b`); RevenueCat now stores credentials as `RC__PROTECTED` and shows service-account key details for project `api-project-294089098252`.
- Enabled Google Cloud Pub/Sub API and Google Play Android Developer API.
- RevenueCat Google developer notifications connected after adding Pub/Sub Admin; `pub_sub_enabled: true`, topic `projects/api-project-294089098252/topics/Play-Store-Notifications`, and `pub_sub_error_status: null`.
- Deleted the local temporary JSON key after upload/connect; no private key content is kept in the repo.
- Remaining Android paid-launch work: create/install a fresh native Android build with monetization env, run sandbox purchase/restore, wait for Google production-access decision, and do not start a paid rollout until those pass.
- iOS IAP/App Store Connect setup remains separate and still needs Apple sign-in/2FA.
- Cost: no direct local cost.

## 2026-05-24 Android RevenueCat monetization configured

- RevenueCat account `ssehie@gmail.com` is verified and project `fieldbill` (`3fe9596f`) is active.
- Created RevenueCat Google Play app `FieldBill Android` (`app87ed3fec9b`) for package `com.fieldbill.app`.
- RevenueCat public Google SDK key is now set in EAS `production` and `preview` as `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`.
- Created RevenueCat product `fieldbill_pro_lifetime` (`prodbc42966e33`) as a Play Store non-consumable and attached it to entitlement `pro` (`entlcf87fedd47`).
- Created current offering `default` (`ofrngc5bc65c372`) with package `$rc_lifetime` (`pkgee66913e7a3`) containing `fieldbill_pro_lifetime`.
- EAS `production` and `preview` environments now include:
  - `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true`
  - `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`
  - `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID=pro`
  - `EXPO_PUBLIC_REVENUECAT_OFFERING_ID=default`
- `eas.json` now explicitly maps `internal` and `release-apk` builds to EAS `preview`, and `production` builds to EAS `production`, so the RevenueCat env is deterministic for Android tester/store builds.
- Verified with `npx eas-cli env:list --environment production`, `npx eas-cli env:list --environment preview`, `npx eas-cli config -p android -e production --json`, and `npx eas-cli config -p android -e internal --json`; EAS reports the RevenueCat variables are loaded from the expected environments.
- Verification: `npm run check:tester-release` passed. Expected warnings remain local EAS versioning, no local `.env`, and dirty working tree.
- Superseded by the entry above: RevenueCat Google Play credentials and Pub/Sub developer notifications are now connected.
- Remaining Android gate is no longer service-account creation; it is a fresh monetized native build plus sandbox purchase/restore and Google production-access approval.
- Do not start a paid Android production rollout until RevenueCat/Google propagation is green, Android sandbox purchase/restore passes, and production access is approved.
- Cost: no direct cost.

## 2026-05-24 Android production access application submitted

- Play Console production-access application was submitted from the signed-in browser session.
- Play Console confirmation: `Application submitted`; production panel now says Google is reviewing the application form, will email the account owner with an update, usually takes `7 days or less` but can take longer, and shows `Applied today, 7:29 AM`.
- Submitted answers were compressed to the Play Console `300` character limits and aligned to verified FieldBill evidence: TestMyApps/Clyrolabs paid testing route, 16/16 engaged testers, full job-to-invoice workflow coverage, v10 tester-feedback fixes, live legal links, no account requirement, and Android closed-test gate completion.
- Release readiness check initially failed because `expo-doctor` wanted an explicit Expo Metro config. Added `metro.config.js` using `getDefaultConfig(__dirname)` from `expo/metro-config`; `npm run check:tester-release` then passed.
- Verification result: `npm run check:tester-release` passed. Expected warnings remain local EAS versioning, no local `.env` so monetization is off, and dirty working tree from current docs/config changes.
- Next action: monitor Gmail/Play Console for the production-access decision. Do not create or start a production rollout until access is granted and the production release is reviewed.
- Cost: no direct cost.

## 2026-05-24 Monetization readiness pass

- User shifted next target to monetization after Android production-access application submission.
- Local audit found the RevenueCat purchase code already exists and uses entitlement `pro`, offering `default`, product/package selection, purchase, restore, and local pro-access caching.
- EAS environment check: no variables exist for `production`, `preview`, or `development`, so RevenueCat cannot be enabled in EAS builds yet.
- RevenueCat browser check: `https://app.revenuecat.com/` opens to login. Gmail search found no RevenueCat messages in the last year, so assume no accessible account/project yet.
- Play Console check: `Monetize with Play > Products > One-time products` shows `1 - 1 of 1`; signed-in API data confirms one product ID `fieldbill_pro_lifetime`, display name `FieldBill Pro`, with one `lifetime` purchase option.
- App Store Connect check: not authenticated; Apple redirects to login with `authResult=FAILED`. Need Apple sign-in/2FA before creating or verifying the iOS non-consumable.
- App-side Android billing fixes applied:
  - Added `com.android.vending.BILLING` to `app.json` Android permissions.
  - Added `com.android.vending.BILLING` to `android/app/src/main/AndroidManifest.xml`.
  - Changed `MainActivity` launch mode from `singleTask` to `singleTop` for purchase-safe payment verification handoffs.
  - Extended `scripts/tester-release-preflight.cjs` to enforce billing permission and purchase-safe launch mode.
- Verification: `npm run check:tester-release` passed after the fixes. Expected warnings remain local EAS versioning, no local `.env`, and dirty working tree.
- Blockers to actual paid launch:
  - Create/sign in to RevenueCat, create FieldBill project, attach Google/Apple products, entitlement `pro`, offering `default`, and copy public SDK keys.
  - Complete App Store Connect sign-in/2FA and create/submit iOS non-consumable `fieldbill_pro_lifetime` with a new app version.
  - Add EAS production env vars and build new Android/iOS binaries with monetization enabled.
- Cost: no direct cost in this pass.

## 2026-05-24 Clyrolabs production report and public link check

- Gmail found a new unread/important Clyrolabs FieldBill message: `FieldBill - Production Report`, received `2026-05-23T03:14:21`.
- Clyrolabs says they tested the new features/UI, attached a Google Play production-access questionnaire guide, will keep FieldBill installed for `16` days, and asked to be informed once production access is granted.
- Read attachment `FieldBill_Google_Play_Production_Access_Guide_2026.docx`. It contains draft answers for all `10` Google Play production-access questions plus a checklist and feature/scenario reference.
- Do not paste the guide blindly. Reconcile it with actual Play Console/tester records first, especially recruitment sources, feedback channels, `12` testers, full `14`-day continuity, and tester-confirmed fixes. Some guide tips still look generic/template-derived and should be cleaned before submission.
- Public link checks:
  - App Store `https://apps.apple.com/app/fieldbill/id6762166246`: HTTP `200`, resolved to `https://apps.apple.com/us/app/fieldbill/id6762166246`, title `FieldBill App - App Store`, shows FieldBill as a free Business app by Steve Sehie.
  - TestFlight `https://testflight.apple.com/join/dYdE2Gcw`: HTTP `200`, title `Join the FieldBill beta - TestFlight - Apple`, contains `View in TestFlight`, no obvious full/not-accepting text.
  - Privacy Policy `https://ssehie.github.io/fieldbill/privacy-policy/`: HTTP `200`, title `Privacy Policy for FieldBill`.
  - Terms `https://ssehie.github.io/fieldbill/terms/`: HTTP `200`, title `Terms and Conditions for FieldBill`.
  - TestMyApps public pages still describe managed Android/iOS testing, `12` testers / `14` days, Play Console link/APK/TestFlight handoff, feedback/reporting, and no guarantee of app-store approval.
- Initial non-browser check could not verify private dashboard state; the follow-up computer-use check below did verify the signed-in TestMyApps dashboard. Play Console production-access state is still not live-verified in-browser.
- Gmail did not show a newer official Google Play production-access/review status email. The only Google Play match after 2026-05-21 was a Google Play I/O recap marketing email.
- Unrelated note: Gmail also has an unread Clyrolabs `PSIGRID - Production Report` from 2026-05-24.
- Next action: open signed-in Play Console, verify the production-access checklist/timer, then submit the Google production-access questionnaire using the Clyrolabs guide only after aligning the wording to provable FieldBill evidence.
- Cost: no direct cost.

## 2026-05-24 TestMyApps dashboard computer-use check

- Opened the signed-in TestMyApps dashboard with Edge/computer use. The current dashboard route is `https://testmyapps.app/dashboard`; the old `https://testmyapps.app/developer_dashboard` route now returns `404 Page not found`.
- Account shown: Steve Sehie / `ssehie@gmail.com`.
- Dashboard summary: `2` total apps, `2` in testing, `0` completed, wallet credits `0`, notifications `4`.
- Recent apps: `PsiGrid` and `FieldBill`, both `IN TESTING`.
- FieldBill run detail route: `https://testmyapps.app/test-runs/e6a8f16b-6409-4971-8c9d-a00e681f8019`.
- FieldBill overview: `SUBMITTED`; submitted `May 8, 6:18 PM`; SLA due `May 25, 1:59 PM`; build type `Play Store`; latest update `Testing Clock Started`; app `FieldBill`; version `1.0.0`; platform `Android`; delivery `Play Store`.
- FieldBill progress: `Day 15 of 16`; `1 day remaining before SLA`; active testers `16 / 16 ENGAGED`; tester submissions `0 NONE YET WAITING`; current stage `In Testing`.
- Client progress updates remain the May 14 Praveen Kumar request for in-app/listing Privacy Policy and Terms links plus regular push releases, and the May 9 tester-assignment start note.
- Reports tab: final report is `Not released yet`.
- Instructions tab: no login required; testers are asked to create a job, select/add a customer, add labor/materials, save/reopen, and verify saved customer/job data while watching for duplicate customer entries or confusing customer selection. Build access remains `Play Store`.
- Next action: wait for the final TestMyApps report or the May 25 SLA, and separately open Play Console to verify production-access eligibility before telling Clyrolabs production access is granted.
- Cost: no direct cost.

## 2026-05-24 Play Console production-access eligibility check

- Opened signed-in Google Play Console under developer `8439387974199008185`.
- Selected FieldBill app `4972649305430524285`, package `com.fieldbill.app`.
- FieldBill dashboard shows `Production` is still `Inactive`.
- Production-access panel is now available with `Apply for production`.
- All displayed prerequisites are checked complete:
  - `Publish a closed testing release`
  - `Have at least 12 testers opted-in to your closed test`
  - `Run your closed test with at least 12 testers, for at least 14 days`
- This confirms the Play Console timer/gate is satisfied enough to start the production-access questionnaire.
- Do not submit the questionnaire without explicit user approval. Use Clyrolabs' `FieldBill_Google_Play_Production_Access_Guide_2026.docx` only as draft source and clean answers against evidence first.
- Cost: no direct cost.

## 2026-05-21 Monetization hold after iOS launch

- Decision: leave the current live App Store build free and observe real installs/usage before enabling a paywall.
- Current intended paid model: one-time FieldBill Pro unlock at `$29.99`, likely after `7` free invoices if usage data supports that limit.
- No production monetization code/config was enabled in this pass. Current live build still has RevenueCat/paywall disabled and fails open, so users can continue creating invoices.
- Watch next: installs, first open, setup completion, invoice creation, and whether users naturally reach multiple invoices.
- When ready: update the free-invoice limit constant/docs, create Apple/RevenueCat product `fieldbill_pro_lifetime`, sandbox-test purchase/restore, then ship a new build with monetization enabled.
- Cost: no direct cost.

## 2026-05-21 FieldBill iOS approved by Apple

- Gmail check found two App Store Connect emails from 2026-05-21:
  - `Welcome to the App Store`, received `2026-05-21T22:10:47Z`.
  - `Review of your FieldBill (iOS) submission is complete.`, received `2026-05-21T22:10:48Z`.
- Apple says FieldBill iOS has been approved for distribution and the reviewed submission is complete and eligible for distribution.
- Accepted item: App Version `1.0` for iOS.
- Submission ID: `cf9b172e-3c31-4d83-ad77-1b67d8f9e570`.
- Submitted: `May 20, 2026 at 02:45 PM Pacific Daylight Time`.
- Submitted by: `Steven Sehie`.
- App Store URL from Apple email: `https://apps.apple.com/app/fieldbill/id6762166246`.
- Direct public App Store URL check returned HTTP `200`, resolved to `https://apps.apple.com/us/app/fieldbill/id6762166246`, page title `FieldBill App - App Store`, and the page content contains `FieldBill`.
- Apple caveat: it can take up to 24 hours after release for the app to become publicly available, and distribution depends on App Store Connect contracts being in effect.
- No newer Clyrolabs/TestMyApps FieldBill response was found in the same Gmail check; latest FieldBill tester response remains the handled May 14-15 thread.
- Next action: run an iPhone smoke test from the public App Store or TestFlight, verify App Store Connect Agreements/Tax/Banking if any install/pricing issue appears, and recheck the public TestFlight link before sending it to paid iOS testers.
- Cost: no direct cost.

## 2026-05-20 iOS resubmitted to App Review

- In authenticated App Store Connect, removed rejected build `1.0.0 (5)` from iOS version `1.0`, attached build `1.0.0 (6)`, and saved the version.
- Updated App Review notes to explicitly state that microphone access is requested only when the reviewer chooses to record an optional job talk note for an active job, such as parts used or work still needed, and that audio notes are saved with that job on-device.
- Clicked `Resubmit to App Review`.
- App Store Connect confirmation: iOS Submission status is `Waiting for Review`; item is `iOS App 1.0` / `1.0.0 (6)`; date submitted is `May 20, 2026 at 4:45 PM`; submitted by `Steven Sehie`; submission ID is `cf9b172e-3c31-4d83-ad77-1b67d8f9e570`.
- Next action: monitor App Store Connect/Gmail for the next Apple review result. Do not send the public TestFlight link until Apple review state allows testers to install.
- Cost: no direct cost.

## 2026-05-20 iOS resubmission prep moved forward

- Updated stale iOS release docs so the active resubmission target is build `1.0.0 (6)`, not rejected build `1.0.0 (5)`.
- Updated `docs\ios-testflight-status.md` with EAS build `0226a1eb-d7cc-479a-b1c7-1f7133966f7f`, EAS submission `b7ab4410-c4a2-47f0-bb2e-de5d4743d8da`, and IPA artifact `https://expo.dev/artifacts/eas/gpuoSMQqW2KojGnGnaiBV.ipa`.
- Updated `docs\app-store-production-submission.md` to select build `1.0.0 (6)` and include the microphone-purpose note for App Review.
- EAS CLI build list confirms iOS build `1.0.0 (6)` is `FINISHED`; local `eas-cli` 18.12.3 does not expose `submit:list`, so App Store Connect remains the source of truth for attachment/resubmission state.
- Opened App Store Connect app pages for app `6762166246` in the local browser; final build attach/resubmit was completed in the follow-up entry above.
- Verification after doc sync: `npm run check:tester-release` passed. Warnings were local EAS versioning, no local `.env`, and dirty tree from the two doc edits.
- Cost: no direct cost.

## 2026-05-20 App Store Connect rejection check

- User logged into Apple in Edge; live App Store Connect check is now current.
- FieldBill iOS version `1.0` is `Rejected`.
- Submission ID: `cf9b172e-3c31-4d83-ad77-1b67d8f9e570`.
- Review date: 2026-05-12.
- Review devices: iPhone 17 Pro Max and iPad Air 11-inch (M3).
- Version reviewed: `1.0 (5)`.
- Rejection: Guideline `5.1.1(ii) - Legal - Privacy - Data Collection and Storage`.
- Apple issue: the microphone purpose string did not sufficiently explain the protected-resource use.
- Apple requested: update the microphone purpose string to explain how FieldBill uses microphone access and provide a specific example.
- Source fix applied in `app.json`: added `ios.infoPlist.NSMicrophoneUsageDescription` explaining that microphone access is only used when the user chooses to record an optional job talk note, for example parts used or work still needed, and that notes are saved with the job on-device.
- Built fresh iOS production binary with EAS.
  - EAS build ID: `0226a1eb-d7cc-479a-b1c7-1f7133966f7f`.
  - App version: `1.0.0`.
  - iOS build number: `6`.
  - IPA artifact: `https://expo.dev/artifacts/eas/gpuoSMQqW2KojGnGnaiBV.ipa`.
  - EAS bumped `expo.ios.buildNumber` from `5` to `6` in `app.json`.
- Submitted build `1.0.0 (6)` to App Store Connect with EAS Submit.
  - EAS submission ID: `b7ab4410-c4a2-47f0-bb2e-de5d4743d8da`.
  - App Store Connect app ID: `6762166246`.
  - Upload result: binary successfully uploaded; Apple processing started.
- Live App Store Connect follow-up: TestFlight now shows build `6` under version `1.0.0` with status `Ready to Submit` and expires in 90 days.
- Verification after build/submit: `npm run check:tester-release` passed with expected warnings for local EAS versioning, no local `.env`, and the current uncommitted status-note/app.json changes.
- Next App Store action: attach build `1.0.0 (6)` to rejected iOS version `1.0` and resubmit to App Review.
- Cost: no direct cost for the check/source fix; a new EAS iOS build may consume build credits/minutes.

## 2026-05-20 Morning app/tester pass

- Gmail exact searches after 2026-05-15 found no new inbound FieldBill, TestMyApps, Clyrolabs, Google Play, or App Review Feedback messages.
- Only post-May-15 matching FieldBill/TestMyApps mail found was Steve's sent reply to Clyrolabs/TestMyApps on 2026-05-15.
- `npm run check:tester-release` passed.
- Expected warnings remain:
  - local EAS versioning is active, so commit bumped `app.json` after every EAS tester/store build;
  - no local `.env`, so monetization defaults off for free tester/review builds.
- Local metadata remains `FieldBill` `1.0.0`, Android package `com.fieldbill.app`, Android versionCode `10`, iOS bundle `com.fieldbill.app`, iOS buildNumber `5`.
- Google Play live browser state was rechecked in Edge after this note: FieldBill is `Closed testing`, installed audience `13`, last updated `May 15, 2026`; Test and release shows no unpublished changes and closed testing `alpha` serving `10 (1.0.0)` since `May 15 11:35 PM`.
- App Store Connect live check is blocked at Apple Account sign-in in Edge; iOS review status still needs authenticated Apple session before reporting as current.
- Cost: no direct cost.

## 2026-05-19 Live Publishing Check

- Used the signed-in PC Edge Play Console session to check FieldBill.
- Google Play `Test and release` shows `You have no unpublished changes`.
- Closed testing track `alpha` is serving `10 (1.0.0)`, dated `May 15 11:35 PM`.
- Dashboard production-access checklist shows the first two gates complete: closed testing release published and at least 12 testers opted in.
- Remaining Google Play production gate: run the closed test with at least 12 testers for 14 days. Current live dashboard text: `12 testers have currently been opted in for 10 days continuously`.
- Gmail search for newer FieldBill/TestMyApps/App Review status found no newer FieldBill release or tester response beyond the already-handled May 14-15 Clyrolabs/TestMyApps thread.
- `npm run check:tester-release` passed. Warnings remain expected: local EAS versioning, no local `.env`, and dirty working tree.
- iOS/App Store Connect was not rechecked in this pass; prior blocker remains direct review-page inspection for the FieldBill iOS submission.
- Cost: no direct cost.

## 2026-05-18 FieldBill Terms URL Publish

- Published the existing local Terms page from `docs\terms\index.html` to the active GitHub Pages branch at `https://ssehie.github.io/fieldbill/terms/`.
- Pages commit: `b8c5700 Publish FieldBill terms page` on `gh-pages`.
- Updated the published root index so it links to both Privacy Policy and Terms instead of redirecting only to Privacy Policy.
- Live verification: Terms returns `200 OK` and contains `Terms and Conditions for FieldBill`; Privacy Policy still returns `200 OK`.
- Cost: no direct cost.

## 2026-05-18 FieldBill Review Pass

- Ran `npm run check:tester-release`; it passed TypeScript, lint, Expo Doctor `17/17`, and tester preflight.
- Remaining tester preflight warnings: local EAS versioning is active and no local `.env` exists, so monetization remains off for review/tester builds.
- Live Google Play Console check in PC Edge: FieldBill closed testing `alpha` is serving release `10 (1.0.0)` since `May 15 11:35 PM`; Publishing overview says `You have no unpublished changes`.
- Production-access progress: `12 testers have currently been opted in for 9 days continuously`; production still needs the 14-day continuous closed-test window.
- Live legal URL check: Privacy Policy returns `200 OK`, but Terms returns `404 Not Found` at `https://ssehie.github.io/fieldbill/terms/`.
- Root cause for Terms: remote `origin/gh-pages` currently contains `index.html` and `privacy-policy/`, but no `terms/` folder. Local `docs\terms\index.html` exists on the app branch and needs publishing to the GitHub Pages source before using the terms link in Play/App Store/TestMyApps.
- `npm audit --omit=dev` reports 6 moderate findings through Expo/Metro tooling (`brace-expansion`, `postcss`, `ws`). The PostCSS force fix would downgrade Expo and was not run.
- Cost: no direct cost.

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

