import type { MenuItem } from "./menu";

export type Extra = { id: string; label: string; price: number };

/**
 * ⚠️  PRICES BELOW ARE PLACEHOLDERS. Confirm every price with the restaurant before release.
 * Edit prices here only; they flow through the dish sheet, cart and order email automatically.
 * To add an add-on: add a line to a set. To change which dish uses which set: see SET_BY_ITEM / SET_BY_CATEGORY.
 */
const x = (id: string, label: string, price: number): Extra => ({ id, label, price });

const SETS: Record<string, Extra[]> = {
  noodlesRice: [
    x("chicken", "Extra chicken", 5),
    x("beef", "Extra beef", 6),
    x("prawns", "Extra king prawns", 8),
    x("tofu", "Extra tofu", 3),
    x("veg", "Extra vegetables", 3),
    x("egg", "Add fried egg", 2),
    x("sauce", "Extra sauce", 1.5),
  ],
  curry: [
    x("chicken", "Extra chicken", 5),
    x("beef", "Extra beef", 6),
    x("prawns", "Extra king prawns", 8),
    x("tofu", "Extra tofu", 3),
    x("veg", "Extra vegetables", 3),
    x("rice", "Steamed rice", 3.5),
    x("sauce", "Extra curry sauce", 2),
  ],
  steak: [
    x("beef", "Extra steak slices", 8),
    x("rice", "Steamed rice", 3.5),
    x("sauce", "Extra dipping sauce", 1.5),
  ],
  thaiSalad: [
    x("beef", "Extra beef", 7),
    x("dressing", "Extra dressing", 1.5),
  ],
  pasta: [
    x("chicken", "Extra chicken", 5),
    x("bacon", "Extra bacon", 4),
    x("prawns", "Extra king prawns", 8),
    x("mushrooms", "Extra mushrooms", 3),
    x("parmesan", "Extra parmesan", 2),
    x("sauce", "Extra sauce", 2),
  ],
  burger: [
    x("patty", "Extra patty", 8),
    x("bacon", "Add bacon", 4),
    x("cheese", "Extra cheese", 2),
    x("egg", "Add fried egg", 2.5),
    x("sauce", "Extra house sauce", 1.5),
    x("chips", "Extra chips", 5),
  ],
  caesar: [
    x("chicken", "Add chicken", 5),
    x("bacon", "Extra bacon bits", 3),
    x("parmesan", "Extra parmesan", 2),
    x("dressing", "Extra dressing", 1.5),
  ],
  schnitzel: [
    x("gravy", "Extra gravy", 2),
    x("cheese", "Add cheese", 2),
    x("bacon", "Add bacon", 4),
    x("egg", "Add fried egg", 2.5),
    x("chips", "Extra chips", 5),
  ],
  fries: [
    x("bacon", "Extra bacon", 4),
    x("chicken", "Extra chicken", 5),
    x("cheese", "Extra cheese sauce", 2),
    x("jalapenos", "Extra jalapeños", 1.5),
    x("sour", "Extra sour cream", 1.5),
    x("salsa", "Extra salsa", 1.5),
  ],
  starter: [x("dip", "Extra dipping sauce", 1.5)],
  calamari: [x("tartare", "Extra tartare sauce", 1.5), x("lemon", "Extra lemon wedge", 0.5)],
  garlicPrawns: [x("prawns", "Extra king prawns", 8), x("rice", "Extra steamed rice", 3.5)],
  arancini: [x("napoli", "Extra napolitana sauce", 2), x("parmesan", "Extra parmesan", 2)],
  breakfast: [
    x("egg", "Extra egg", 2.5),
    x("bacon", "Extra bacon", 4),
    x("avocado", "Add avocado", 4),
    x("sausage", "Extra sausage", 3),
    x("hash", "Extra hash brown", 3),
    x("mushrooms", "Add mushrooms", 3),
    x("toast", "Extra toast", 2),
  ],
  coffee: [
    x("shot", "Extra shot", 1.5),
    x("plant", "Plant-based milk", 1),
    x("cream", "Whipped cream", 1),
  ],
  iced: [
    x("scoop", "Extra ice cream scoop", 2.5),
    x("shot", "Extra shot", 1.5),
    x("cream", "Extra whipped cream", 1),
  ],
  shake: [x("scoop", "Extra ice cream scoop", 2.5), x("cream", "Whipped cream", 1)],
  boba: [x("pearls", "Extra boba pearls", 1.5), x("jelly", "Add jelly", 1.5)],
  matcha: [
    x("matcha", "Extra matcha shot", 2),
    x("pearls", "Add boba pearls", 1.5),
    x("plant", "Plant-based milk", 1),
  ],
};

const SET_BY_ITEM: Record<string, keyof typeof SETS> = {
  "pad-thai": "noodlesRice",
  "thai-fried-rice": "noodlesRice",
  "pad-kee-mao": "noodlesRice",
  "thai-curries": "curry",
  "crying-tiger": "steak",
  "thai-beef-salad": "thaiSalad",
  "caesar-salad": "caesar",
  "dk-burgers": "burger",
  "loaded-fries": "fries",
  "chicken-schnitzel": "schnitzel",
  "chicken-parmigiana": "schnitzel",
  "jager-schnitzel": "schnitzel",
  "salt-pepper-calamari": "calamari",
  "garlic-prawns": "garlicPrawns",
  "dk-arancini": "arancini",
  "espresso-royale": "coffee",
  "iced-obsessions": "iced",
  "fruit-thick-shakes": "shake",
  "frosty-boba": "boba",
  "matcha-series": "matcha",
};

const SET_BY_CATEGORY: Record<string, keyof typeof SETS> = {
  small: "starter",
  thai: "noodlesRice",
  italian: "pasta",
  burgers: "burger",
  pub: "schnitzel",
  breakfast: "breakfast",
  drinks: "coffee",
};

/** Add-ons offered for a dish. */
export function extrasFor(item: MenuItem): Extra[] {
  const key = SET_BY_ITEM[item.id] ?? SET_BY_CATEGORY[item.category];
  return key ? SETS[key] : [];
}
