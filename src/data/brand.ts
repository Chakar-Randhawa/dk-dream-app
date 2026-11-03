export const BRAND = {
  name: "DK Dream Kitchen",
  shortName: "DK",
  tagline: "Authentic Thai Flavors & Western Comfort Food in Young",
  // Circular logo used everywhere in the app
  logo: "https://i.ibb.co/Jw3HgKzt/462200874-122157239804265677-1771018273153991156-n.jpg",
  // First hero slide (shown with resizeMode "contain" over a blurred backdrop so nothing is cropped)
  heroFirst:
    "https://i.ibb.co/ynGVHsJb/473152270-122176506776265677-3342232301614794703-n.jpg",
  /** true = show the onboarding on every app start; false = only on first launch */
  onboardingEveryLaunch: false,
  phone: "02 6382 4824",
  phoneLink: "tel:0263824824",
  email: "dkdreamk@gmail.com",
  address: "219 Boorowa St, Young NSW 2594",
  facebook: "https://www.facebook.com/61557970323499/",
  instagram: "https://www.instagram.com/dk.dreamkitchen/",
  hours: [{ days: "Monday to Saturday", time: "5:00 PM – 9:00 PM" }],
  daysShort: "Mon–Sat",
  /** Day numbers (0 = Sunday) the restaurant is closed */
  closedDays: [0] as number[],
  // Address used for the Google Maps embed and directions links
  mapQuery: "219 Boorowa St, Young NSW 2594",
  lat: -34.3139,
  lng: 148.2997,
} as const;

export const TIME_SLOTS = [
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];
