/**
 * HAVEN RENTALS — Listings Data
 * ------------------------------------------------------
 * Edit this file to add, remove, or update properties.
 * Each listing needs a `rooms` array — these populate the
 * mini carousel (sitting room, bedroom, kitchen, etc.)
 *
 * Currently each room points to a styled placeholder
 * illustration in images/rooms/*.svg. When you have real
 * photos, just replace the `image` path with your photo
 * path (e.g. "images/willow-loft-sitting.jpg").
 *
 * Image sizing: carousel photos work best around
 * 1200x920px (4:3.1 ratio), landscape, well-lit.
 *
 * Set `image: null` on a room to fall back to the emoji
 * if you ever remove a placeholder without a replacement.
 * ------------------------------------------------------
 */

const LISTINGS_DATA = [
  {
    id: "willow-loft",
    name: "The Willow Loft",
    location: "Maitama, Abuja",
    description:
      "A top-floor loft wrapped in glass, with a private balcony that catches the evening light over Maitama. Quiet streets, five minutes from the embassies.",
    pricePerNight: 85000,
    currency: "₦",
    rating: 4.9,
    reviewCount: 38,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Fast WiFi", "Air Conditioning", "Generator Backup", "Free Parking"],
    rooms: [
      { label: "Sitting Room", image: "images/rooms/sitting-room.png", emoji: "🛋️" },
      { label: "Bedroom", image: "images/rooms/bedroom.png", emoji: "🛏️" },
      { label: "Kitchen", image: "images/rooms/kitchen.png", emoji: "🍳" },
      { label: "Balcony View", image: "images/rooms/balcony.png", emoji: "🌇" }
    ]
  },
  {
    id: "copper-house",
    name: "Copper House",
    location: "Ikoyi, Lagos",
    description:
      "A renovated mid-century home on a tree-lined close. Warm wood floors throughout, a kitchen built for actually cooking, and a generator that never sleeps.",
    pricePerNight: 120000,
    currency: "₦",
    rating: 5.0,
    reviewCount: 52,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Fast WiFi", "Pool Access", "Air Conditioning", "Daily Cleaning"],
    rooms: [
      { label: "Sitting Room", image: "images/rooms/sitting-room.png", emoji: "🛋️" },
      { label: "Main Bedroom", image: "images/rooms/bedroom.png", emoji: "🛏️" },
      { label: "Kitchen", image: "images/rooms/kitchen.png", emoji: "🍳" },
      { label: "Pool Deck", image: "images/rooms/pool.png", emoji: "🏊" }
    ]
  },
  {
    id: "the-quarry",
    name: "The Quarry",
    location: "Jabi, Abuja",
    description:
      "Compact, sharply designed, and ten minutes from the lake. Built for the short stay that doesn't feel like a hotel room — full kitchen, real furniture, real quiet.",
    pricePerNight: 55000,
    currency: "₦",
    rating: 4.7,
    reviewCount: 21,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Fast WiFi", "Air Conditioning", "Workspace", "Free Parking"],
    rooms: [
      { label: "Sitting Room", image: "images/rooms/sitting-room.png", emoji: "🛋️" },
      { label: "Bedroom", image: "images/rooms/bedroom.png", emoji: "🛏️" },
      { label: "Kitchenette", image: "images/rooms/kitchen.png", emoji: "🍳" }
    ]
  },
  {
    id: "harbour-view",
    name: "Harbour View Residence",
    location: "Victoria Island, Lagos",
    description:
      "Floor-to-ceiling windows facing the marina. A two-minute walk to the best restaurants on the island, and a building team that actually answers the phone.",
    pricePerNight: 150000,
    currency: "₦",
    rating: 4.8,
    reviewCount: 64,
    guests: 5,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Fast WiFi", "Gym Access", "Air Conditioning", "24/7 Security"],
    rooms: [
      { label: "Sitting Room", image: "images/rooms/sitting-room.png", emoji: "🛋️" },
      { label: "Main Bedroom", image: "images/rooms/bedroom.png", emoji: "🛏️" },
      { label: "Kitchen", image: "images/rooms/kitchen.png", emoji: "🍳" },
      { label: "Marina View", image: "images/rooms/marina-view.jpg", emoji: "🌊" }
    ]
  },
  {
    id: "garden-court",
    name: "Garden Court Apartment",
    location: "Wuse 2, Abuja",
    description:
      "Ground-floor, with a private garden patio that gets morning sun. The kind of place that makes a week-long trip feel like you actually live somewhere.",
    pricePerNight: 65000,
    currency: "₦",
    rating: 4.6,
    reviewCount: 17,
    guests: 3,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Fast WiFi", "Garden Patio", "Generator Backup", "Free Parking"],
    rooms: [
      { label: "Sitting Room", image: "images/rooms/sitting-room.png", emoji: "🛋️" },
      { label: "Bedroom", image: "images/rooms/bedroom.png", emoji: "🛏️" },
      { label: "Kitchen", image: "images/rooms/kitchen.png", emoji: "🍳" },
      { label: "Garden Patio", image: "images/rooms/garden.jpg", emoji: "🌿" }
    ]
  },
  {
    id: "north-bank",
    name: "North Bank Studio",
    location: "Asokoro, Abuja",
    description:
      "A clean, minimal studio for the traveler who needs less, not more. Walking distance to the diplomatic district, with a rooftop that catches every sunset.",
    pricePerNight: 45000,
    currency: "₦",
    rating: 4.9,
    reviewCount: 29,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Fast WiFi", "Rooftop Access", "Air Conditioning", "Workspace"],
    rooms: [
      { label: "Sitting Room", image: "images/rooms/sitting-room.png", emoji: "🛋️" },
      { label: "Bedroom", image: "images/rooms/bedroom.png", emoji: "🛏️" },
      { label: "Kitchen", image: "images/rooms/kitchen.png", emoji: "🍳" },
      { label: "Rooftop", image: "images/rooms/rooftop.svg", emoji: "🌆" }
    ]
  }
];
