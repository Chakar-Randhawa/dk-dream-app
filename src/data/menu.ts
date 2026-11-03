export type CategoryId =
  | "small"
  | "thai"
  | "italian"
  | "burgers"
  | "pub"
  | "breakfast"
  | "drinks";

export type Variant = { label: string; price: number };
export type Choice = { label: string; options: string[] };

export type MenuItem = {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  /** Fixed price in AUD. Omit when the item has variants or the menu lists no price. */
  price?: number;
  /** Price tiers taken from the menu (e.g. curry protein options). */
  variants?: Variant[];
  /** Pick-one options that do not change the price (e.g. curry type, flavour). */
  choices?: Choice[];
  /** Only set where the menu itself says so. */
  tags?: ("Vegetarian" | "Vegetarian option")[];
  image: string;
  popular?: boolean;
};

export const CATEGORIES: { id: CategoryId; label: string; emoji: string }[] = [
  { id: "small", label: "Small & Share Plates", emoji: "🍟" },
  { id: "thai", label: "Thai Specialties", emoji: "🍜" },
  { id: "italian", label: "Italian Pastas", emoji: "🍝" },
  { id: "burgers", label: "Burgers & Salads", emoji: "🍔" },
  { id: "pub", label: "Pub Mains & Fries", emoji: "🥩" },
  { id: "breakfast", label: "All-Day Breakfast", emoji: "🍳" },
  { id: "drinks", label: "Matcha, Boba & Drinks", emoji: "🧋" },
];

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const MENU: MenuItem[] = [
  // ───────── Small & Share Plates ─────────
  {
    id: "cocktail-spring-rolls",
    category: "small",
    name: "Bowl of Cocktail Spring Rolls",
    description: "Tasty crisp bite-sized sharing basket.",
    price: 17.25,
    image: u("photo-1606525437679-037aca74a3e9"),
  },
  {
    id: "thai-spring-rolls",
    category: "small",
    name: "Thai Spring Rolls / Vegetable Spring Rolls",
    description: "(4 Pieces) Classic crispy rolls.",
    price: 13.8,
    image: u("photo-1548943487-a2e4e43b4853"),
  },
  {
    id: "curry-puffs",
    category: "small",
    name: "Curry Puffs",
    description: "(4 Pieces) Crispy golden savory pockets.",
    price: 13.8,
    image: u("photo-1601050690597-df0568f70950"),
  },
  {
    id: "salt-pepper-calamari",
    category: "small",
    name: "Crumbed Salt & Pepper Calamari",
    description: "Served with side salad, lemon wedge, and tartare sauce.",
    price: 18.4,
    image: u("photo-1604909052743-94e838986d24"),
    popular: true,
  },
  {
    id: "garlic-prawns",
    category: "small",
    name: "Garlic Prawns with Steamed Rice",
    description: "Juicy king prawns swimming in a rich garlic creamy sauce base.",
    price: 20.7,
    image: u("photo-1559737558-2f5a35f4523b"),
  },
  {
    id: "dk-arancini",
    category: "small",
    name: "DK Arancini",
    description:
      "(4 Pieces) Mushroom arancini served beautifully over napolitana sauce topped with herbs & parmesan cheese.",
    price: 23.0,
    image: u("photo-1595295333158-4742f28fbd85"),
  },
  {
    id: "siomai-momo",
    category: "small",
    name: "Special Filipino Chicken Siomai / Steaming Momo",
    description:
      "Handcrafted steamed juicy dumplings drizzled with home-made spicy chilli garlic sauce.",
    price: 18.5,
    image: u("photo-1496116218417-1a781b1c416c"),
  },

  // ───────── Thai Chef Specials & Aromatic Curries ─────────
  {
    id: "pad-thai",
    category: "thai",
    name: "Classic Pad Thai",
    description: "Authentic flat stir-fried rice noodle dish.",
    price: 24.15,
    image: u("photo-1559314809-0d155014e29e"),
    popular: true,
  },
  {
    id: "thai-fried-rice",
    category: "thai",
    name: "Thai Special Fried Rice",
    description:
      "Aromatic jasmine rice tossed with mixed vegetables and select proteins.",
    price: 24.15,
    image: u("photo-1603133872878-684f208fb84b"),
  },
  {
    id: "pad-kee-mao",
    category: "thai",
    name: "Pad Kee Mao (Drunken Noodles)",
    description:
      "Wok-tossed thick rice noodles packed with fragrant Thai herbs and spicy chili basil.",
    price: 24.15,
    image: u("photo-1569562211093-4ed0d0758f12"),
    popular: true,
  },
  {
    id: "thai-curries",
    category: "thai",
    name: "Classic Thai Curries",
    description: "Traditional slow-cooked authentic rich curries.",
    choices: [
      {
        label: "Curry",
        options: ["Green", "Red", "Panang", "Mussaman"],
      },
    ],
    variants: [
      { label: "Vegetarian · seasonal vegetables & tofu", price: 29.9 },
      { label: "Chicken / Beef · stewed in coconut milk cream", price: 32.2 },
      { label: "Premium King Prawn · rich seafood curry base", price: 34.5 },
    ],
    tags: ["Vegetarian option"],
    image: u("photo-1455619452474-d2be8b1e70cd"),
    popular: true,
  },
  {
    id: "crying-tiger",
    category: "thai",
    name: "Crying Tiger Steak",
    description:
      "Ultimate premium Thai-marinated grilled juicy beef steak served with custom dipping sauce.",
    price: 36.8,
    image: u("photo-1600891964092-4316c288032e"),
    popular: true,
  },

  // ───────── Premium Italian Pastas & Risottos ─────────
  {
    id: "carbonara",
    category: "italian",
    name: "Creamy Carbonara Pasta",
    description:
      "Spaghetti cooked with crispy bacon, creamy egg-parmesan sauce, and cracked pepper.",
    price: 27.6,
    image: u("photo-1612874742237-6526221588e3"),
  },
  {
    id: "boscaiola",
    category: "italian",
    name: "Fettuccine Boscaiola",
    description:
      "Sautéed bacon, button mushrooms, and onions bound in a silky cream reduction sauce.",
    price: 27.6,
    image: u("photo-1621996346565-e3dbc646d9a9"),
  },
  {
    id: "bolognese",
    category: "italian",
    name: "Spaghetti Bolognese",
    description:
      "Slow-simmered rich seasoned minced beef with authentic Italian bolognese sauce.",
    price: 28.75,
    image: u("photo-1551183053-bf91a1d81141"),
  },
  {
    id: "spanish-tomato-chicken",
    category: "italian",
    name: "Spanish Tomato Chicken Pasta",
    description:
      "Spaghetti tossed with juicy chicken breast, sun-dried tomatoes, garlic, and chili flakes in rich Napoli sauce.",
    price: 28.75,
    image: u("photo-1473093295043-cdd812d0e601"),
  },
  {
    id: "veggie-fettuccine",
    category: "italian",
    name: "Veggie Fettuccine Pasta (V)",
    description:
      "Garden fresh seasonal vegetables and sun-dried tomatoes slow-cooked in a robust napolitana sauce.",
    price: 28.75,
    tags: ["Vegetarian"],
    image: u("photo-1556761223-4c4282c73f77"),
  },
  {
    id: "chicken-fettuccine",
    category: "italian",
    name: "Chicken Fettuccine",
    description:
      "Tender chicken strips and mushrooms tossed in an elegant pink cream sauce.",
    price: 29.9,
    image: u("photo-1645112411341-6c4fd023714a"),
  },
  {
    id: "prawn-fettuccine",
    category: "italian",
    name: "Prawn Fettuccine",
    description:
      "Plump king prawns with fresh shallots and garlic cooked in a white wine cream sauce base.",
    price: 32.2,
    image: u("photo-1563379926898-05f4575a45d8"),
  },

  // ───────── Gourmet Burgers & Fresh Salads ─────────
  {
    id: "dk-burgers",
    category: "burgers",
    name: "DK Classic Burgers",
    description:
      "Stacked premium burgers loaded with oak lettuce, fresh tomatoes, cheese and house signature sauce, served with a generous side of hot crunchy chips.",
    choices: [
      {
        label: "Burger",
        options: ["Wagyu Beef", "Crispy Chicken", "Grilled Mushroom Veggie"],
      },
    ],
    variants: [
      { label: "Classic", price: 23.0 },
      { label: "Double patty / extra bacon (up to)", price: 32.2 },
    ],
    tags: ["Vegetarian option"],
    image: u("photo-1568901346375-23c9450c58cd"),
    popular: true,
  },
  {
    id: "caesar-salad",
    category: "burgers",
    name: "Classic Caesar Salad",
    description:
      "Crisp cos lettuce, crunchy croutons, bacon bits, shaved parmesan, and Caesar dressing.",
    price: 27.6,
    image: u("photo-1550304943-4f24f54ddde9"),
  },
  {
    id: "thai-beef-salad",
    category: "burgers",
    name: "Thai Beef Salad",
    description:
      "Sliced tender marinated beef tossed with fresh Asian herbs, greens, cucumbers, and a zesty spicy-sour dressing.",
    price: 34.5,
    image: u("photo-1512621776951-a57141f2eefd"),
  },

  // ───────── Pub Style Mains & Loaded Fries ─────────
  {
    id: "chicken-schnitzel",
    category: "pub",
    name: "House-made Chicken Schnitzel",
    description:
      "Large hand-crumbed crispy chicken breast served with traditional gravy and hot hand-cut chips.",
    price: 26.0,
    image: u("photo-1599921841143-819065a55cc6"),
    popular: true,
  },
  {
    id: "chicken-parmigiana",
    category: "pub",
    name: "Chicken Parmigiana",
    description:
      "Melted mozzarella cheese and rich traditional marinara sauce layered over their signature hot schnitzel base served with chips.",
    price: 29.5,
    image: u("photo-1632778149955-e80f8ceca2e8"),
  },
  {
    id: "jager-schnitzel",
    category: "pub",
    name: "Jäger Schnitzel",
    description:
      "Crispy schnitzel topped with a rich, velvety German-style mushroom hunter gravy.",
    price: 29.5,
    image: u("photo-1604908176997-125f25cc6f3d"),
  },
  {
    id: "loaded-fries",
    category: "pub",
    name: "DK Loaded Fries",
    description:
      "Hot golden chips dripping with dynamic toppings, melted cheese sauce, salsa, jalapeños, and sour cream layers.",
    choices: [{ label: "Topping", options: ["Bacon", "Chicken", "Veggie"] }],
    variants: [
      { label: "Base loaded", price: 17.25 },
      { label: "Full triple-meat loaded", price: 31.05 },
    ],
    tags: ["Vegetarian option"],
    image: u("photo-1630384060421-cb20d0e0649d"),
  },

  // ───────── All-Day Breakfast & Casual Brunch (menu lists no prices) ─────────
  {
    id: "smashed-avocado",
    category: "breakfast",
    name: "DK Smashed Avocado",
    description:
      "Thick sourdough toast topped with seasoned smashed avocado, creamy scrambled eggs, and mixed fresh green micro-herbs.",
    image: u("photo-1541519227354-08fa5d50c44d"),
  },
  {
    id: "brioche-french-toast",
    category: "breakfast",
    name: "Crunchy Brioche French Toast",
    description:
      "Soft brioche bread dipped in custard, fried golden, and served with fruit purees and honey syrup.",
    image: u("photo-1484723091739-30a097e8f929"),
  },
  {
    id: "full-english",
    category: "breakfast",
    name: "Full English Breakfast Platter",
    description:
      "Loaded plate with fried eggs, crispy bacon, savory sausages, baked beans, golden hash browns, and grilled tomatoes.",
    image: u("photo-1533089860892-a7c6f0a88666"),
  },

  // ───────── 2026 Fresh Beverage Lineup (menu lists no prices) ─────────
  {
    id: "espresso-royale",
    category: "drinks",
    name: "Art of Espresso Royale Blend Coffee",
    description: "Rich local specialty coffee served hot.",
    image: u("photo-1509042239860-f550ce710b93"),
  },
  {
    id: "iced-obsessions",
    category: "drinks",
    name: "Classic Iced Obsessions",
    description:
      "Topped with whipped cream and a scoop of vanilla ice cream.",
    choices: [
      {
        label: "Flavour",
        options: ["Iced Coffee", "Iced Caramel", "Iced Hazelnut", "Iced Chocolate"],
      },
    ],
    image: u("photo-1461023058943-07fcbe16d735"),
  },
  {
    id: "fruit-thick-shakes",
    category: "drinks",
    name: "Fruit Thick Shakes",
    description: "Dense thick shakes made with pure fruit purees.",
    choices: [
      {
        label: "Flavour",
        options: ["Mango", "Strawberry", "Raspberry", "Blueberry"],
      },
    ],
    image: u("photo-1572490122747-3968b75cc699"),
  },
  {
    id: "frosty-boba",
    category: "drinks",
    name: "DK Frosty Boba Series",
    description: "Premium flavored brown sugar and milk iced bubble teas.",
    image: u("photo-1558857563-b371033873b8"),
    popular: true,
  },
  {
    id: "matcha-series",
    category: "drinks",
    name: "Signature Matcha Series",
    description: "Matcha fusion combinations.",
    choices: [
      {
        label: "Matcha",
        options: ["Matcha Cloud", "Strawberry Matcha", "Ube Matcha", "Mango Matcha"],
      },
    ],
    image: u("photo-1515823064-d6e0c04616a7"),
    popular: true,
  },
];

export const formatAUD = (n: number) => `$${n.toFixed(2)}`;

/** Price label for a card: "$24.15", "From $29.90" or "Ask in store". */
export const priceLabel = (item: MenuItem): string => {
  if (item.variants?.length) {
    const min = Math.min(...item.variants.map((v) => v.price));
    return `From ${formatAUD(min)}`;
  }
  if (typeof item.price === "number") return formatAUD(item.price);
  return "Price in store";
};
