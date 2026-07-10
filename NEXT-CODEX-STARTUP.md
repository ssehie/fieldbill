# Next Codex Startup - fieldbill

## Last Action

Updated: 2026-06-28T19:29:52-05:00

User asked to use PC Control on the signed-in Apple session, review the agreement, and clear whatever was still blocking the EU/App Store state.

Completed this pass:
- Used PC Control to inspect the live signed-in Edge App Store Connect session and the linked Apple Developer account page.
- Confirmed the App Store Connect `Apps` page still showed the Apple Developer Program License Agreement update banner before acceptance.
- Opened `Business -> Agreements`, followed the banner `account` link, opened the Apple Developer Program License Agreement modal, and accepted it after explicit operator confirmation.
- Verified the Apple Developer account page no longer shows the agreement update card after acceptance.
- Verified App Store Connect `Business -> Agreements` no longer shows the update banner and now lists:
  - `Free Apps Agreement` as `Active`, effective `Jun 28, 2026 - Mar 27, 2027`;
  - `Paid Apps Agreement` as `Active`.
- Verified App Store Connect `Business -> Compliance` now shows:
  - regulation `Digital Services Act`;
  - `27 Countries or Regions`;
  - last updated `May 28, 2026`;
  - status `Active`.
- Reran the Apple public storefront lookup across the full saved `175`-territory list and wrote:
  - `C:\fieldbill\reports\apple-public-storefront-availability-20260628.json`
  - summary result: `175/175` storefronts return FieldBill `1.0.1`; `0` storefronts returned no result.
- Evidence files:
  - `C:\Projects\research\pc-control\captures\shot-20260628-192022602.png`
  - `C:\Projects\research\pc-control\captures\shot-20260628-192138404.png`
  - `C:\Projects\research\pc-control\captures\shot-20260628-192248390.png`
  - `C:\Projects\research\pc-control\captures\shot-20260628-192325663.png`
  - `C:\Projects\research\pc-control\captures\shot-20260628-192626518.png`
  - `C:\Projects\research\pc-control\captures\shot-20260628-192659873.png`
  - `C:\Projects\research\pc-control\captures\shot-20260628-192742187.png`

Current conclusion:
- FieldBill iOS is now publicly available in all `175` checked territories.
- The prior EU DSA/trader block is effectively cleared in current App Store Connect Business compliance and public storefront evidence.
- The Apple Developer Program License Agreement gate is cleared for future app updates/submissions.

Next action when returning to FieldBill:
- No immediate Apple support escalation is required while App Store Connect stays `Active` and public storefront availability remains `175/175`.
- If exact signed-in territory-level app availability evidence is needed again, rerun the App Store Connect availability export/report to refresh the internal artifact set.
- Keep Android production promotion separate from the iOS/App Store path.

Previous checkpoint:

Updated: 2026-06-20T07:56:31-05:00

User authorized doing the needed Apple DSA support follow-up and logging the action.

Completed this pass:
- Searched Gmail for Apple Developer Support case `102902060003`.
- Found the usable Apple support thread from `devprograms@apple.com`; Apple's separate file-upload email from `AppleSupport@email.apple.com` was no-reply.
- Sent a follow-up reply to `devprograms@apple.com` in the existing thread.
- Gmail sent message ID: `19ee51a7d07f57d3`; thread ID: `19e89bf69063f4ff`.
- Reply summarized:
  - FieldBill app ID `6762166246`, bundle `com.fieldbill.app`;
  - verification document was uploaded and confirmed on June 2;
  - App Store Connect Business -> Compliance still shows DSA `In Review`, last updated `May 28, 2026`, for `27 Countries or Regions`;
  - Pricing and Availability still shows `148 Available` and `27 Cannot Sell`;
  - EU availability detail still shows `Trader Status Not Provided`;
  - public lookup still returns FieldBill in the U.S. and `0` results in sampled EU storefronts.
- Attached current non-sensitive screenshots:
  - `C:\Projects\research\pc-control\captures\shot-20260620-071735658.png`
  - `C:\Projects\research\pc-control\captures\shot-20260620-071754294.png`
  - `C:\Projects\research\pc-control\captures\shot-20260620-073844905.png`
- Did not attach `C:\Projects\images\Apple_Verification_ID.pdf` or any private identity document.

Current conclusion:
- FieldBill's local/app-level DSA trader setup remains complete.
- The unresolved gate is now Apple Developer Support response/escalation for account-level DSA compliance.
- Continue to treat the 27 EU territories as blocked until Business -> Compliance clears and public EU storefront lookups return the app.

Next action when returning to FieldBill:
- Watch Gmail/App Store Connect for Apple Developer Support response on case `102902060003`.
- If Apple requests additional information, satisfy the request through the secure Apple path only.
- After Apple clears DSA, rerun public Apple lookup across all 175 territories and refresh the App Store Connect availability API report.
- Keep Android production promotion separate from the iOS/EU availability path.

Previous checkpoint:

Updated: 2026-06-20T07:19:42-05:00

User asked to switch to FieldBill and use the signed-in App Store session to check status.

Completed this pass:
- Switched AgentArch active focus to `fieldbill`.
- Used the existing signed-in Edge/App Store Connect window through PC Control for read-only inspection.
- Confirmed FieldBill App Information still shows iOS `1.0.1 Ready for Distribution`.
- Confirmed Pricing and Availability still shows `148 Available` and `27 Cannot Sell`.
- Confirmed App Availability detail still shows EU countries blocked with `Trader Status Not Provided`; visible rows included Austria, Belgium, Bulgaria, Croatia, Cyprus, and Czech Republic.
- Confirmed Business -> Agreements shows Paid Apps Agreement active, bank account active, and U.S. Form W-9 active.
- Found a current Apple Developer Program License Agreement update banner on Business requiring Account Holder review before app updates or new submissions.
- Confirmed Business -> Compliance still shows:
  - regulation `Digital Services Act`;
  - `27 Countries or Regions`;
  - last updated `May 28, 2026`;
  - status `In Review`.
- Public Apple lookup sample remains unchanged: `us` returns FieldBill `1.0.1`; `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl` return `0` results.
- Evidence files:
  - `C:\Projects\research\pc-control\captures\shot-20260620-071647756.png`
  - `C:\Projects\research\pc-control\captures\shot-20260620-071735658.png`
  - `C:\Projects\research\pc-control\captures\shot-20260620-071754294.png`
  - `C:\Projects\research\pc-control\captures\shot-20260620-071859782.png`

Current conclusion:
- FieldBill iOS remains production-ready outside the EU.
- FieldBill iOS is still not publicly available in all countries because 27 EU territories remain blocked by Apple trader/DSA status.
- The local FieldBill/App Store Connect app-level trader setup remains complete; the unresolved gate is Apple account-level DSA review plus the visible account-holder license-agreement review banner.

Next action when returning to FieldBill:
- Have the account holder review the Apple Developer Program License Agreement banner.
- Contact Apple Developer Support case `102902060003` because Business -> Compliance still shows DSA `In Review` after the June 17 escalation date.
- After Apple clears DSA, rerun public Apple lookup across all 175 territories and refresh the App Store Connect availability API report.
- Keep Android production promotion separate from the iOS/EU availability path.

Previous checkpoint:

Updated: 2026-06-11T15:56:00-05:00

User requested lookup and resolution of the DSA trader issue.

Completed this pass:
- Looked up current Apple guidance for EU Digital Services Act trader requirements and compliance review.
- Confirmed the account-level path is App Store Connect `Business` -> `Agreements` -> `Compliance` -> `Digital Services Act`.
- Confirmed the app-level path is FieldBill `App Information` -> `App Store Regulations and Permits` -> `Digital Services Act`.
- Live App Store Connect Business -> Compliance still shows:
  - regulation `Digital Services Act`;
  - `27 Countries or Regions`;
  - last updated `May 28, 2026`;
  - status `In Review`.
- No `Complete Compliance Requirements`, submit, edit, or missing-information action was visible in the Business compliance row.
- FieldBill App Information still shows: `This developer has identified itself as a trader for this app.`
- Immediate public Apple lookup remains unchanged: `us` returns FieldBill `1.0.1`; `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl` return `0` results.
- Calculated the 14th business day after the Apple Business Compliance last-updated date `2026-05-28` as `2026-06-17`.
- Evidence files:
  - `C:\Projects\research\pc-control\captures\shot-20260611-154622474.png`
  - `C:\Projects\research\pc-control\captures\shot-20260611-155104112.png`
  - `C:\Projects\research\pc-control\captures\shot-20260611-155204502.png`

Current conclusion:
- The local FieldBill/App Store Connect DSA trader setup is complete.
- The remaining EU storefront block is not locally resolvable while Apple account-level DSA compliance remains `In Review`.
- FieldBill iOS is still not publicly available in all countries: public Apple storefront checks remain green outside the EU and blocked in the 27 EU DSA/trader-status territories.

Next action when returning to FieldBill:
- Recheck App Store Connect Business -> Compliance and public EU storefronts daily.
- If Business -> Compliance still shows DSA `In Review` on `2026-06-17`, contact Apple Developer Support case `102902060003` with the June 2 document-upload confirmation and the June 11 screenshots.
- After EU statuses clear, rerun public Apple lookup across all 175 territories and refresh the App Store Connect availability API report.
- Keep Android production promotion separate from the iOS/EU availability path.

Previous checkpoint:

Updated: 2026-06-11T15:27:00-05:00

User authorized accepting the Apple Developer Program License Agreement after the agreement review modal was opened.

Completed this pass:
- Used PC Control in the signed-in Edge session to click `Agree` on the Apple Developer Program License Agreement modal.
- Verified the Apple Developer account page no longer shows the program license agreement update card.
- Verified App Store Connect Apps page no longer shows the `Apple Developer Program License Agreement Updated` banner.
- FieldBill still shows `iOS 1.0.1 Ready for Distribution` on the App Store Connect Apps page.
- Immediate post-acceptance public Apple sample was unchanged: `us` returns FieldBill `1.0.1`; `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl` still return `0` results.
- Evidence files:
  - `C:\Projects\research\pc-control\captures\shot-20260611-151918597.png`
  - `C:\Projects\research\pc-control\captures\shot-20260611-152157792.png`
  - `C:\Projects\research\pc-control\captures\shot-20260611-152336220.png`
  - `C:\Projects\research\pc-control\captures\shot-20260611-152628096.png`

Current conclusion:
- The Apple Developer Program License Agreement update gate is cleared.
- FieldBill iOS is still not publicly available in all countries: the latest public Apple storefront check remains `148/175`, with 27 EU storefronts blocked by `TRADER_STATUS_NOT_PROVIDED`.
- Android public listing samples remain green from the latest check.

Next action when returning to FieldBill:
- Keep checking App Store Connect Business / Compliance and app availability until the 27 EU territory content statuses become `AVAILABLE`.
- After EU statuses clear, rerun public Apple lookup across all 175 territories.
- If Apple has not cleared the DSA/trader-status block by `2026-06-17`, contact Apple Developer Support case `102902060003` with the June 2 document-upload confirmation and current availability evidence.
- Keep Android production promotion separate from the iOS/EU availability path.

Previous checkpoint:

Updated: 2026-06-11T15:10:00-05:00

User had an open signed-in Edge window with App Store Connect and requested a PC Control check to see whether FieldBill is available in all countries.

Completed this pass:
- Used PC Control read-only through the authenticated Edge/App Store Connect session; no App Store Connect setting, store metadata, release action, Play Console setting, payment, ad, email, or app code changed.
- App Store Connect app list still shows FieldBill `iOS 1.0.1 Ready for Distribution`.
- App Store Connect displayed an `Apple Developer Program License Agreement Updated` banner. The account holder needs to review/accept it before future updates or new submissions; this pass did not change the agreement state.
- Authenticated App Store Connect availability API results:
  - Base endpoint `iris/v2/appAvailabilities/6762166246` shows `availableInNewTerritories=true`.
  - Territory endpoint `iris/v2/appAvailabilities/6762166246/territoryAvailabilities?limit=200` returned `175` territory rows.
  - All `175` rows have `available=true`.
  - Content status remains split: `148` rows have `AVAILABLE`; `27` EU rows still have `TRADER_STATUS_NOT_PROVIDED`.
  - The `27` EU rows are `AUT`, `BEL`, `BGR`, `CYP`, `CZE`, `DEU`, `DNK`, `ESP`, `EST`, `FIN`, `FRA`, `GRC`, `HRV`, `HUN`, `IRL`, `ITA`, `LTU`, `LUX`, `LVA`, `MLT`, `NLD`, `POL`, `PRT`, `ROU`, `SVK`, `SVN`, and `SWE`.
- Public Apple storefront lookup checked all `175` App Store Connect territories:
  - `148` storefronts return FieldBill `1.0.1`.
  - `27` storefronts return `0` results, matching the EU `TRADER_STATUS_NOT_PROVIDED` territory set.
- Public Google Play samples for `US`, `CA`, `GB`, `AU`, `DE`, `FR`, `IE`, `NL`, `ES`, `IT`, `SE`, `PL`, `BR`, `IN`, `JP`, and `ZA` all returned the FieldBill listing for `com.fieldbill.app`.
- Evidence files:
  - `C:\Projects\research\pc-control\captures\shot-20260611-145725120.png`
  - `C:\Projects\research\pc-control\captures\shot-20260611-145900057.png`
  - `C:\Projects\research\pc-control\captures\shot-20260611-150135936.png`
  - `C:\fieldbill\reports\appstoreconnect-territory-availabilities-20260611.json`
  - `C:\fieldbill\reports\apple-public-storefront-availability-20260611.json`
  - `C:\fieldbill\reports\google-play-public-sample-availability-20260611.json`

Current conclusion:
- FieldBill iOS is not publicly available in all countries yet.
- App Store Connect now marks all `175` territories `available=true`, but public Apple storefront lookup still exposes only `148/175`.
- The remaining `27` EU storefronts are still blocked by `TRADER_STATUS_NOT_PROVIDED`.
- Android public listing samples are green.

Next action when returning to FieldBill:
- Have the account holder review/accept the updated Apple Developer Program License Agreement.
- Keep checking App Store Connect Business / Compliance and app availability until the 27 EU territory content statuses become `AVAILABLE`.
- After EU statuses clear, rerun public Apple lookup across all 175 territories.
- If Apple has not cleared the DSA/trader-status block by `2026-06-17`, contact Apple Developer Support case `102902060003` with the June 2 document-upload confirmation and current availability evidence.
- Keep Android production promotion separate from the iOS/EU availability path.

Previous checkpoint:

Updated: 2026-06-04T06:23:04-05:00

Ran a read-only FieldBill DSA/EU availability refresh after Ark focus switched back to `fieldbill`.

Completed this pass:
- Public Apple lookup for app ID `6762166246`:
  - `us`: FieldBill `1.0.1`, seller `Steve Sehie`, currency `USD`.
  - `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, `pl`: `0` results.
- Public Google Play URL returned HTTP `200` and page content contains `FieldBill`: `https://play.google.com/store/apps/details?id=com.fieldbill.app&hl=en_US&gl=US`.
- Signed-in App Store Connect read-only check through existing Edge session and PC Control:
  - Apps page shows FieldBill `iOS 1.0.1 Ready for Distribution`.
  - Pricing and Availability shows `175 Countries or Regions`, App Availability `148 Available`, `27 Cannot Sell`.
  - `27 Cannot Sell` detail is still the EU country set; the availability manage table shows EU rows such as Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, and Denmark with `Trader Status Not Provided`.
  - Business page shows Free Apps Agreement active, Paid Apps Agreement active, bank account active, and U.S. Form W-9 active.
  - Business Compliance still shows `Digital Services Act`, `27 Countries or Regions`, last updated `May 28, 2026`, status `In Review`.
- Local dependency/check refresh:
  - Installed package versions now match Expo Doctor expectations: `expo@54.0.35`, `expo-font@14.0.12`, `expo-router@6.0.24`.
  - Split verification passed: `npx tsc --noEmit`, `npm run lint`, `npx expo-doctor` (`18/18`), and `npm run preflight:tester`.
  - Combined `npm run check:tester-release` timed out in this shell, but the underlying steps completed cleanly when run separately.
- Screenshot evidence:
  - `C:\Projects\research\pc-control\captures\shot-20260604-061736187.png`
  - `C:\Projects\research\pc-control\captures\shot-20260604-061927852.png`
  - `C:\Projects\research\pc-control\captures\shot-20260604-062118600.png`
  - `C:\Projects\research\pc-control\captures\shot-20260604-062213721.png`
- No app code, store metadata, App Store Connect settings, Play Console settings, release actions, ads, payments, or emails were changed.

Current conclusion:
- FieldBill iOS `1.0.1`, first IAP, paid agreements, bank, tax, and U.S. public listing remain green.
- EU distribution is still not production-green: public EU storefronts still return `0` results, App Availability still shows `27 Cannot Sell`, EU rows still show `Trader Status Not Provided`, and Business Compliance DSA remains `In Review`.
- Android public Play listing remains reachable.
- The previous Expo patch-level local release-check blocker appears resolved; keep the combined script timeout as a shell/runtime caveat, not a failing subcheck.

Next action when returning to FieldBill:
- Continue checking App Store Connect Business / Compliance until Digital Services Act clears from `In Review`.
- After DSA clears, recheck Pricing and Availability for zero EU `Cannot Sell` rows and rerun public Apple lookups for `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl`.
- If Apple has not cleared the DSA review by `2026-06-17`, contact Apple Developer Support for case `102902060003` with the June 2 upload confirmation and current screenshots.
- Keep Android production promotion separate from the iOS/EU availability path.

Previous checkpoint:

Updated: 2026-06-01T17:35:00-05:00

Ran a full FieldBill store-health pass after switching Ark focus to `fieldbill`.

Completed this pass:
- Switched AgentArch active project to `fieldbill` with `aa-switch fieldbill`; `aa-where` confirmed path `C:\fieldbill`.
- Public Apple lookup for app ID `6762166246`:
  - `us`: FieldBill `1.0.1`, seller `Steve Sehie`, currency `USD`.
  - `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, `pl`: `0` results.
- Public Google Play URL returned HTTP `200` and page content contains `FieldBill`: `https://play.google.com/store/apps/details?id=com.fieldbill.app&hl=en_US&gl=US`.
- Signed-in App Store Connect read-only check through the existing Edge window and PC Control:
  - iOS app page shows `iOS App Version 1.0.1` and left rail `1.0.1 Ready for Distribution`.
  - Pricing and Availability shows `175 Countries or Regions`, app availability `148 Available`, `27 Cannot Sell`.
  - In-App Purchases shows `Approved (1)`: `FieldBill Pro Lifetime`, product ID `fieldbill_pro_lifetime`, type `Non-Consumable`, status `Approved`.
  - Business page shows Free Apps Agreement active, Paid Apps Agreement active, bank account `chime (9177)` active, and U.S. Form W-9 active.
  - Compliance still shows `Digital Services Act`, `27 Countries or Regions`, last updated `May 28, 2026`, status `In Review`.
- Screenshot evidence:
  - `C:\Projects\research\pc-control\captures\shot-20260601-173044557.png`
  - `C:\Projects\research\pc-control\captures\shot-20260601-173241317.png`
  - `C:\Projects\research\pc-control\captures\shot-20260601-173334287.png`
  - `C:\Projects\research\pc-control\captures\shot-20260601-173421490.png`
  - `C:\Projects\research\pc-control\captures\shot-20260601-173504470.png`
- Local `git status --short` remains dirty with existing app/docs/promo changes.
- `npm run check:tester-release` failed in Expo Doctor package-version validation:
  - `expo` expected `~54.0.35`, found `54.0.34`.
  - `expo-font` expected `~14.0.12`, found `14.0.11`.
  - `expo-router` expected `~6.0.24`, found `6.0.23`.
- No app code, store metadata, App Store Connect settings, Play Console settings, release actions, ads, or emails were changed.

Current conclusion:
- FieldBill iOS `1.0.1` and first IAP are green for non-EU production: app version is ready/distributed, IAP is approved, paid agreement/bank/tax are active, and U.S. public lookup returns `1.0.1`.
- EU distribution remains blocked by Apple account-level DSA review: App Store Connect still shows `27 Cannot Sell` and DSA `In Review`; sampled EU public storefronts still return `0` results.
- Android public Play listing remains reachable.
- Local tester-release check is not green until the Expo patch-level package mismatch is fixed.

Next action when returning to FieldBill:
- Decide whether to run `npx expo install --check` / patch-level dependency alignment for `expo`, `expo-font`, and `expo-router`, then rerun `npm run check:tester-release`.
- Continue checking App Store Connect Business / Compliance until DSA clears from `In Review`.
- After DSA clears, recheck Pricing and Availability for zero EU `Cannot Sell` rows and rerun public Apple lookups for `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl`.
- If Apple has not cleared the DSA review by `2026-06-17`, contact Apple Developer Support with the captured evidence.
- Keep Android production promotion separate from the iOS/EU availability path.

Previous checkpoint:

Updated: 2026-05-31T15:31:34-05:00

Attempted to complete the FieldBill EU/DSA block in signed-in App Store Connect.

Completed this pass:
- Restarted the token-protected PC Control helper and used the signed-in Edge/App Store Connect session.
- Reopened FieldBill App Information / App Store Regulations & Permits / Digital Services Act.
- The app-specific DSA modal already has `This is a trader app` selected; `Next` is disabled because there is no app-specific change to save.
- Reopened App Store Connect Business / Agreements / Compliance.
- Account-level `Digital Services Act` still shows `27 Countries or Regions`, last updated `May 28, 2026`, status `In Review`.
- Clicking the country/region `View` link only opens the EU country list; clicking the row/status exposes no edit or submit action.
- No App Store Connect setting was changed because the remaining control is Apple compliance review.

Current conclusion:
- FieldBill iOS `1.0.1` and first IAP remain production-ready outside the EU block.
- EU distribution is still not production-green because Apple account-level DSA review is still `In Review`.
- This is no longer a local code/build/store-metadata task; App Store Connect does not expose a further action while the DSA compliance row is in review.

Next action when returning to FieldBill:
- Recheck App Store Connect Business / Agreements / Compliance for Digital Services Act status.
- Recheck FieldBill Pricing and Availability until the EU `27 Cannot Sell` rows clear.
- If Apple has not cleared the DSA review by `2026-06-17`, contact Apple Developer Support with screenshots showing app-specific trader status selected and account-level DSA still `In Review`.
- After DSA clears, re-run public Apple lookups for at least `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl`.
- Keep Android production promotion separate from the iOS/EU availability path.

Previous checkpoint:

Updated: 2026-05-31T15:07:08-05:00

Verified FieldBill DSA / EU availability state in signed-in App Store Connect.

Completed this pass:
- Restarted the token-protected PC Control helper and used the signed-in Edge/App Store Connect session for read-only inspection.
- App Information / App Store Regulations & Permits shows the Digital Services Act text: `This developer has identified itself as a trader for this app.`
- Pricing and Availability shows FieldBill app availability as `148 Available` and `27 Cannot Sell`.
- The `27 Cannot Sell` detail is the EU country set; visible rows include Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, and Denmark.
- EU rows show `Trader Status Not Provided`.
- The `View` tooltip says trader status is required for App Store distribution in the European Union.
- Public Apple lookup returns FieldBill `1.0.1` in the U.S.; sampled EU storefronts `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl` return `0` results.
- Screenshot evidence: `C:\Projects\research\pc-control\captures\shot-20260531-150200706.png`, `C:\Projects\research\pc-control\captures\shot-20260531-150417598.png`, `C:\Projects\research\pc-control\captures\shot-20260531-150537764.png`, and `C:\Projects\research\pc-control\captures\shot-20260531-150615645.png`.
- No App Store Connect state-changing action was taken.

Current conclusion:
- FieldBill iOS `1.0.1` and first IAP are production-ready outside the blocked EU set.
- EU distribution is not production-green: App Store Connect still says `Trader Status Not Provided` for the 27 EU countries or regions.
- Do not treat DSA/EU availability as complete until those 27 rows clear and public EU storefront lookups return the app.

Next action when returning to FieldBill:
- In App Store Connect, resolve the EU `Trader Status Not Provided` path under app availability / DSA trader status.
- After making any Apple-side change, recheck Pricing and Availability until EU rows no longer show `Cannot Sell`.
- Re-run public Apple lookups for at least `de`, `fr`, `ie`, `nl`, `es`, `it`, `se`, and `pl`.
- Keep Android production promotion separate from the iOS/EU availability path.

Previous checkpoint:

Updated: 2026-05-30T03:31:27-05:00

Verified FieldBill `1.0.1` approval, IAP approval, and TestFlight purchase unlock.

Completed this pass:
- Direct signed-in App Store Connect app list shows FieldBill `iOS 1.0.1 Ready for Distribution`.
- Direct signed-in App Store Connect version page shows `iOS App Version 1.0.1` and `1.0.1 Ready for Distribution`.
- Direct signed-in App Store Connect In-App Purchases page shows `Approved (1)`.
- IAP `FieldBill Pro Lifetime` / product ID `fieldbill_pro_lifetime` / type `Non-Consumable` is `Approved`.
- Screenshot evidence: `C:\Projects\research\pc-control\captures\shot-20260530-032837214.png`, `C:\Projects\research\pc-control\captures\shot-20260530-032941247.png`, and `C:\Projects\research\pc-control\captures\shot-20260530-033008869.png`.
- Operator tested on TestFlight: version `1.0.1` came in and purchase unlock worked.
- Stopped the PC Control helper after the check; port `8787` is no longer listening.
- No App Store Connect state-changing action was taken.

Current conclusion:
- FieldBill iOS `1.0.1` is App Review approved and App Store Connect ready for distribution.
- First IAP `fieldbill_pro_lifetime` is approved.
- TestFlight purchase unlock path works for `1.0.1`.
- Remaining check: public App Store propagation/release state and DSA status.

Next action when returning to FieldBill:
- Check public App Store lookup until it reports version `1.0.1`, or confirm release timing/settings in App Store Connect.
- Retest public/install path after propagation if needed.
- Keep Android production promotion separate from the iOS monetization path.

Previous checkpoint:

Updated: 2026-05-30T03:24:37-05:00

Checked Apple review status for FieldBill `1.0.1`.

Completed this pass:
- Gmail found a new App Store Connect email from `2026-05-30T02:55:43Z`: `Review of your FieldBill (iOS) submission is complete.`
- Apple says review of submission `612917e4-30f5-4240-a241-099bd6075046` is completed and eligible for distribution.
- Accepted item: App Version `1.0.1` for iOS.
- Public Apple lookup for app ID `6762166246` still reports live production version `1.0`, current version release date `2026-05-21T22:10:37Z`.
- Tried direct App Store Connect review-submission page through PC Control, but Edge redirected to App Store Connect login; fresh Apple sign-in is needed for direct page inspection.
- Stopped the PC Control helper after the check; port `8787` is no longer listening.
- No App Store Connect state-changing action was taken.

Current conclusion:
- Apple review for FieldBill iOS `1.0.1` is approved/completed by email evidence.
- `1.0.1` is not publicly live yet in Apple's public lookup; public App Store still shows `1.0`.
- Next likely gates are release/propagation state, first IAP propagation, DSA status, and TestFlight/sandbox purchase + restore retest.

Next action when returning to FieldBill:
- Sign in to App Store Connect and inspect whether `1.0.1` is ready to release, pending developer release, or propagating.
- Check IAP `fieldbill_pro_lifetime` status after the app-version approval.
- Retest sandbox/TestFlight purchase and restore after Apple state propagates.
- Keep Android production promotion separate from the iOS monetization path.

Previous checkpoint:

Updated: 2026-05-29T15:36:17-05:00

Rechecked FieldBill App Store Connect after the operator signed in again.

Completed this pass:
- Restarted the token-protected PC Control helper from `C:\Projects\research\pc-control`.
- Focused the open Edge/App Store Connect session and loaded the FieldBill iOS version page.
- Direct signed-in App Store Connect page shows `iOS App Version 1.0.1`.
- Left-side iOS app status shows `1.0.1 Waiting for Review`.
- The prior live version remains `1.0 Ready for Distribution`.
- The page banner says the version is still waiting for review and only limited edits are available unless the version is removed from review.
- Screenshot evidence: `C:\Projects\research\pc-control\captures\shot-20260529-153557677.png`.
- No App Store Connect state-changing action was taken.

Current conclusion:
- Apple has not approved FieldBill iOS `1.0.1` yet.
- Current signed-in App Store Connect state is still `Waiting for Review`.
- Existing public production version remains `1.0`.

Next action when returning to FieldBill:
- Continue watching App Store Connect/email for `1.0.1` review completion.
- After approval, verify first IAP propagation and retest TestFlight/sandbox purchase + restore.
- Keep Android production promotion separate from the iOS monetization path.

Previous checkpoint:

Updated: 2026-05-29T15:30:47-05:00

Checked whether Apple had approved the newer FieldBill iOS version.

Completed this pass:
- Started the token-protected PC Control helper from `C:\Projects\research\pc-control` and used it to drive the open Edge/App Store Connect tab.
- Navigated Edge from Apple's public App Store Connect page to the FieldBill deep link: `https://appstoreconnect.apple.com/apps/6762166246/appstore/ios/version/inflight`.
- Apple redirected to the App Store Connect login page with `authResult=FAILED`; the current Edge session is not authenticated for App Store Connect.
- Public Apple lookup for app ID `6762166246` still reports FieldBill production version `1.0`, bundle `com.fieldbill.app`, current version release date `2026-05-21T22:10:37Z`.
- Gmail search found no recent App Review completion/approval/rejection email for FieldBill `1.0.1`; latest relevant recent Apple messages are Paid Apps Agreement acceptance (`2026-05-29T10:47:13Z`), DSA receipt (`2026-05-28T19:43:35Z`), and TestFlight availability for `1.0.1 (8)` (`2026-05-26T11:09:54Z`).
- Stopped the PC Control helper after the check; port `8787` is no longer listening.
- No App Store Connect credentials were entered, and no App Store Connect state-changing action was taken.

Current conclusion:
- Apple approval for `1.0.1` is not confirmed.
- Publicly live App Store version remains `1.0`; there is no email evidence that `1.0.1` has completed review.
- Direct App Store Connect status needs a fresh manual Apple sign-in/2FA in Edge.

Next action when returning to FieldBill:
- Sign in to App Store Connect in Edge, then re-run the direct PC Control check against the FieldBill iOS `1.0.1` version page.
- Continue watching email for `1.0.1` App Review completion and DSA status.
- Keep Android production promotion separate from the iOS monetization path.

Previous checkpoint:

Updated: 2026-05-29T06:11:22-05:00

Rechecked FieldBill App Store Connect after operator completed the remaining Apple business info.

Completed this pass:
- Restarted the token-protected PC Control helper from `C:\Projects\research\pc-control` and used the signed-in Edge/App Store Connect session for read-only inspection.
- Business/Agreements page now shows Paid Apps Agreement `Active`, bank account `chime (9177)` `Active`, and `U.S. Form W-9` submitted `May 29, 2026` with status `Active`.
- DSA remains `In Review`, last updated `May 28, 2026`, for `27 Countries or Regions`.
- App Store Connect app list/version page still shows iOS `1.0.1` as `Waiting for Review`; iOS `1.0` remains `Ready for Distribution`.
- TestFlight still shows version `1.0.1`, build `8`, upload `Complete`, build status `Ready to Submit`, internal group `Team (Expo)`, `1` invite, `2` installs, `16` sessions, no crashes/feedback.
- Authenticated App Store Connect API confirms IAP `FieldBill Pro Lifetime` / `fieldbill_pro_lifetime` / Apple ID `6773188154` remains `WAITING_FOR_REVIEW`, `isAppStoreReviewInProgress: true`.
- Authenticated App Store Connect API confirms review submission `612917e4-30f5-4240-a241-099bd6075046` for iOS `1.0.1` remains `WAITING_FOR_REVIEW`; submitted `2026-05-28T03:01:29.324Z`.
- Stopped the PC Control helper after the recheck; port `8787` is no longer listening and `control\stop.flag` is present.
- No build, release, App Review action, or IAP purchase was started.

Current conclusion:
- Existing iOS production app is live as free version `1.0`.
- The Paid Apps Agreement/bank/tax blocker is now cleared.
- Remaining visible gates are Apple review for `1.0.1` and first IAP, DSA review, and a fresh TestFlight/sandbox purchase + restore retest after Apple state propagates.

Next action when returning to FieldBill:
- Watch App Store Connect/email for `1.0.1` review completion.
- Wait for/verify DSA approval.
- Try the iPhone TestFlight upgrade path again after a propagation window; if it still shows no products, wait for Apple to finish `1.0.1`/first-IAP review and retest purchase/restore.
- Keep Android production promotion separate from the iOS monetization path.

Previous checkpoint:

Updated: 2026-05-29T05:45:52-05:00

Signed the Apple Paid Apps Agreement for FieldBill after operator completed 2FA and requested the agreement action.

Completed this pass:
- Used the token-protected PC Control helper from `C:\Projects\research\pc-control` against the logged-in Edge/App Store Connect session.
- Confirmed the legal entity update had cleared enough for the Paid Apps Agreement action to appear.
- Opened `View and Agree to Terms`, checked the agreement checkbox, and clicked `Agree`.
- Apple accepted the signing action. Paid Apps Agreement now shows effective dates `May 29, 2026 - Mar 27, 2027` with status `Pending User Info`.
- App Store Connect now prompts for `Add Bank Account` and `Add Tax Info`; the tax row shows `U.S. Form W-9` with status `Missing Tax Info`.
- DSA remains `In Review`, last updated `May 28, 2026`, for `27 Countries or Regions`.
- Stopped the PC Control helper after the pass; port `8787` is no longer listening and `control\stop.flag` is present.
- No bank account, tax form, build, release, App Review action, or IAP purchase was started.

Current conclusion:
- Existing iOS production app is live as free version `1.0`.
- The Paid Apps Agreement signing step is done, but the paid/IAP path is still not production-ready.
- Remaining blockers are Apple bank account setup, U.S. W-9 tax info, DSA approval, `1.0.1`/first-IAP review completion, and a fresh TestFlight/sandbox purchase + restore retest.

Next action when returning to FieldBill:
- Watch App Store Connect/email for `1.0.1` review completion.
- Have the operator complete Apple bank account and U.S. W-9 tax info in App Store Connect.
- Wait for/verify DSA approval.
- After Apple review/DSA/business user info state allows the first IAP to propagate, retest iPhone TestFlight/sandbox purchase and restore.
- Keep Android production promotion separate from the iOS monetization path.

Previous checkpoint:

Updated: 2026-05-29T04:53:11-05:00

Rechecked FieldBill iOS/App Store Connect live state using PC Control after operator logged in.

Completed this pass:
- Started the PC Control loopback helper from `C:\Projects\research\pc-control` after removing its local `control\stop.flag`.
- Used the helper for read-only Edge/CDP inspection of the logged-in App Store Connect session.
- Confirmed live iOS version state: `1.0.1` is `Waiting for Review`; `1.0` remains `Ready for Distribution`.
- Confirmed version `1.0.1` has build `8` / `1.0.1` attached and remains editable only within Apple's waiting-for-review limits.
- Confirmed first IAP is in review: `FieldBill Pro Lifetime`, product ID `fieldbill_pro_lifetime`, non-consumable, status `Waiting for Review`.
- Confirmed App Review submissions page: `iOS 1.0.1`, submitted Wednesday at `10:01 PM` by `Steven Sehie`, `1 Item`, status `Waiting for Review`; prior `iOS 1.0` is `Review Completed`.
- Confirmed TestFlight: version `1.0.1`, build `8`, upload status `Complete`, build status `Ready to Submit`, internal group `Team (Expo)`, `1` invite, `2` installs, `16` sessions, no crashes/feedback shown.
- Confirmed Apple Business/Agreements state did not clear: Free Apps Agreement `Active`, Paid Apps Agreement `New`, and App Store Connect still requires legal entity information before signing the Paid Apps Agreement.
- Confirmed DSA remains `In Review`, last updated `May 28, 2026`, for `27 Countries or Regions`.
- No build, release, App Review action, Paid Apps Agreement signing, legal entity edit, or IAP purchase was started.

Current conclusion:
- Existing iOS production app is live as free version `1.0`.
- The `1.0.1` version plus first IAP is correctly submitted and waiting for Apple review.
- It is not production-ready for paid/IAP launch until review completes and the Business/Agreements gates clear.

Next action when returning to FieldBill:
- Watch App Store Connect/email for `1.0.1` review completion.
- Finish Apple legal entity/Paid Apps Agreement work after operator approval.
- Wait for/verify DSA approval.
- After Apple review/DSA/Paid Apps Agreement state allows the first IAP to propagate, retest iPhone TestFlight/sandbox purchase and restore.
- Keep Android production promotion separate from the iOS monetization path.

Previous checkpoint:

Updated: 2026-05-29T04:40:42-05:00

Checked current iOS/App Store production readiness.

Completed this pass:
- Verified live App Store Connect Business/Agreements page through the existing Edge remote-debug session.
- Observed the same Apple monetization blocker: legal entity information must be updated before signing the Paid Apps Agreement.
- Agreements state observed: Free Apps Agreement `Active`; Paid Apps Agreement `New`.
- DSA compliance state observed: `Digital Services Act` last updated `May 28, 2026`, status `In Review`, for `27 Countries or Regions`.
- Tried direct App Store Connect app pages for iOS version, TestFlight, In-App Purchases, and App Information; all redirected to Apple login with `authResult=FAILED`, so fresh Apple login/2FA is needed for direct version/review inspection.
- Gmail check found the latest App Store Connect mail after submission is the DSA receipt email from `2026-05-28T19:43:35Z`; no newer `1.0.1` App Review completion email was found.
- Public App Store URL returns HTTP `200`, but Apple's public lookup still reports FieldBill production version `1.0`, bundle `com.fieldbill.app`, free, current version release date `2026-05-21T22:10:37Z`.
- Public TestFlight link returns HTTP `200` and shows the FieldBill beta join page.
- EAS build list confirms latest iOS store build `41fe864d-a2c7-4d69-97a6-cfe338250277` finished as app version `1.0.1`, build `8`, production/store profile.
- No build, release, App Review action, Paid Apps Agreement signing, legal entity edit, or IAP purchase was started.

Current conclusion:
- Existing iOS production app is live as free version `1.0`.
- The `1.0.1` monetized/IAP path is not production-green yet.

Next action when returning to FieldBill:
- Fresh-login to App Store Connect and directly inspect iOS `1.0.1` App Review status.
- Finish Apple legal entity/Paid Apps Agreement work after operator approval.
- Wait for/verify DSA approval.
- After Apple review/DSA/Paid Apps Agreement state allows the first IAP to propagate, retest iPhone TestFlight/sandbox purchase and restore.
- Keep Android production promotion separate from the iOS monetization path.

Previous checkpoint:

Updated: 2026-05-28T14:43:00-05:00

Completed Apple DSA trader compliance submission for FieldBill.

Completed this pass:
- Checked App Store Connect: iOS `1.0.1` is still `Waiting for Review`; iOS `1.0` remains `Ready for Distribution`.
- Opened FieldBill `App Information` / Business compliance and selected trader status under the Digital Services Act.
- Entered public trader contact details: `419 W 5th Ave, El Dorado, KS 67042-1828, United States`, `+1 (316) 323-8649`, and `ssehiedeveloper@gmail.com`.
- Verified the DSA email code from devphone Gmail and the phone code supplied by the operator.
- Uploaded `C:\Projects\images\Apple_Verification_ID.pdf` for both name and address identification document prompts.
- Confirmed the public contact information. App Store Connect now shows `Digital Services Act` status `In Review`, last updated `May 28, 2026`, for `27 Countries or Regions`.
- No Android Play release controls, EAS build, App Review release control, paid tester order, or in-app purchase was started.

Next action when returning to FieldBill:
- Watch Apple DSA status and iOS `1.0.1` App Review result.
- Address the remaining visible Apple monetization blocker: update legal entity information before signing the Paid Apps Agreement.
- After Apple review/DSA/Paid Apps Agreement state allows the first IAP to propagate, retest the iPhone TestFlight/sandbox purchase sheet and restore path.
- Keep Android production promotion separate from the iOS monetization path.

Previous checkpoint:

Updated: 2026-05-27T22:02:00-05:00

Submitted iOS App Store version `1.0.1` for Apple review with the first IAP attached.

Completed this pass:
- Resumed the signed-in Edge App Store Connect session through the Ark PC Control helper.
- Cleared Apple's required-field blocker by filling `What's New in This Version` with: `Adds App Store metadata and screenshot updates for the initial FieldBill release.`
- Saved the App Store version metadata.
- Clicked `Add for Review`; App Store Connect opened the draft submission panel and showed `iOS App 1.0.1` as ready to submit.
- Clicked `Submit for Review`.
- Verified App Store Connect confirmation: `1 Item Submitted`; Apple says review can take up to 48 hours.
- No Android Play production state, EAS build, release control, paid tester order, or in-app purchase was started.

Next action when returning to FieldBill:
- Watch App Store Connect/email for iOS review result for version `1.0.1` and first IAP propagation.
- After Apple review/submission status allows the first IAP to propagate, retest the iPhone TestFlight/sandbox purchase sheet and restore path.
- Keep Android production promotion separate from the iOS review path.

Previous checkpoint:

Updated: 2026-05-27T21:14:46-05:00

Fixed the App Store Connect version-side attachment for the first iOS IAP.

Completed this pass:
- Inspected the user's iPhone screenshot at `C:\Projects\images\error.jpg`; it shows `FieldBill Pro`, `Unlock Pro $29.99`, and RevenueCat's StoreKit product-fetch failure for App Store Connect products.
- Used the signed-in Chrome App Store Connect session for FieldBill; no Android Play production settings were touched.
- Found the live Apple blocker on the App Store Connect IAP page: the first in-app purchase must be submitted with a new app version and selected from that version's `In-App Purchases and Subscriptions` section before App Review.
- Confirmed `FieldBill Pro Lifetime` / product ID `fieldbill_pro_lifetime` / Apple ID `6773188154` is `Ready to Submit`, non-consumable, available in all countries or regions, and has pricing configured.
- Created iOS App Store version `1.0.1` in `Prepare for Submission`.
- Attached TestFlight/App Store build `8` / version `1.0.1` to the new App Store version.
- Attached `FieldBill Pro Lifetime` / `fieldbill_pro_lifetime` to version `1.0.1` under `In-App Purchases and Subscriptions`.
- Saved the version after the build and IAP attachment.
- Did not click `Add for Review`, submit to App Review, release the app, start a new EAS build, start a paid tester order, or complete an in-app purchase.

Next action when returning to FieldBill:
- Decide whether to submit iOS App Store version `1.0.1` plus the first IAP for App Review. The version now has build `8` and `fieldbill_pro_lifetime` attached.
- Before clicking review submission, check any required missing metadata such as `What's New in This Version`; `Add for Review` may surface validation issues.
- After Apple review/submission status allows the first IAP to propagate, retest the iPhone TestFlight/sandbox purchase sheet and restore path.
- Keep Android production untouched; current Android production release remains the live promotion target.

Previous checkpoint:

Updated: 2026-05-27T07:07:57-05:00

Checked the Android production release in the signed-in PC Edge Play Console.

Completed this pass:
- Reopened the PC Edge Play Console session with local debug access only for inspection; no release controls, rollout controls, App Review actions, paid ads, or store changes were clicked.
- Play Console production track for FieldBill now shows `Active`.
- Latest production release is `11 (1.0.0)` for `Phones, Tablets, Chrome OS, Android XR`.
- Production track summary shows `177 countries / regions` and `11 installs`.
- Release dashboard is scoped to `Release: Most recent (11 (1.0.0))`.
- Play Console shows `2 actions recommended`: deprecated edge-to-edge APIs/parameters, and resizability/orientation restrictions for large-screen support. These are user-experience recommendations, not current release blockers.
- Gmail has an IARC `Live Rating Notice: FieldBill` dated Wednesday, May 27, 2026 for storefront `Google Play`, which is another live-storefront signal.
- Public Play URL check returned HTTP `200`, title `FieldBill - Apps on Google Play`, and did not show a not-found page:
  `https://play.google.com/store/apps/details?id=com.fieldbill.app&hl=en_US&gl=US`

Next action when returning to FieldBill:
- Android production is live enough to promote publicly. Continue the free promotion lane using the Play URL or the GitHub Pages Android landing page.
- Keep logging public posts and outreach in `docs/worldwide-outreach-log.csv`; only mark public-forum rows posted after a real public URL exists.
- Do not spend another iOS EAS build until the Apple/RevenueCat StoreKit product-fetch problem is fixed or explicitly approved.
- Optional Android cleanup later: address Play Console's two UX recommendations for edge-to-edge and large-screen resizability/orientation.

Previous checkpoint:

Updated: 2026-05-26T15:35:42-05:00

Prepared the no-build Android advertising path.

Completed this pass:
- Recovered after the lost FieldBill adverts connection by reading this startup file, `PROJECT-STATUS.md`, `docs/free-advertising-kit.md`, `docs/worldwide-android-campaign.md`, and `docs/worldwide-outreach-log.csv`.
- Confirmed the prior pass had 20 logged Gmail advert/outreach sends.
- Sent 10 additional individual Gmail adverts from `ssehie@gmail.com` using the documented feedback-focused Android copy.
- New recipients: `office@shawneeelectric.com`, `totalelectric@totalelectco.com`, `morriselectricalservice@gmail.com`, `operations@816SOLARPROS.COM`, `ADMIN@AAELECTRICALINC.COM`, `JStapleton@AidenMorrisElectric.com`, `office@arrowcircleelectric.com`, `permits@bearpawelectric.com`, `contact@bickimerelectric.com`, `caseyelectricinc@sbcglobal.net`.
- Logged the new 10 sent adverts in `docs/worldwide-outreach-log.csv` with Gmail SENT message IDs.
- Created `docs/public-forum-advert-posting.md` with paste-ready public forum copy, allowed-advert Reddit targets, and a free directory queue.
- Created `docs/public-forum-100-adverts.csv` with 100 public forum/directory advert placements: 78 ready, 13 needing rule checks, 5 needing current thread lookup, and 4 low-fit fallbacks.
- Put the full Reddit comment on the Windows clipboard and opened the top Reddit targets in the default browser for logged-in posting.
- Added the public forum / allowed advert thread lane to `docs/worldwide-android-campaign.md`.
- User then asked for 100 more in different countries, interrupted once, then resumed with `proceed`; created `docs/public-forum-100-country-adverts.csv`.
- The second queue has 100 country-targeted placements: 30 ready, 32 needing rule checks, and 38 needing current allowed-thread lookup.
- Current git worktree is intentionally dirty from FieldBill iOS monetization docs/code, Android promotion docs, the 100-placement public advert queue, and handoff updates.
- Sent 20 live FieldBill Android advert/outreach emails from connected Gmail account `ssehie@gmail.com` to targeted public contractor/trade contacts already present in `docs/tester-outreach-targets.csv`.
- Verified Gmail sent-mail search for subject `FieldBill Android invoice app feedback` returned 20 message IDs from this pass.
- Logged the 20 sent adverts in `docs/worldwide-outreach-log.csv` with message IDs.
- Created `docs/free-advertising-kit.md` for free promotion of the already-tested Android build.
- After user approved full-force worldwide Android promotion, added `docs/worldwide-android-campaign.md`, `docs/worldwide-outreach-log.csv`, and `docs/android/index.html`.
- Copied `assets/store/phone-screenshots/contact-sheet.png` into `docs/assets/store/phone-screenshots/contact-sheet.png` for the Android landing page.
- Kept the target on the existing known-good Android package `com.fieldbill.app` and Play URL `https://play.google.com/store/apps/details?id=com.fieldbill.app`.
- Added copy for direct local outreach, Facebook groups, Reddit, Product Hunt, maker communities, app directories, and existing tester/contact lists.
- Added promotion guardrails: no bought installs/reviews, no incentivized ratings, no keyword stuffing, no fake ranking claims, and no unsolicited bulk SMS.
- Looked up current Google Play promotion/store-listing policy, Reddit self-promotion limits, and Product Hunt launch references and recorded them in the campaign docs.
- Public search currently surfaces `fieldbill.app`, which appears to be a different product; use only the Play package URL and GitHub Pages URL unless domain ownership is verified.
- Verified local references in `docs/android/index.html`; privacy, terms, Play URL, and screenshot asset paths resolve.
- No Android build, Play rollout, paid ad buy, bulk SMS, App Review action, or release action was started. The only live promotion action was the 30 individual Gmail outreach sends.

Next action when returning to FieldBill:
- Resume from `docs/public-forum-100-adverts.csv`: post only where logged-in browser/session allows it, and only mark rows posted after a real public URL exists.
- Work down `docs/public-forum-100-country-adverts.csv` after the first queue or in parallel; do not mark country rows posted until a real public URL exists.
- Check Gmail for replies/bounces to the 30 total Android advert/outreach sends.
- Confirm the Play production/public listing link opens before posting publicly.
- If posting to Facebook or Reddit, check each group/subreddit rules first and use the feedback-focused copy in the kit.
- Keep the older iOS StoreKit/TestFlight issue separate; do not spend another iOS build until explicitly approved.

Previous checkpoint:

Updated: 2026-05-26T07:54:01-05:00

Switching context from FieldBill to RF Watch / Tricorder trip prep.

Completed this pass:
- Preserved the current iOS monetization stop point in this file and `PROJECT-STATUS.md`.
- FieldBill diagnosis remains: RevenueCat offering is live, but Apple StoreKit/TestFlight sandbox is not returning the App Store Connect product.
- Current code/docs worktree is intentionally dirty with the iOS Pro visibility patches, RevenueCat/App Store diagnosis notes, and prior version/build metadata.
- `npm run check:tester-release` passed after the latest FieldBill patches; `git diff --check` only reported expected CRLF warnings.
- No new EAS build, App Review action, release, paid tester order, or in-app purchase was started after the screenshot follow-up.

Next action when returning to FieldBill:
- Fix/check App Store Connect first: product `fieldbill_pro_lifetime`, bundle `com.fieldbill.app`, Paid Apps Agreement, tax, banking, product price, availability, IAP status, and Apple sandbox propagation.
- Only after that, ask for explicit approval before spending another EAS iOS build to get the Home `FieldBill Pro` visibility patch into TestFlight.

Previous checkpoint:

Updated: 2026-05-26T07:34:25-05:00

Captured the follow-up iPhone report: after reaching the upgrade path and choosing the free/trial path, returning Home made the upgrade path disappear again in the installed TestFlight build.

Completed this pass:
- Researched the RevenueCat/App Store error against primary docs. RevenueCat's empty-offerings path matches the screenshot: the SDK gets identifiers from RevenueCat, then StoreKit on-device must fetch the actual product from App Store Connect; if Apple cannot return the product, the app has no purchasable package.
- Apple docs confirm TestFlight IAP uses sandbox, Paid Apps Agreement/tax/banking are required to offer IAP, product IDs must match the app/bundle, and sandbox metadata changes can take up to 1 hour.
- Called RevenueCat public offerings API with the iOS public SDK key. It returned `current_offering_id: default` and package `$rc_lifetime` with `platform_product_identifier: fieldbill_pro_lifetime`, so RevenueCat is serving the expected offering/product identifier.
- Patched `app/(tabs)/index.tsx` again so the `FieldBill Pro` action is immediately under the primary Home action for configured monetized builds, before draft/history actions. This makes the route harder to lose after `Keep Free Trial` / back-to-free navigation when StoreKit has no package.
- The installed TestFlight build `1.0.1 (8)` still does not include this Home visibility/action-order patch.

Next action:
- Fix the live StoreKit product fetch first: App Store Connect `fieldbill_pro_lifetime` under bundle `com.fieldbill.app`, Paid Apps Agreement, tax, banking, price, availability, IAP status, and Apple sandbox propagation.
- After the Apple/RevenueCat setup is corrected, ask for explicit approval before spending another EAS iOS build so the Home upgrade-path patch reaches TestFlight.
- Do not click App Review submit/release. The first IAP still needs the app-version review path only after explicit approval.

Cost:
- No new build, paid tester order, App Review submission, release, or in-app purchase was started during this pass.

Previous checkpoint:

Updated: 2026-05-26T07:27:00-05:00

Inspected the user's iPhone screenshot at `C:\Users\ssehie\OneDrive\Desktop\error.jpg`.

Completed this pass:
- Screenshot SHA256: `01E7DF47F41085F7F9B89C8E77858D18114D4AE69CAB5F214DBBACACD39AA33E`.
- The screenshot shows the existing `fieldbill://upgrade` path reached `FieldBill Pro`.
- RevenueCat/App Store error shown on-device: `There is an issue with your configuration... None of the products registered in the RevenueCat dashboard could be fetched from App Store Connect... https://rev.cat/why-are-offerings-empty`.
- The installed iOS build has the RevenueCat Apple SDK key, and EAS production env still has monetization `true`, Apple key `appl_MIVjCmUjykCdBmvVcYIKWyBeWxv`, entitlement `pro`, and offering `default`.
- Diagnosis: this is no longer a missing app API key or missing Pro route. StoreKit/RevenueCat cannot fetch the App Store Connect product registered in the RevenueCat offering.
- Patched `app/upgrade.tsx` so the next build says `Store product is not available yet` when the app is configured but no App Store package loads, instead of the misleading `Add the RevenueCat key and product` message.
- Reran `npm run check:tester-release`; TypeScript, lint, Expo Doctor, and FieldBill preflight passed. Expected warnings remain local EAS versioning, no local `.env`, and dirty working tree.

Next action:
- Recheck live App Store Connect for `fieldbill_pro_lifetime`: product ID exactly matches RevenueCat, product belongs to app `6762166246` / bundle `com.fieldbill.app`, status is still `Ready to Submit`, availability/price are set, and Agreements/Tax/Banking/Paid Apps Agreement are not blocking StoreKit.
- Recheck RevenueCat `fieldbill (App Store)` app and offering `default`: App Store product `fieldbill_pro_lifetime` is attached to entitlement `pro` and package `$rc_lifetime`; credentials are still valid.
- Do not spend another EAS iOS build until the Apple/RevenueCat product-fetch problem is corrected or the user explicitly approves a build for the Home/Pro UI wording patches.
- Do not click App Review submit/release. The first IAP still needs the app-version review path only after explicit approval.

Cost:
- No new build, paid tester order, App Review submission, release, or in-app purchase was started during this pass.

Previous checkpoint:

Updated: 2026-05-26T07:13:00-05:00

Handled the iPhone TestFlight report: user installed build `1.0.1 (8)` but did not see the purchase part.

Completed this pass:
- Verified the production EAS environment still has `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true`, Apple RevenueCat public SDK key `appl_MIVjCmUjykCdBmvVcYIKWyBeWxv`, entitlement `pro`, and offering `default`.
- Inspected the local IPA and confirmed the Apple RevenueCat key is present in `main.jsbundle`, so build `1.0.1 (8)` was compiled with the iOS RevenueCat key.
- Found the app-side UX issue: Home only showed the Pro card/button when RevenueCat had already returned a purchasable package. If StoreKit/RevenueCat did not return a package, the purchase area disappeared instead of showing a visible diagnostic path.
- Patched `app/(tabs)/index.tsx` so monetized builds show the FieldBill Pro area whenever monetization is configured, even if the store package is not loaded yet. The Pro card now shows checking/unavailable states and the Home actions include a `FieldBill Pro` button that opens `/upgrade` for retry/restore status.
- Reran `npm run check:tester-release`; TypeScript, lint, Expo Doctor, and FieldBill preflight passed. Expected warnings remain local EAS versioning, no local `.env`, and dirty working tree.

Important:
- The user's currently installed TestFlight build `1.0.1 (8)` does not include this Home visibility patch. A new iOS build is required for the fix to appear in TestFlight.
- Do not start another iOS EAS build without explicit user approval because prior notes flagged possible Expo pay-as-you-go build cost.

Next action:
- For the current installed TestFlight build, try opening `fieldbill://upgrade` from Safari on the iPhone to reach the existing Pro screen directly and see whether StoreKit/RevenueCat reports purchases unavailable.
- If the direct Pro screen still cannot load the product, recheck live App Store Connect IAP availability/status and RevenueCat offering/product attachment before spending another EAS build.
- After user approval for possible build cost, build/upload a new iOS TestFlight binary with the Home visibility patch, then retest iOS sandbox purchase and restore.
- Do not click App Review submit/release. The first IAP still needs the app-version review path only after explicit approval.

Cost:
- No new build, paid tester order, App Review submission, release, or in-app purchase was started during this pass.

Previous checkpoint:

Updated: 2026-05-26T07:04:00-05:00

Recovered FieldBill state after an unexpected Codex stop.

Completed this pass:
- Read the FieldBill handoff and project-status files to reconstruct the stop point.
- Verified EAS build `41fe864d-a2c7-4d69-97a6-cfe338250277` is `FINISHED` for iOS `1.0.1 (8)` with artifact `https://expo.dev/artifacts/eas/99E5pJMiiyS2uoreT31Nfk.ipa`.
- Verified local IPA `C:\fieldbill\builds\FieldBill-1.0.1-ios-b8-monetization.ipa` still has SHA256 `726320DE4A2D0EEDC0A9AEB89320FDE3AC979583B8BFC72D31CF16AA09EB0658`.
- Confirmed no FieldBill Metro/dev server is currently listening. The only Expo listener found on port `8084` belongs to `C:\Projects\musical-resonance`, not FieldBill.
- Confirmed devphone `ZT4228M83L` is connected over ADB.
- Confirmed the current FieldBill worktree is dirty only in the expected handoff/docs/version files from the iOS monetization pass plus this recovery note.
- Reran `npm run check:tester-release`; TypeScript, lint, Expo Doctor, and FieldBill preflight passed. Expected warnings remain local EAS versioning, no local `.env`, and dirty working tree.

Next action:
- Open App Store Connect/TestFlight if live Apple processing state needs a fresh visual check.
- Install build `1.0.1 (8)` through internal TestFlight on iPhone, use the Sandbox Apple Account for the iOS purchase flow, run sandbox purchase against `fieldbill_pro_lifetime`, then run restore.
- Do not click App Review submit/release. The first IAP still needs the app-version review path only after explicit approval.

Cost:
- No new build, paid tester order, App Review submission, release, or in-app purchase was started during this recovery check.

Previous checkpoint:

Updated: 2026-05-26T06:31:00-05:00

Built/uploaded the iOS monetization binary and created the Apple sandbox tester.

Completed this pass:
- User approved proceeding with the iOS monetization build despite possible EAS pay-as-you-go build cost.
- Verified production EAS config before building: bundle `com.fieldbill.app`, monetization enabled, Apple RevenueCat key loaded, entitlement `pro`, offering `default`.
- Ran `npm run check:tester-release`; TypeScript, lint, Expo Doctor, and FieldBill preflight passed.
- First iOS monetization build `1.0.0 (7)` completed but App Store Connect submission failed with `SUBMISSION_SERVICE_IOS_OLD_APP_VERSION` because app version `1.0.0` had already been submitted.
- Bumped FieldBill to `1.0.1` and built replacement iOS build `1.0.1 (8)`.
- EAS build `41fe864d-a2c7-4d69-97a6-cfe338250277` finished successfully.
- EAS submit `aaa0fd4f-c0f7-4175-a049-e07bacedca99` finished successfully, uploading build `1.0.1 (8)` to App Store Connect/TestFlight.
- Created App Store Connect Sandbox Apple Account `ssehie+fieldbill-ios-sandbox-20260526-062600@gmail.com` under `Users and Access > Sandbox`.
- Sandbox password was generated for this tester and intentionally kept out of git-tracked docs.
- App Store Connect TestFlight now shows version `1.0.1`, build `8`, status `Ready to Submit Expires in 90 days`, and internal group `Team (Expo)` attached. Do not use `Add Group` / external beta review unless explicitly approved.
- IPA artifact: `https://expo.dev/artifacts/eas/99E5pJMiiyS2uoreT31Nfk.ipa`.
- Local IPA: `C:\fieldbill\builds\FieldBill-1.0.1-ios-b8-monetization.ipa`.
- Local IPA SHA256: `726320DE4A2D0EEDC0A9AEB89320FDE3AC979583B8BFC72D31CF16AA09EB0658`.
- `app.json`, `package.json`, and `package-lock.json` now carry version `1.0.1`; `app.json` carries `ios.buildNumber` `8`.

Next action:
- Wait for Apple/TestFlight processing for build `1.0.1 (8)`.
- Install build `1.0.1 (8)` through internal TestFlight on iPhone, use the Sandbox Apple Account for the iOS purchase flow, run the sandbox purchase against `fieldbill_pro_lifetime`, then run restore.
- Do not click App Review submit/release. The first IAP still needs to be submitted through a new app-version review path only after explicit approval.

Cost:
- An EAS iOS build was started after user approval. Expo may charge if the account is over included build credits.
- No App Review submission, release, paid tester order, or in-app purchase was started.

Previous checkpoint:

Updated: 2026-05-26T04:45:00-05:00

Completed the free/config side of the FieldBill iOS RevenueCat lane.

Completed this pass:
- Created App Store Connect In-App Purchase API key `FieldBill RevenueCat`.
- Apple key ID: `RZ8H9ML2DQ`; issuer ID: `b37cafad-5d9a-45e0-b657-3184416b446a`.
- Uploaded the downloaded `.p8` key to RevenueCat for `fieldbill (App Store)`, then deleted the local download from `C:\Users\ssehie\Downloads`.
- RevenueCat App Store app `fieldbill (App Store)` is configured for bundle `com.fieldbill.app` and shows valid credentials.
- RevenueCat Apple public SDK key `appl_MIVjCmUjykCdBmvVcYIKWyBeWxv` is set in EAS `production` and `preview` as `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`.
- RevenueCat Apple product `fieldbill_pro_lifetime` exists under `fieldbill (App Store)`.
- Entitlement `pro` now has two associated products: Android `fieldbill_pro_lifetime` and App Store `fieldbill_pro_lifetime`.
- Offering `default` package `$rc_lifetime` now contains both Android and App Store `FieldBill Pro` products.
- Verified `npx eas-cli env:list production --format long` and `npx eas-cli env:list preview --format long`.
- Verified `npx eas-cli config -p ios -e production --json` loads the production EAS variables for monetization, Apple key, Google key, `pro`, and `default`.
- Ran `npm run check:tester-release`; TypeScript, lint, Expo Doctor, and FieldBill preflight passed. Expected warnings remain: local EAS versioning, no local `.env`, dirty docs/worktree.

Next action:
- Do not start an iOS EAS build until the user explicitly approves possible Expo pay-as-you-go build cost; EAS previously reported included build credits at `100%`.
- After approval, build/install a new iOS binary with the Apple RevenueCat key, then run iOS sandbox purchase and restore.
- Submit the first IAP through the required app-version review path only when the user explicitly approves submit/release actions.

Cost:
- No new cost; no EAS build, paid tester order, app submission, release, or purchase was started.

Previous checkpoint:

Updated: 2026-05-25T23:39:00-05:00

Created and verified the App Store Connect IAP metadata for the iOS monetization lane.

Completed this pass:
- App Store Connect app id `6762166246` / bundle `com.fieldbill.app` is signed in and reachable.
- Created non-consumable `FieldBill Pro Lifetime`.
- Product ID: `fieldbill_pro_lifetime`.
- Apple ID: `6773188154`.
- Localization: English (U.S.), display name `FieldBill Pro`, description `Unlock unlimited invoices in FieldBill.`
- Availability: all countries or regions selected; `Remove from Sale` unchecked.
- Price schedule: United States base price `$29.99`.
- Uploaded review screenshot `assets\store\app-store\iap-review-fieldbill-pro-iphone-65.png` (`1242 x 2688`). The earlier `720 x 1448` crop was rejected for invalid screenshot dimensions.
- IAP status changed from `Missing Metadata` to `Ready to Submit`.
- Checked the iOS version page. It shows `1.0 Ready for Distribution`; no app review submission/release action was clicked.

Next action:
- Decide whether to create/use the next iOS app version path to submit the first IAP with an app review. Do not click any submit/release action without explicit confirmation.
- Wire RevenueCat Apple app/public SDK key/product to entitlement `pro` and offering `default`.
- Put the Apple public SDK key in the EAS environments used for iOS builds.
- Build/install an iOS binary with monetization enabled if the current approved `1.0.0 (6)` build does not contain the required Apple RevenueCat key.
- Run iOS sandbox purchase and restore before calling iOS billing green.

Cost:
- No new cost; no EAS build, app submission, paid tester order, or purchase was started in this pass.

Previous checkpoint:

Updated: 2026-05-25T20:50:00-05:00

Android Play sandbox purchase and restore passed on the devphone using the Play-delivered FieldBill v11 build.

Completed this pass:
- Joined `testmyappscommunity@googlegroups.com` on the devphone as `ssehiedeveloper@gmail.com` with subscription set to `No email`.
- Opened the FieldBill Play testing opt-in URL as `authuser=1`; the dev account then saw the invite and was enrolled with `You are a tester.`
- Uninstalled FieldBill, cleared full Play Store app data only with `cmd package clear com.android.vending`, relaunched Play Store, and switched Play Store from the default `ssehie@gmail.com` state back to `Ssehie Developer / ssehiedeveloper@gmail.com`.
- Reinstalled FieldBill from Play as `versionCode=11`, `versionName=1.0.0`, `installerPackageName=com.android.vending`, installed at `2026-05-25 20:44:09`.
- Opened `fieldbill://upgrade`; the purchase sheet finally showed `Test card, always approves` and `This is a test order, you will not be charged.`
- Completed the Google Play `1-tap buy` test purchase, chose `Yes, always` for future purchase authentication, and declined the Play Points prompt.
- FieldBill UI now shows `Unlimited invoices are unlocked.` and `Pro Unlock` = `Active`.
- Logcat evidence: `[FieldBill QA] billing.purchase.success` with `entitlementId:"pro"` and `packageId:"$rc_lifetime"`; customer info showed `hasProAccess:true`.
- Tapped `Restore Purchase`; logcat showed `[FieldBill QA] billing.restore.completed` with `restoredProAccess:true`.

Next action:
- Android monetization purchase/restore gate is now passed for closed-test Alpha v11.
- Keep this account/cache sequence for future retests: Play Store selected as `ssehiedeveloper@gmail.com`, FieldBill installed from Play after the tester opt-in, then verify the purchase sheet shows a Google test instrument before pressing buy.
- If a fresh repurchase of the same non-consumable is needed later, refund/revoke the test order in Play Console first or use a fresh tester account; do not store or reuse purchase tokens.
- Continue remaining launch work: Google production access/release readiness and iOS App Store Connect IAP setup after Apple sign-in/2FA.

Cost:
- No real charge. Google Play explicitly showed `This is a test order, you will not be charged.`

Previous checkpoint:

Updated: 2026-05-25T19:56:22-05:00

Installed and initialized Play Billing Lab for `ssehie@gmail.com`; Google test cards still did not appear in the FieldBill purchase sheet.

Completed this pass:
- Installed `Play Billing Lab` (`com.google.android.apps.play.billingtestcompanion`) from Google Play.
- Opened it as `Steve Sehie / ssehie@gmail.com` and accepted the intro.
- Play Billing Lab dashboard is available; visible controls are configuration settings, subscription settings, and response simulator.
- Opened response simulator once; it exposes billing response-code simulation controls, not a test-card picker.
- Cleared only Play Store cache via `pm clear --cache-only com.android.vending` and force-stopped Play Store.
- Reopened FieldBill, skipped the intro that appeared after the retry path, and returned to `FieldBill Pro`.
- Final payment-method check still showed only real methods for `ssehie@gmail.com`: `Visa-8871`, `Amex-5972`, `Mastercard-7087`, PayPal, other cards, and Google Pay balance. No `Test card` option appeared.
- Backed out to the FieldBill upgrade screen; no purchase completed.

Next action:
- Either use a real funded method for one live purchase/void/refund test, or investigate why Google is not surfacing license-tester test instruments despite the account being in the Play Console license tester list.
- A stronger refresh option is clearing full Play Store data, but that may reset local Play Store state; do not do it without confirming with the user.
- Once an approving method is available, retry purchase, then run `Restore Purchase` and confirm RevenueCat entitlement `pro`.

Cost:
- Play Billing Lab install was free; no purchase completed and no Pro entitlement granted.

Previous checkpoint:

Updated: 2026-05-25T19:42:09-05:00

Play Console License testing was found and verified on the PC; both main and dev accounts are already in the selected tester email list, but the device still did not show Google test cards.

Completed this pass:
- Opened Play Console developer account `8439387974199008185` on the PC.
- Navigated to `Settings > Monetization > License testing` (`/license-tester`).
- License testers are set to email list `email tester` with `7` users.
- The list includes `ssehie@gmail.com` and `ssehiedeveloper@gmail.com`.
- License response is `RESPOND_NORMALLY`.
- Retried the FieldBill Play purchase flow and opened `Payment methods` for `ssehie@gmail.com`.
- Payment selector showed real instruments only: `Visa-8871`, `Amex-5972`, `Mastercard-7087`, PayPal, other cards, and Google Pay balance. No `Test card` option was visible.
- Tapping `+ more` opened the add-card flow, not test instruments.
- Backed out to FieldBill; no purchase was completed.

Next action:
- Try Play Billing Lab or a Play Store billing cache/account refresh so Google exposes test instruments for the already-listed license tester account.
- Then choose a Google `Test card, always approves` instrument and retry purchase.
- Once purchase succeeds, run `Restore Purchase` and confirm RevenueCat entitlement `pro`.

Cost:
- No purchase completed; no Pro entitlement granted.

Previous checkpoint:

Updated: 2026-05-25T19:30:23-05:00

Android purchase attempt returned from Google Play as a failed purchase; FieldBill handled the failure and Pro did not unlock.

Completed this pass:
- Human completed the Google account verification prompt.
- Google Play purchase flow returned to FieldBill after the payment was declined.
- Current FieldBill upgrade screen shows `The device or user is not allowed to make the purchase.`
- Logcat shows `ProxyBillingActivity` finished with billing `responseCode: 3`.
- RevenueCat emitted `PurchasesError(code=PurchaseNotAllowedError ... Billing Unavailable ... message='The device or user is not allowed to make the purchase.')`.
- FieldBill emitted `[FieldBill QA] billing.purchase.failed` with the same message.
- No `billing.purchase.success` event appeared and Pro remains locked.

Next action:
- Verify Play Console license tester/payment setup for the Google account that installed the app, or switch the Play purchase sheet to an approving test instrument.
- Retry purchase only after the payment method/account is expected to approve.
- Once purchase succeeds, run `Restore Purchase` and confirm RevenueCat entitlement `pro`.

Cost:
- No successful purchase recorded by FieldBill/RevenueCat; no Pro entitlement granted.

Previous checkpoint:

Updated: 2026-05-25T19:24:17-05:00

Android purchase flow advanced to Google account verification; sandbox purchase is not complete because Google requires the `ssehie@gmail.com` account password on-device.

Completed this pass:
- User confirmed `Visa-8871` is a test/payment-safe card and authorized proceeding.
- Relaunched `fieldbill://upgrade`, tapped `Unlock Pro $29.99`, and pressed the visible Play `Buy` button.
- Google Play moved to an account verification sheet for `ssehie@gmail.com`.
- Checked `Remember me on this device`; the sheet warned that disabling authentication may allow unauthorized purchases.
- UI automation shows the account field is a password-type field and `Verify` remains disabled until the password is entered.
- Stopped without entering credentials. No RevenueCat `billing.purchase.success` or `billing.purchase.failed` app result was emitted because the purchase never returned to FieldBill.

Next action:
- On the phone, enter the Google account password on the current Play verification sheet, leave `Remember me on this device` checked if future unattended test purchases should proceed farther, then tap `Verify`.
- After the Google verification completes, resume by checking FieldBill for Pro unlock and running `Restore Purchase` to confirm RevenueCat entitlement `pro`.
- Future passes should not need to wait at this exact screen if Google honors the remembered-device setting, but any new Google security prompt still requires the human.

Cost:
- No confirmed charge and no successful purchase recorded; flow stopped at Google account verification.

Previous checkpoint:

Updated: 2026-05-25T18:00:25-05:00

Android Play install and purchase-sheet smoke test completed; sandbox purchase is blocked until Play billing license testing/test-payment state is verified.

Completed this pass:
- Uninstalled sideloaded `com.fieldbill.app` v7 from device `ZT4228M83L`.
- Installed FieldBill from Google Play closed-test listing.
- Verified installed app is Play-delivered `versionCode=11`, `versionName=1.0.0`, `installerPackageName=com.android.vending`, installed at `2026-05-25 17:55:31`.
- Opened `fieldbill://upgrade`; RevenueCat offering loaded with `FieldBill Pro` / `$29.99`, `0` invoices created, `3` free invoices left.
- Tapped `Unlock Pro $29.99` only as far as the Google Play purchase sheet.
- Stopped before purchase: the sheet showed real payment method `Visa-8871`, `$29.99 + tax`, and no visible sandbox/test-card wording.

Next action:
- Verify the phone's active Play account is configured under Play Console `Settings > License testing` and that the purchase sheet shows a test instrument or test-purchase wording, not a real card/tax flow.
- Then run Android sandbox purchase and restore against `fieldbill_pro_lifetime` from the Play testing build.
- Confirm RevenueCat grants entitlement `pro`.
- Do not start any paid production rollout until sandbox purchase/restore passes and Google production access is approved.

Cost:
- No direct cost; this pass did not start an EAS build or paid service.

Previous checkpoint:

Updated: 2026-05-25T17:40:15-05:00

Play Console live check confirms Android closed-test Alpha v11 is published and available to testers.

Completed this pass:
- Reused the existing Chrome window and closed five old RF/route-map tabs before inspecting Play Console.
- Publishing overview shows `You have no unpublished changes`.
- Play Console notification dated May 24 says `App update published. Users should see changes immediately but may take longer.`
- Test and release shows Closed testing `alpha` with release `11 (1.0.0)`.
- Closed testing - Alpha detail shows the track is `Active`, latest release is `11 (1.0.0)`, available to selected testers, `177` countries / regions, released on May 24 at 3:02 PM.

Next action:
- Run Android sandbox purchase and restore against `fieldbill_pro_lifetime` from the Play testing build.
- Confirm RevenueCat grants entitlement `pro`.
- Do not start any paid production rollout until sandbox purchase/restore passes and Google production access is approved.

Cost:
- No direct cost; this pass did not start an EAS build or paid service.

Previous checkpoint:

Updated: 2026-05-25T17:30:18-05:00

FieldBill remains waiting on Google review for Android closed-test Alpha v11. Local release readiness is still green.

Completed this pass:
- Ran `npm run check:tester-release`; TypeScript, lint, Expo doctor, and tester preflight passed.
- Expo doctor reported `18/18 checks passed`.
- Tester preflight passed with only expected warnings: local EAS versioning and no local `.env`; Git working tree is clean.
- Gmail search found no official Google/FieldBill approval or rejection email newer than the v11 send-for-review checkpoint.
- No Edge/Play Console browser session is currently running on this machine.

Next action:
- Monitor Play Console/Gmail for the review result.
- Once v11 is installable by testers, run Android sandbox purchase and restore against `fieldbill_pro_lifetime`.
- Do not start any paid production rollout until sandbox purchase/restore passes and Google production access is approved.

Cost:
- No direct cost; this pass did not start an EAS build or paid service.

Previous checkpoint:

Updated: 2026-05-24T14:53:24-05:00

Android closed-test Alpha v11 was sent to Google review.

Completed this pass:
- User confirmed `send`.
- Clicked Play Console `Send 1 change for review`.
- Confirmed the modal action `Send changes for review`.
- Play Console Publishing overview now shows `Changes in review`.
- Reviewed change: `Closed testing - Alpha`, version `11 (1.0.0)`, description `Start full rollout`.

Known caveat:
- Managed publishing is off, so approved changes may publish automatically after review.

Next action:
- Monitor Play Console/Gmail for the review result.
- Once v11 is installable by testers, run Android sandbox purchase and restore against `fieldbill_pro_lifetime`.
- Do not start any paid production rollout until sandbox purchase/restore passes and Google production access is approved.

Previous checkpoint:

Updated: 2026-05-24T12:57:13-05:00

Android closed-test v11 upload is complete and queued in Play Console Publishing overview.

Completed this pass:
- Downloaded EAS Android production AAB `105dd818-2f05-4590-88d8-d814dddf07f4` to `C:\fieldbill\builds\FieldBill-1.0.0-android-v11-play.aab`.
- Local AAB details: `80,971,892` bytes; SHA256 `BEE42DE16A2C7C722ED4B9A0A74EACBC6AB18B791F0F3C876A043356D6518AE7`.
- Direct EAS submit was attempted and failed because Google Service Account Keys cannot be set up in `--non-interactive` mode.
- Used signed-in Edge / Play Console computer control to create a new `Closed testing - Alpha` release.
- Uploaded `FieldBill-1.0.0-android-v11-play.aab`.
- Play Console accepted bundle version `11 (1.0.0)`, API `24+`, target SDK `36`.
- Added `en-US` release notes and saved the release draft.
- Preview showed only one non-blocking warning: no deobfuscation file for version code `11`.
- Publishing overview now shows `1` change not yet sent for review: `Closed testing - Alpha`, version `11 (1.0.0)`, description `Start full rollout`.
- Play Console quick checks completed and the page says the changes can now be sent for review; the final visible action is `Send 1 change for review`.

Hard stop:
- Do not click `Send 1 change for review` without explicit user confirmation. Managed publishing is off, so approved closed-test changes can publish automatically after Google review.

Next action:
- Re-open the existing Edge Play Console tab or `https://play.google.com/console/u/0/developers/8439387974199008185/app/4972649305430524285/publishing`.
- If the user explicitly confirms, click `Send 1 change for review` for the queued closed-test Alpha v11 change.
- After Google makes v11 installable to testers, run Android sandbox purchase and restore against `fieldbill_pro_lifetime`.

Previous checkpoint:

Updated: 2026-05-24T11:41:15-05:00

Android production AAB build finished for monetized Play testing.

Completed this pass:
- Confirmed no stale FieldBill `tsc`/lint/expo/preflight child processes remained from the earlier timed-out combined check; only the signed-in RevenueCat Edge session was still open.
- Verified EAS production config/env for Android before building. Production build profile is `distribution: store`, Android `buildType: app-bundle`, monetization enabled, entitlement `pro`, offering `default`, and the RevenueCat Google public SDK key loaded from EAS production env.
- Local checks passed individually:
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npx expo-doctor` (`18/18 checks passed`)
  - `npm run preflight:tester` with expected warnings for local EAS versioning, no local `.env`, and dirty working tree.
- Started EAS Android production app-bundle build:
  - command: `npx eas-cli build -p android --profile production --non-interactive --no-wait --json`
  - build ID: `105dd818-2f05-4590-88d8-d814dddf07f4`
  - logs: `https://expo.dev/accounts/ssehie/projects/fieldbill/builds/105dd818-2f05-4590-88d8-d814dddf07f4`
  - AAB artifact: `https://expo.dev/artifacts/eas/32dGg22nwp47cKEcovmWij.aab`
  - app version: `1.0.0`
  - app build version/versionCode: `11`
  - final status at `2026-05-24T11:41:15-05:00`: `FINISHED`
- EAS auto-bumped `app.json` Android `versionCode` from `10` to `11`.

Known caveat:
- RevenueCat live status probe through the Edge debugging session timed out before returning useful store status. The previously verified RevenueCat/Google setup remains documented: credentials are uploaded/protected and Pub/Sub developer notifications are connected.

Next action: upload AAB `https://expo.dev/artifacts/eas/32dGg22nwp47cKEcovmWij.aab` to Play Console internal or closed testing, then run sandbox purchase and restore for `fieldbill_pro_lifetime`. Do not start a paid Android production rollout until sandbox purchase/restore passes and Google production access is approved.

Previous checkpoint:

Updated: 2026-05-24T10:40:00-05:00

Android RevenueCat/Google service credentials are connected.

Completed:
- RevenueCat account `ssehie@gmail.com` is verified.
- RevenueCat project `fieldbill` (`3fe9596f`) exists.
- Created Google Play app `FieldBill Android` (`app87ed3fec9b`) for package `com.fieldbill.app`.
- Created/verified product `fieldbill_pro_lifetime` (`prodbc42966e33`) as a Play Store non-consumable.
- Created entitlement `pro` (`entlcf87fedd47`) and attached `fieldbill_pro_lifetime`.
- Created current offering `default` (`ofrngc5bc65c372`) with package `$rc_lifetime` (`pkgee66913e7a3`) containing the Android product.
- Set EAS `production` and `preview` variables:
  - `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true`
  - `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`
  - `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID=pro`
  - `EXPO_PUBLIC_REVENUECAT_OFFERING_ID=default`
- Updated `eas.json` so `internal` and `release-apk` use EAS `preview`, and `production` uses EAS `production`.
- Verified EAS env list for both `production` and `preview`.
- Verified `npx eas-cli config -p android -e production --json` and `npx eas-cli config -p android -e internal --json`; EAS reports the RevenueCat variables are loaded from the expected environments.
- Reran `npm run check:tester-release`; it passed with expected warnings for local EAS versioning, no local `.env`, and dirty working tree.
- Created Google Cloud service account `RevenueCat Service Account` in project `api-project-294089098252`.
- Added Play Console service-account user `revenuecat-service-account@api-project-294089098252.iam.gserviceaccount.com` for FieldBill with app-info read, app-quality read, financial-data, and orders/subscriptions permissions.
- Uploaded the service-account JSON to RevenueCat; Android app credentials are now stored as `RC__PROTECTED` with key details visible for project `api-project-294089098252`.
- Enabled Google Cloud Pub/Sub API and Google Play Android Developer API.
- Connected RevenueCat Google developer notifications after adding Pub/Sub Admin; `pub_sub_enabled: true`, topic `projects/api-project-294089098252/topics/Play-Store-Notifications`, `pub_sub_error_status: null`.
- Deleted the local temporary JSON key after upload/connect.

Remaining:
- Wait for Google/RevenueCat propagation if the store status is not green immediately.
- Build and install a fresh native Android build with the monetization EAS env.
- Run Android sandbox purchase and restore against `fieldbill_pro_lifetime`.
- Wait for the Play Console production-access decision before any paid production rollout.
- Complete iOS IAP/App Store Connect setup separately after Apple sign-in/2FA.

Next action: make a fresh Android native build with monetization env loaded, install it, and run sandbox purchase/restore. Do not start a paid Android production rollout until sandbox purchase/restore passes and Google production access is approved.

Previous checkpoint:

Updated: 2026-05-24T07:29:00-05:00

Play Console production-access application for FieldBill was submitted. The dashboard now says `Application submitted`; Google is reviewing the application form and will email the account owner with an update, usually in `7 days or less` but sometimes longer. Play Console shows `Applied today, 7:29 AM`. Production remains `Inactive` while the application is under review.

Submitted answers were written to fit the Play Console `300` character limits and used only evidence we can support: TestMyApps/Clyrolabs paid testing, 16/16 engaged testers, full FieldBill job-to-invoice workflow testing, v10 fixes from tester feedback, live Privacy/Terms links, no-login workflow, and completed closed-test gate.

Before submission, `npm run check:tester-release` failed on Expo's Metro config check. Added `metro.config.js` with Expo's default Metro config from `expo/metro-config`; rerun passed. Expected warnings remain: local EAS versioning, no local `.env` so monetization defaults off, and dirty working tree.

Next action: monitor Gmail/Play Console for Google's production-access decision. Do not start Android production rollout until access is granted. User then shifted next target to monetization setup.

Updated: 2026-05-24T07:55:00-05:00

Monetization readiness pass moved forward. The app already has RevenueCat code for entitlement `pro`, offering `default`, product selection, purchase, restore, and local pro-access caching. EAS currently has no env vars in `production`, `preview`, or `development`, so paid unlock cannot be enabled in builds until public RevenueCat SDK keys are added.

RevenueCat browser check opened `https://app.revenuecat.com/` and it is at login. Gmail search found no RevenueCat history, so assume no accessible RevenueCat account/project yet. User said they do not know if they have a RevenueCat account.

Play Console one-time-products check: FieldBill has `1 - 1 of 1` one-time product. Signed-in API data confirms product ID `fieldbill_pro_lifetime`, display name `FieldBill Pro`, and one `lifetime` purchase option. App Store Connect check is blocked because Apple redirects to login with `authResult=FAILED`; Apple sign-in/2FA is needed before creating or verifying the iOS non-consumable.

Android purchase-readiness fixes applied:
- added `com.android.vending.BILLING` to `app.json`;
- added `com.android.vending.BILLING` to `android/app/src/main/AndroidManifest.xml`;
- changed `MainActivity` launch mode from `singleTask` to `singleTop`;
- extended `scripts/tester-release-preflight.cjs` to check billing permission and purchase-safe launch mode.

Verification: `npm run check:tester-release` passed. Expected warnings: local EAS versioning, no local `.env`, and dirty working tree.

Next monetization action: create/sign into RevenueCat, create FieldBill project, add iOS/Android apps `com.fieldbill.app`, import/add product `fieldbill_pro_lifetime`, create entitlement `pro`, create offering `default`, then set EAS production vars and build new binaries. For iOS, Apple requires the first IAP to be submitted with a new app version, so App Store Connect sign-in is also required.

Previous checkpoint:

Updated: 2026-05-24T06:44:59-05:00

Gmail check found a new unread/important Clyrolabs email for FieldBill: `FieldBill - Production Report`, received `2026-05-23T03:14:21`. Clyrolabs says they tested the new features/UI, attached a Google Play production-access questionnaire guide, will keep the app installed for `16` days, and asked to be informed once production access is granted. Attachment read: `FieldBill_Google_Play_Production_Access_Guide_2026.docx`.

Updated: 2026-05-24T06:52:40-05:00

Computer-use check opened the signed-in TestMyApps dashboard at the current route `https://testmyapps.app/dashboard`; the old `https://testmyapps.app/developer_dashboard` route now returns `404 Page not found`. Dashboard account is Steve Sehie / `ssehie@gmail.com`. Dashboard summary: `2` total apps, `2` in testing, `0` completed, wallet credits `0`, notifications `4`. Recent apps show `PsiGrid` and `FieldBill`, both `IN TESTING`.

FieldBill run detail route: `https://testmyapps.app/test-runs/e6a8f16b-6409-4971-8c9d-a00e681f8019`. Overview shows `SUBMITTED`, submitted `May 8, 6:18 PM`, SLA due `May 25, 1:59 PM`, build type `Play Store`, latest update `Testing Clock Started`, app `FieldBill`, version `1.0.0`, platform `Android`, delivery `Play Store`. Report status: still processing; final report appears once released.

FieldBill Progress tab: `Day 15 of 16`, `1 day remaining before SLA`, active testers `16 / 16 ENGAGED`, tester submissions `0 NONE YET WAITING`, current stage `In Testing`. Client progress updates remain the May 14 Praveen Kumar legal-link/push-release request and the May 9 tester-assignment start note. Reports tab says final report `Not released yet`. Instructions tab says no login is required and asks testers to create a job, select/add a customer, add labor/materials, save/reopen, and verify saved customer/job data with attention to duplicate customer entries or confusing customer selection. Build access remains `Play Store`.

Next action: wait for TestMyApps final report or the May 25 SLA, while separately opening Play Console to verify whether Google production-access eligibility is now available. Do not tell Clyrolabs production access is granted until Play Console confirms it.

Updated: 2026-05-24T07:03:17-05:00

Computer-use Play Console check opened signed-in developer `8439387974199008185`, selected FieldBill app `4972649305430524285`, package `com.fieldbill.app`. FieldBill dashboard shows `Production` is `Inactive`, but the production-access checklist is now complete and `Apply for production` is available. Completed prerequisites shown:
- `Publish a closed testing release`
- `Have at least 12 testers opted-in to your closed test`
- `Run your closed test with at least 12 testers, for at least 14 days`

Next action: use the Clyrolabs `FieldBill_Google_Play_Production_Access_Guide_2026.docx` as a draft source, clean the answers against actual evidence, then submit the Play Console `Apply for production` questionnaire only after user approval. This is an external store submission; do not submit without explicit go-ahead.

Attachment stance: use it as a drafting aid, not as paste-ready evidence. It includes concrete FieldBill answers for all `10` Play production-access questions, but the questionnaire still needs to be reconciled with actual Play Console/tester records before submission. Verify any claims about recruitment sources, WhatsApp/Telegram feedback, `12` testers, full `14`-day continuity, and tester-confirmed fixes. There is also generic template residue in the tips, so clean the final wording before submitting.

Public site/link check:
- App Store URL `https://apps.apple.com/app/fieldbill/id6762166246` returned HTTP `200`, resolved to `https://apps.apple.com/us/app/fieldbill/id6762166246`, title `FieldBill App - App Store`, and shows FieldBill as a free Business app by Steve Sehie.
- TestFlight public link `https://testflight.apple.com/join/dYdE2Gcw` returned HTTP `200`, title `Join the FieldBill beta - TestFlight - Apple`, contains `View in TestFlight`, and did not show obvious full/not-accepting text.
- Privacy Policy `https://ssehie.github.io/fieldbill/privacy-policy/` returned HTTP `200` with title `Privacy Policy for FieldBill`.
- Terms `https://ssehie.github.io/fieldbill/terms/` returned HTTP `200` with title `Terms and Conditions for FieldBill`.
- Public TestMyApps pages still describe managed Android/iOS testing around real testers, a `12` tester / `14` day closed-test window, Play Console link/APK/TestFlight handoff, feedback/reporting, and terms that do not guarantee app-store approval.

Initial non-browser check could not verify private dashboard state, but the follow-up computer-use check above did verify the signed-in TestMyApps dashboard and Play Console production-access eligibility. Gmail did not show a newer official Google Play production-access/review status email; the only Google Play match after 2026-05-21 was a Google Play I/O recap marketing email. Also saw an unrelated unread Clyrolabs `PSIGRID - Production Report` email on 2026-05-24.

Next action: open signed-in Play Console, confirm the production-access gate now shows the `14` continuous closed-test days satisfied, then use the Clyrolabs guide to draft the Google questionnaire with only evidence we can support. After applying or receiving production access, reply to Clyrolabs with the result.

Previous checkpoint:

Updated: 2026-05-21T20:43:04-05:00

Monetization decision logged: leave the live App Store build free for now and watch real install/usage signal before enabling the paywall. Current intended paid model remains a simple one-time FieldBill Pro unlock at `$29.99`, likely after `7` free invoices, but do not enable RevenueCat/paywall in production until install behavior and invoice usage have been observed. Current shipped build has monetization disabled and fails open, so users can keep creating invoices.

Next action: monitor App Store installs/usage and basic smoke behavior first. When ready to monetize, update the invoice limit constant/docs to the chosen free-invoice count, create Apple/RevenueCat product `fieldbill_pro_lifetime`, sandbox-test purchase/restore, then ship a new build with `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true`.

Previous checkpoint:

Updated: 2026-05-21T17:10:48-05:00

Gmail check found Apple approval for FieldBill iOS. App Store Connect email `Review of your FieldBill (iOS) submission is complete.` arrived `2026-05-21T22:10:48Z` and says submission `cf9b172e-3c31-4d83-ad77-1b67d8f9e570` is complete and eligible for distribution. Accepted item: App Version `1.0` for iOS. Submitted `May 20, 2026 at 02:45 PM Pacific Daylight Time` by `Steven Sehie`. App Store URL in the email: `https://apps.apple.com/app/fieldbill/id6762166246`.

Second Apple email `Welcome to the App Store` arrived `2026-05-21T22:10:47Z` and says FieldBill has been approved for distribution. Apple notes it can take up to 24 hours after release for apps to become available on the App Store, and distribution still depends on contracts being in effect.

Direct public App Store URL check returned HTTP `200`, resolved to `https://apps.apple.com/us/app/fieldbill/id6762166246`, page title `FieldBill App - App Store`, and page content contains `FieldBill`.

Next action: run an iPhone smoke test from the public App Store or TestFlight, verify App Store Connect Agreements/Tax/Banking if any install/pricing issue appears, and then decide whether to send the App Store URL or rechecked TestFlight link `https://testflight.apple.com/join/dYdE2Gcw` to iOS testers.

Previous checkpoint:

Updated: 2026-05-20T16:45:00-05:00

iOS resubmission is complete in App Store Connect. In the authenticated Edge session, build `1.0.0 (5)` was removed from iOS version `1.0`, build `1.0.0 (6)` was attached, App Review notes were updated with the explicit optional microphone/job talk-note explanation, and `Resubmit to App Review` was clicked. App Store Connect now shows iOS Submission status `Waiting for Review` for item `iOS App 1.0` / `1.0.0 (6)`, submitted `May 20, 2026 at 4:45 PM` by `Steven Sehie`, submission ID `cf9b172e-3c31-4d83-ad77-1b67d8f9e570`.

Next action was to monitor App Store Connect/Gmail for the next Apple review result. That result arrived on 2026-05-21 and approved the app.

Previous checkpoint:

Updated: 2026-05-19T22:05:00-05:00

Live Google Play check from the signed-in PC Edge session: FieldBill has no unpublished changes. Closed testing `alpha` is serving `10 (1.0.0)`, dated `May 15 11:35 PM`. Dashboard production-access progress is `12 testers have currently been opted in for 10 days continuously`, so Android production access is time-gated until the 14-day requirement is met. Gmail found no newer FieldBill/TestMyApps/App Review status beyond the already-handled May 14-15 Clyrolabs thread. `npm run check:tester-release` passed with expected warnings.

Previous checkpoint:

Updated: 2026-05-18T20:52:53-05:00

Current status check: PC Edge has an authenticated Google Play Console session. FieldBill dashboard shows `12 testers have currently been opted in for 9 days continuously`; production access still needs the 14-day continuous closed-test window. Test and release shows closed testing `alpha`, release `10 (1.0.0)`, serving time `May 15 11:35 PM`, and `You have no unpublished changes`. Live legal URLs now return `200 OK` for both Privacy Policy and Terms.

Exit checkpoint: TestMyApps/Clyrolabs Android feedback was patched, Android v10 is now serving on Google Play `Closed testing - Alpha`. Published the missing Terms page to the active `gh-pages` branch at commit `b8c5700`; `https://ssehie.github.io/fieldbill/terms/` now returns `200 OK` and serves `Terms and Conditions for FieldBill`. Privacy Policy still returns `200 OK` at `https://ssehie.github.io/fieldbill/privacy-policy/`.

Changes implemented:
- simplified onboarding/start-job address entry by removing the confusing manual/search toggle;
- added bottom-safe Start Job footer spacing;
- added edit/delete flow for active-job parts;
- compacted final invoice Email/Mark Sent/Mark Paid actions;
- added in-app Privacy Policy and Terms links;
- added hosted Terms docs at `docs\terms\`.

Build:
- Android versionCode: `10`
- EAS build: `2aa2a809-d9ae-4d84-951e-adcf844620f1`
- EAS artifact: `https://expo.dev/artifacts/eas/6gmMhdrGFzybYN7xFBiGS6.aab`
- Local AAB: `C:\fieldbill\builds\FieldBill-1.0.0-android-v10-play.aab`
- Final verification: `npm run check:tester-release` passed after the build and again after the TestMyApps terms/email check with expected warnings for local EAS versioning, no local `.env`, and dirty working tree.

Play submission:
- Uploaded/attached app bundle `10 (1.0.0)` to `Closed testing - Alpha`.
- Corrected the first duplicate upload by using Play Console `Add from library` after Play had consumed versionCode `10`.
- Saved the release, then sent `1` change for Google review from Publishing overview.
- Final checked Play Console state from 2026-05-18: `You have no unpublished changes`; closed testing `alpha`, release `10 (1.0.0)`, serving since `May 15 11:35 PM`.
- Managed publishing is off, so the Alpha update should publish automatically after Google approval.

TestMyApps/Clyrolabs contract state:
- Public TestMyApps pages currently describe build/access handoff through Play Console testing link, APK, or TestFlight invite, managed tester coordination, and feedback/reporting.
- Their terms say they do not guarantee app-store approval or bug-free results, and that we grant permission to share the app with testers for testing purposes.
- FieldBill's submitted TestMyApps run is Android / Play Store delivery, so the correct tester path is Play Console `Closed testing - Alpha`; do not send the raw AAB as the tester-facing route unless Clyrolabs/TestMyApps explicitly asks for it.
- Gmail check found no new inbound Clyrolabs/TestMyApps response after Steve's sent reply `19e2da0f494fe34c`.

Next startup: legal URL blocker is resolved and Apple iOS review approval has arrived. Re-check Play Console/TestMyApps state before messaging Clyrolabs, verify the public App Store URL/contracts state, then decide whether to share the App Store URL or TestFlight link.

Paid/pro scaffold: RevenueCat/pro code exists, but monetization is off by default unless `EXPO_PUBLIC_FIELDBILL_MONETIZATION_ENABLED=true` is set. No local `.env` exists, so this review/tester build fails open and should not block invoice creation behind an unfinished paid unlock.

Apple iOS approval source is Gmail from App Store Connect on 2026-05-21. Direct App Store Connect inspection is still useful only to verify public availability, contracts, pricing, and TestFlight link usability.

Check on next startup:
- Open this handoff: `C:\fieldbill\NEXT-CODEX-STARTUP.md`
- Verify the last action still matches live state before continuing.

