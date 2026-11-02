export interface Studio {
  id: number;
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
  count: number;
}

export const CATEGORIES: Category[] = [
  {
    name: "Photo Studio",
    key: "photo",
    gradient: "from-[#d6247f] to-[#ff9a3c]",
    iconName: "Camera",
    count: 14,
  },
  {
    name: "Film Stage",
    key: "stage",
    gradient: "from-[#3a1fa8] to-[#0a9fb8]",
    iconName: "Video",
    count: 8,
  },
  {
    name: "Podcast Lounge",
    key: "pod",
    gradient: "from-[#0b7a6b] to-[#7be0a0]",
    iconName: "Mic",
    count: 19,
  },
  {
    name: "Music Suite",
    key: "music",
    gradient: "from-[#7a1fa8] to-[#ff4fa3]",
    iconName: "Music",
    count: 11,
  },
  {
    name: "Workshop",
    key: "art",
    gradient: "from-[#e0762b] to-[#f4d03f]",
    iconName: "Palette",
    count: 7,
  },
];

export const STUDIOS: Studio[] = [
  {
    id: 1,
    title: "Halo Cyc Wall",
    category: "Photo Studio",
    categoryKey: "photo",
    price: 45,
    deposit: 100,
    capacity: 12,
    location: "Gulshan 2, Dhaka",
    rating: 4.9,
    reviewsCount: 38,
    amenities: ["Cyc wall", "Lighting kit", "Makeup room", "Wi-Fi"],
    owner: "Rina Ahmed",
    ownerEmail: "rina@mail.com",
    overview: "A 1,200 sq ft white cyclorama with strobe packages, natural skylight, and a quiet makeup room.",
    gradient: "from-[#d6247f] via-[#e83e8c] to-[#ff9a3c]",
  },
  {
    id: 2,
    title: "Blackbox Stage 4",
    category: "Film Stage",
    categoryKey: "stage",
    price: 120,
    deposit: 300,
    capacity: 40,
    location: "Banani, Dhaka",
    rating: 4.8,
    reviewsCount: 24,
    amenities: ["Green screen", "Lighting kit", "Parking", "Wi-Fi"],
    owner: "Tariq Hasan",
    ownerEmail: "tariq@mail.com",
    overview: "Sound stage with 20 ft ceiling, grid rigging, blackout curtains, and direct loading dock access.",
    gradient: "from-[#3a1fa8] via-[#1f4ea8] to-[#0a9fb8]",
  },
  {
    id: 3,
    title: "Velvet Mic Lounge",
    category: "Podcast Lounge",
    categoryKey: "pod",
    price: 30,
    deposit: 50,
    capacity: 5,
    location: "Dhanmondi, Dhaka",
    rating: 4.7,
    reviewsCount: 52,
    amenities: ["Soundproofing", "Wi-Fi", "Mixing console"],
    owner: "Nila Das",
    ownerEmail: "nila@mail.com",
    overview: "Four-mic podcast room with acoustically treated walls, Shure SM7B mics, and a comfortable guest lounge sofa.",
    gradient: "from-[#0b7a6b] via-[#0d9488] to-[#7be0a0]",
  },
  {
    id: 4,
    title: "Tape Room Recording",
    category: "Music Suite",
    categoryKey: "music",
    price: 60,
    deposit: 150,
    capacity: 8,
    location: "Uttara, Dhaka",
    rating: 4.9,
    reviewsCount: 31,
    amenities: ["Soundproofing", "Mixing console", "Parking"],
    owner: "Imran Khan",
    ownerEmail: "imran@mail.com",
    overview: "Live room plus dedicated control room with vintage analog console and an isolation booth.",
    gradient: "from-[#7a1fa8] via-[#9333ea] to-[#ff4fa3]",
  },
  {
    id: 5,
    title: "Clay & Kiln Workshop",
    category: "Workshop",
    categoryKey: "art",
    price: 25,
    deposit: 60,
    capacity: 15,
    location: "Mirpur, Dhaka",
    rating: 4.6,
    reviewsCount: 19,
    amenities: ["Wi-Fi", "Parking", "Lighting kit"],
    owner: "Sara Islam",
    ownerEmail: "sara@mail.com",
    overview: "Open art workshop with spacious wooden workbench tables, high ventilation, and secure storage racks.",
    gradient: "from-[#e0762b] via-[#ea580c] to-[#f4d03f]",
  },
  {
    id: 6,
    title: "Northlight Loft",
    category: "Photo Studio",
    categoryKey: "photo",
    price: 55,
    deposit: 120,
    capacity: 10,
    location: "Bashundhara, Dhaka",
    rating: 4.8,
    reviewsCount: 43,
    amenities: ["Lighting kit", "Wi-Fi", "Makeup room"],
    owner: "Rina Ahmed",
    ownerEmail: "rina@mail.com",
    overview: "Natural-light loft with floor-to-ceiling windows, wooden floors, and a versatile rotating set of backdrops.",
    gradient: "from-[#d6247f] via-[#ec4899] to-[#fb923c]",
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
