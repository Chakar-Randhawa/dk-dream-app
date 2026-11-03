export type Review = {
  id: string;
  name: string;
  localGuide?: boolean;
  text: string;
};

/** Real 5-star Google reviews of DK Dream Kitchen (text kept as written by the customers). */
export const REVIEWS: Review[] = [
  {
    id: "anth",
    name: "Anth M",
    localGuide: true,
    text: "Always came here for dinner while working in Young a few months ago. Grace provided us with amazing and friendly service. Every dish was perfect! The portions were perfect! The taste was perfect! What you get here is authentic food!",
  },
  {
    id: "sharon",
    name: "Sharon Jessen",
    localGuide: true,
    text: "Absolutely enjoyed my meal here the other night, the Jagerschnitzel, it's so good. The sauce on the very generous schnitzel is amazing. The chips were great too! Everyone else in our dinner booking were very happy too.",
  },
  {
    id: "vesna",
    name: "Vesna Belcic",
    text: "Wow was the word amongst us all when our food was brought to our table. Highly recommend DK restaurant and cafe if you are wanting delicious food that has been prepared with all the flavours and presented so beautifully for you.",
  },
  {
    id: "jayaram",
    name: "Jayaram Shrestha",
    localGuide: true,
    text: "Best food I have ever had in Young. The portions and the taste is amazing. Authentic Pad Thai. You must try this place and they have Momo as well.",
  },
  {
    id: "elizabeth",
    name: "Elizabeth Archer",
    text: "Had our first meal here tonight and the green curry was to die for! The special fried rice was huge and very satisfying. Highly recommend.",
  },
  {
    id: "dhurba",
    name: "Dhurba Chhetri",
    localGuide: true,
    text: "I visited this restaurant on its opening day and was pleasantly surprised by the experience. Despite the bustling crowd, the staff provided exceptional customer service and made me feel welcome from the moment I stepped in.",
  },
];
