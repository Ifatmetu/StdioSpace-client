export interface Studio {
  id: string | number;
  title: string;
  category: string;
  categoryKey: "photo" | "stage" | "pod" | "music" | "art";
  price: number;
  deposit: number;
  capacity: number;
  location: string;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  owner: string;
  ownerEmail: string;
  overview: string;
  gradient: string;
  image?: string;
}

export interface Category {
  name: string;
  key: "photo" | "stage" | "pod" | "music" | "art";
  gradient: string;
  iconName: string;
}

export const CATEGORIES: Category[] = [
  {
    name: "Photo Studio",
    key: "photo",
    gradient: "from-[#d6247f] to-[#ff9a3c]",
    iconName: "Camera",
  },
  {
    name: "Film Stage",
    key: "stage",
    gradient: "from-[#3a1fa8] to-[#0a9fb8]",
    iconName: "Video",
  },
  {
    name: "Podcast Lounge",
    key: "pod",
    gradient: "from-[#0b7a6b] to-[#7be0a0]",
    iconName: "Mic",
  },
  {
    name: "Music Suite",
    key: "music",
    gradient: "from-[#7a1fa8] to-[#ff4fa3]",
    iconName: "Music",
  },
  {
    name: "Workshop",
    key: "art",
    gradient: "from-[#e0762b] to-[#f4d03f]",
    iconName: "Palette",
  },
];

export const BOOKING_STEPS = [
  {
    step: "01",
    title: "Discover spaces",
    description: "Filter by category, price, capacity and location to find your dream creative setting.",
  },
  {
    step: "02",
    title: "Select shoot hours",
    description: "Pick an available date and reserve exact hours with transparent hourly rates.",
  },
  {
    step: "03",
    title: "Book instantly",
    description: "Send your reservation request with instant confirmation and secure deposits.",
  },
  {
    step: "04",
    title: "Create and produce",
    description: "Show up, set up your gear, and bring your creative vision to life without hassle.",
  },
];

export const GUARANTEES = [
  {
    iconName: "ShieldCheck",
    title: "Liability protection",
    description: "Every studio booking includes property damage coverage up to the listed security deposit.",
  },
  {
    iconName: "UserCheck",
    title: "Verified profiles",
    description: "Both hosts and creators confirm identity and credentials before confirming reservations.",
  },
  {
    iconName: "Wrench",
    title: "Equipment safety",
    description: "Hosts inspect all in-house lighting, sound, and backdrop equipment before each session.",
  },
  {
    iconName: "Headphones",
    title: "24/7 creator support",
    description: "Reach our dedicated creator success team via live chat or phone any hour of the day.",
  },
];
