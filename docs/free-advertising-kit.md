# FieldBill Free Advertising Kit

Last updated: 2026-05-26

## Objective

Promote the already-tested Android build without cutting another build.

Use the known-good Android v11 path unless a new Android build is explicitly approved and retested:

- Google Play package: `com.fieldbill.app`
- Play URL: `https://play.google.com/store/apps/details?id=com.fieldbill.app`
- Android billing status: production-ready from the app/billing harness side as of 2026-05-25
- Passed evidence: Play-delivered v11 install, Google test card purchase, RevenueCat `pro` entitlement, app UI Pro active state, restore success

## Policy Guardrails

- Do not buy installs, reviews, or ratings.
- Do not offer incentives for reviews or ratings.
- Do not claim ranking, awards, "best", "No. 1", or Google Play program affiliation.
- Do not use repetitive keyword stuffing.
- Do not send unsolicited SMS promotions.
- Be direct that FieldBill has a free starter allowance and a one-time Pro unlock for unlimited invoices.
- Ask for feedback and installs, not fake reviews.

Reference:

- Google Play Store Listing and promotion policy: `https://support.google.com/googleplay/android-developer/answer/16933379`
- Product Hunt Launch Guide: `https://www.producthunt.com/launch/`

## Core Positioning

FieldBill is a simple Android invoice app for independent contractors and field-service workers. Start a job, add labor and parts, review the invoice, and send clean billing details from the phone. No account required. First 3 invoices are free; Pro is a one-time unlock for unlimited invoices.

## Short Blurbs

### One Sentence

FieldBill is a simple Android invoice app for independent contractors who need to create and send clean invoices from the job site.

### Text Message / DM

I built FieldBill, a simple Android invoice app for small contractors and field-service work. It lets you start a job, add labor and parts, review the invoice, and send it from the phone. No account required, first 3 invoices are free. If you know someone who invoices from the field, I would appreciate real feedback: https://play.google.com/store/apps/details?id=com.fieldbill.app

### Local Contractor Email

Subject: Quick Android invoice app for field work

Hi,

I built FieldBill for small service businesses that need quick invoices from the job site. It is Android-first, does not require an account, and keeps the workflow simple: start a job, add labor and parts, review the invoice, and send the billing details from the phone.

The first 3 invoices are free, with a one-time Pro unlock for unlimited invoices.

Play link:
https://play.google.com/store/apps/details?id=com.fieldbill.app

If you try it, I am mainly looking for practical feedback: what feels confusing, what is missing, and whether the invoice flow fits real field work.

Thanks,
Steve

## Channel Plan

### 1. Direct Local Outreach

Best early channel because FieldBill has a narrow buyer: independent contractors and small field-service shops.

Targets:

- handyman services
- lawn care
- mobile mechanics
- cleaners
- HVAC
- electrical
- plumbing
- appliance repair
- small remodel crews
- solo maintenance workers

Action:

- Send 10-20 direct messages or emails.
- Ask for feedback, not ratings.
- Track who replied and what job type they do.

### 2. Facebook Groups

Use local groups where tradespeople already ask operational questions.

Post only where self-promotion or feedback requests are allowed.

Suggested post:

```text
I built a simple Android invoice app for small contractors and field-service workers, and I am looking for practical feedback from people who actually invoice from the job site.

FieldBill lets you start a job, add labor and parts, review the invoice, and send the billing details from the phone. No account required. First 3 invoices are free; Pro is a one-time unlock for unlimited invoices.

Play link:
https://play.google.com/store/apps/details?id=com.fieldbill.app

I am looking for feedback on whether the flow matches real field work, not review swaps or paid installs.
```

### 3. Reddit

Use only relevant communities and read each subreddit rules first. Do not cross-post the same link everywhere.

Better angle:

- ask for workflow feedback
- disclose that you built it
- avoid "please download" phrasing
- do not ask for reviews or upvotes

Suggested post:

```text
I built a simple Android invoice app for small field-service work and would like workflow feedback from people who invoice from the job site.

The app is FieldBill. It is meant for solo contractors who need to start a job, add labor and parts, review the invoice, and send billing details from the phone without setting up a full back-office system.

No account is required. First 3 invoices are free; unlimited invoices are a one-time Pro unlock.

Play link:
https://play.google.com/store/apps/details?id=com.fieldbill.app

Questions I am trying to answer:
- Is the job-to-invoice flow clear enough?
- What would a solo contractor need before trusting it on a real job?
- Is anything in the first-run setup confusing?

I am the builder, so direct criticism is useful.
```

Candidate subreddits to inspect before posting:

- `r/smallbusiness`
- `r/sweatystartup`
- `r/handyman`
- `r/Contractor`
- `r/EntrepreneurRideAlong`
- `r/androidapps` if developer/self-promo rules allow it

### 4. Product Hunt

Product Hunt is free and can create a public launch page/backlink, but it is more maker/startup oriented than contractor oriented.

Prepare:

- Product name: `FieldBill`
- Tagline: `Simple Android invoices for field-service work`
- URL: `https://play.google.com/store/apps/details?id=com.fieldbill.app`
- Maker comment:

```text
I built FieldBill for independent contractors and small field-service workers who need a simple invoice workflow from the phone.

The app avoids account setup and back-office complexity. The core flow is start a job, add labor and parts, review the invoice, and send billing details from the phone. The first 3 invoices are free, with a one-time Pro unlock for unlimited invoices.

I am looking for feedback from people who invoice in the field or work with small service businesses.
```

### 5. Indie Hackers / Maker Communities

Use these for product feedback and backlinks, not as the main user acquisition channel.

Post angle:

```text
I launched FieldBill, a simple Android invoice app for independent contractors. The business model is 3 free invoices, then a one-time Pro unlock. I am looking for feedback on positioning and first-user outreach to tradespeople rather than generic app users.
```

### 6. Existing Tester / Contact Lists

Existing files:

- `docs\tester-outreach-targets.csv`
- `docs\friend-tester-email-list.csv`
- `docs\play-tester-emails.csv`

Action:

- Reuse only contacts who expected app/tester outreach.
- Do not send unsolicited bulk SMS.
- Send individually or in small batches with feedback-focused wording.

## Launch Day Checklist

1. Confirm Play production or public listing link opens as expected.
2. Post or send the direct local outreach message to 10 relevant people.
3. Post in 1 local Facebook group if rules allow.
4. Post in 1 relevant Reddit community only after reading rules.
5. Submit Product Hunt if the Play listing is public and screenshots are ready.
6. Log replies, installs, objections, and feature requests in `PROJECT-STATUS.md` or a separate outreach log.

## Follow-Up Questions To Ask Users

- What kind of work do you invoice for?
- Did setup take too long?
- Did labor and parts entry make sense?
- Was the invoice review screen clear?
- Would you trust this on a real job?
- What would stop you from using it tomorrow?
- Is the one-time unlock clear and fair?

