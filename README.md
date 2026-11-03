# DK Dream Kitchen – Mobile App (Expo SDK 58, React Native, TypeScript)

Palette: main green #43952D (from the client), cream #F1E9D4, paper #F8F5EC.
Flow: animated splash -> onboarding (Next, Next, Next) -> Home. Tabs: Menu, Gallery, Home, Order, Contact, Reserve.

## Run locally
    npm install
    npx expo start

## Get the APK (GitHub Actions)
1. Create a GitHub repo and upload this whole folder (keep `package-lock.json` and the `.github` folder).
2. Push to `main`. Open the repo > Actions > "Build Android APK" (or press Run workflow).
3. When it finishes, download `DK-Dream-Kitchen-apk` from the run's Artifacts. Unzip and install the APK.
Versions are pinned (ubuntu-24.04, Node 22, JDK 17, `npm ci` from the lockfile), so no manual changes are needed.

## One-time email activation (free FormSubmit)
Bookings, orders and messages go to dkdreamk@gmail.com. The first submission triggers an
"Activate Form" email to that inbox: click the link once.

## Edit content
- `src/theme.ts` colours · `src/data/brand.ts` logo, contacts, hours · `src/data/menu.ts` menu
- `onboardingEveryLaunch` in brand.ts: false = onboarding only on first launch.

## iPhone (.ipa)
The same workflow also produces `DK-Dream-Kitchen-ipa` (an unsigned IPA). An unsigned IPA cannot be
installed directly: open it with Sideloadly (Windows/Mac) or AltStore, sign in with a free Apple ID and
install. Free Apple IDs expire the app after 7 days. For TestFlight / App Store you need a paid Apple
Developer account (a separate signed build is then required).

## Extras / add-ons and notes
- Every "+" opens a sheet: options, paid extras, a note (allergies, "no lettuce"), quantity.
- Extras and their prices live in `src/data/extras.ts` (CONFIRM PRICES WITH THE RESTAURANT before release).
- The Order tab has an Allergies & special requests box with quick allergy chips. Everything is included in the order email
  (subject starts with [ALLERGY] when any allergy is ticked).
- Opening days are set in `src/data/brand.ts` (Mon-Sat, Sundays are not offered for reservations).
