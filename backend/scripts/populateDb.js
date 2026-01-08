const { pool } = require('../db');

const properties = [
  // Top Campings (Pawna) - 6 properties
  {
    title: "Pawna Riverside Glamping",
    price: "₹2,999",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Experience ultimate glamping at Pawna River with DJ and riverfront views.",
    amenities: ["Private Washroom", "DJ on Saturday", "Riverview", "Food Included", "Free Activities", "Bonfire", "Garden", "Music", "Liquor Bar"],
    location: "Pawna Lake",
    rating: 4.7,
    category: "camping",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["River views", "DJ performance", "Bonfire night", "Garden access"],
    activities: ["Boating", "Bonfire", "Music", "Nature walks"],
    policies: ["Free cancellation up to 7 days", "No refund within 3 days"],
    contact: "+91 8669505727",
  },
  {
    title: "CozyNest at Chavsar – Pawna Lake",
    price: "₹3,300",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Cozy camping experience at Pawna with food included and lake access.",
    amenities: ["Private Washroom", "Food Included", "Paid Boating", "Bonfire", "Lake Access"],
    location: "Pawna Lake",
    rating: 4.5,
    category: "camping",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Lake access", "Paid boating", "Bonfire", "Food included"],
    activities: ["Boating", "Bonfire", "Swimming", "Fishing"],
    policies: ["Free cancellation up to 7 days", "50% refund 3-7 days"],
    contact: "+91 8669505727",
  },
  {
    title: "Lakeside Glamping Camp – Pawna Lake",
    price: "₹2,499",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Exclusive glamping camp with stargazing and lake access.",
    amenities: ["Canvas Tent", "Bonfire", "Stargazing", "Food Included", "Lake Access", "Free Activities", "Riverside View", "Camping Bed"],
    location: "Pawna Lake",
    rating: 4.8,
    category: "camping",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Stargazing", "Riverside views", "Canvas tents", "Free activities"],
    activities: ["Stargazing", "Bonfire", "Hiking", "Photography"],
    policies: ["Free cancellation up to 7 days"],
    contact: "+91 8669505727",
  },
  {
    title: "Adventure Camping Resort – Pawna",
    price: "₹2,799",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Adventure-packed camping with nature trails and photography opportunities.",
    amenities: ["Adventure Activities", "Campfire", "Stargazing", "Food Included", "Nature Trails", "Photography Points", "Lake Proximity", "Friendly Staff"],
    location: "Pawna Lake",
    rating: 4.7,
    category: "camping",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Adventure activities", "Nature trails", "Photography points", "Lake proximity"],
    activities: ["Hiking", "Adventure sports", "Photography", "Bonfire"],
    policies: ["Free cancellation up to 7 days"],
    contact: "+91 8669505727",
  },
  {
    title: "Nature's Embrace Camping – Pawna",
    price: "₹2,599",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Peaceful camping with local cuisine and expert guides.",
    amenities: ["Tent Stay", "Bonfire", "Local Cuisine", "Hiking", "Bird Watching", "Photography", "Sunset View", "Expert Guides"],
    location: "Pawna Lake",
    rating: 4.6,
    category: "camping",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Sunset views", "Expert guides", "Local cuisine", "Bird watching"],
    activities: ["Bird watching", "Hiking", "Photography", "Bonfire"],
    policies: ["Free cancellation up to 7 days"],
    contact: "+91 8669505727",
  },
  {
    title: "Pawna Eco Glamping Site",
    price: "₹3,099",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Eco-friendly glamping with organic food and wellness activities.",
    amenities: ["Eco-friendly Tents", "Organic Food", "Nature Walks", "Wellness Activities", "Bonfire", "Lake View", "Sustainable Practices", "Garden Access"],
    location: "Pawna Lake",
    rating: 4.9,
    category: "camping",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Eco-friendly", "Organic food", "Wellness center", "Lake views"],
    activities: ["Yoga", "Nature walks", "Meditation", "Bonfire"],
    policies: ["Free cancellation up to 7 days"],
    contact: "+91 8669505727",
  },
  // Top Cottages (Pawna) - 7 properties
  {
    title: "AC House with Sleeping Loft – Pawna Lake",
    price: "₹3,199",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Comfortable AC cottage with swimming pool and lake activities.",
    amenities: ["Private Washroom", "AC", "Common Swimming Pool", "Food Included", "Free Activities", "Paid Boating", "Bonfire", "Lake Access"],
    location: "Pawna Lake",
    rating: 4.6,
    category: "cottage",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["AC rooms", "Swimming pool", "Lake activities", "Food included"],
    activities: ["Boating", "Swimming", "Bonfire", "Games"],
    contact: "+91 8669505727",
  },
  {
    title: "Lakestory Resort – Pawna Lake",
    price: "₹7,499",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Luxury cottage resort with private pool and smart entertainment.",
    amenities: ["Private Pool", "Private Washroom", "AC", "Mini Fridge", "Smart Projector", "Home Theatre", "BBQ", "Food Included", "Lake Touch"],
    location: "Pawna Lake",
    rating: 4.8,
    category: "cottage",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Private pool", "Home theatre", "BBQ area", "Lake touch"],
    activities: ["Swimming", "Movie nights", "BBQ", "Lake activities"],
    contact: "+91 8669505727",
  },
  {
    title: "Dew Dreams – Couple Stay with Private Pool",
    price: "₹8,249",
    priceNote: "per person with meal",
    capacity: 2,
    description: "Romantic couple retreat with private pool and spa services.",
    amenities: ["Private Pool", "Lakeview Room", "Steam Bath", "Food Included", "Free Activities", "Paid Boating", "Bonfire", "Garden", "Room Service"],
    location: "Pawna Lake",
    rating: 4.9,
    category: "cottage",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Private pool", "Steam bath", "Garden", "Lakeview"],
    activities: ["Couples yoga", "Spa", "Bonfire", "Boating"],
    contact: "+91 8669505727",
  },
  {
    title: "Serene Cottage Retreat – Pawna",
    price: "₹4,999",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Peaceful cottage with valley views and mini kitchen.",
    amenities: ["Private Cottage", "Valley View", "AC & Heater", "Attached Bathroom", "Mini Kitchen", "Bonfire", "Food Included", "Peaceful Location"],
    location: "Pawna Lake",
    rating: 4.7,
    category: "cottage",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Valley views", "Mini kitchen", "Private cottage", "Peaceful"],
    activities: ["Cooking", "Bonfire", "Nature walks", "Meditation"],
    contact: "+91 8669505727",
  },
  {
    title: "Riverside Cottage Escape – Pawna",
    price: "₹5,499",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Riverside cottage with water activities and natural beauty.",
    amenities: ["Riverside Location", "Private Cottage", "AC", "Balcony", "Food Included", "River Activities", "Bonfire", "Natural Beauty"],
    location: "Pawna Lake",
    rating: 4.8,
    category: "cottage",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Riverside views", "River activities", "Natural beauty", "Balcony"],
    activities: ["Boating", "Fishing", "River rafting", "Photography"],
    contact: "+91 8669505727",
  },
  {
    title: "Heritage Cottage Hotel – Pawna",
    price: "₹6,299",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Heritage cottage with fine dining and spa services.",
    amenities: ["Heritage Architecture", "Fine Dining", "Spa Services", "Lake View Rooms", "Conference Room", "Bonfire", "Multiple Restaurants", "24-Hour Service"],
    location: "Pawna Lake",
    rating: 4.9,
    category: "cottage",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Heritage design", "Fine dining", "Spa services", "Lake views"],
    activities: ["Spa treatments", "Fine dining", "Bonfire", "Cultural tours"],
    contact: "+91 8669505727",
  },
  {
    title: "Green Canvas Cottages",
    price: "₹3,199",
    priceNote: "Adult per night",
    capacity: 2,
    description: "Extreme lakeside location with boating, bonfire, and live music on Saturdays.",
    amenities: ["Food Included", "Boating (Extra cost)", "Bonfire", "Lake access", "Restaurant", "Private Washroom", "Live Music and DJ on Sat", "Activities"],
    location: "Pawna Lake, Lonavala",
    rating: 4.7,
    category: "cottage",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Lakeside location", "Live music", "Boating available", "Meal included"],
    activities: ["Badminton", "Carrom", "Archery", "Bonfire", "Music", "Boating"],
    contact: "+91 8669505727",
  },
  // Top Villas (Lonavala) - 6 properties
  {
    title: "Dome Story Resort – Malvandi Lake, Lonavala",
    price: "₹7,499",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Luxury dome villa resort with lake views and exclusive amenities.",
    amenities: ["Private Washroom", "AC", "Mini Fridge", "Electric Kettle", "BBQ", "Food Included", "Free Boating", "Bonfire", "Lake Access"],
    location: "Lonavala",
    rating: 4.9,
    category: "villa",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Lake views", "Dome architecture", "Free boating", "BBQ area"],
    activities: ["Boating", "Swimming", "Bonfire", "Stargazing"],
    contact: "+91 8669505727",
  },
  {
    title: "Luxury Villa Estate – Lonavala",
    price: "₹12,999",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Ultimate luxury villa with private chef and premium amenities.",
    amenities: ["Private Villa", "Mountain View", "Infinity Pool", "Private Chef", "Wine Cellar", "Spa", "Garden Terrace", "24-Hour Butler"],
    location: "Lonavala",
    rating: 4.9,
    category: "villa",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Private chef", "Infinity pool", "Wine cellar", "24-hour butler"],
    activities: ["Fine dining", "Spa", "Wine tasting", "Terrace dining"],
    contact: "+91 8669505727",
  },
  {
    title: "Mountain Retreat Villa – Lonavala",
    price: "₹9,999",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Mountain villa with valley views and private pool.",
    amenities: ["Private Villa", "Valley View", "Private Pool", "Grill Kitchen", "Living Room", "Terrace Seating", "Nature Access", "Peaceful Location"],
    location: "Lonavala",
    rating: 4.8,
    category: "villa",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Valley views", "Private pool", "Grill kitchen", "Nature access"],
    activities: ["Hiking", "Grilling", "Swimming", "Nature walks"],
    contact: "+91 8669505727",
  },
  {
    title: "Heritage Villa – Lonavala",
    price: "₹10,499",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Historic villa with antique furnishings and fine dining.",
    amenities: ["Historic Villa", "Antique Furnishings", "Private Grounds", "Library", "Music Room", "Fine Dining", "Garden", "Heritage Charm"],
    location: "Lonavala",
    rating: 4.7,
    category: "villa",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Historic architecture", "Antique furnishings", "Fine dining", "Garden"],
    activities: ["Fine dining", "Library visits", "Music events", "Garden tours"],
    contact: "+91 8669505727",
  },
  {
    title: "Waterfront Villa Paradise – Lonavala",
    price: "₹11,499",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Waterfront villa with yacht access and premium water amenities.",
    amenities: ["Waterfront Location", "Private Beach Access", "Infinity Pool", "Yacht Access", "Fine Dining", "Spa Suite", "Entertainment Hall", "Concierge Service"],
    location: "Lonavala",
    rating: 4.9,
    category: "villa",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Waterfront location", "Yacht access", "Infinity pool", "Private beach"],
    activities: ["Yacht sailing", "Beach activities", "Water sports", "Fine dining"],
    contact: "+91 8669505727",
  },
  {
    title: "Eco-Luxury Villa – Lonavala",
    price: "₹8,999",
    priceNote: "per person with meal",
    capacity: 4,
    description: "Sustainable luxury villa with wellness facilities.",
    amenities: ["Sustainable Villa", "Solar Powered", "Organic Gardens", "Natural Pool", "Wellness Center", "Yoga Deck", "Forest View", "Eco-Friendly Materials"],
    location: "Lonavala",
    rating: 4.8,
    category: "villa",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    highlights: ["Eco-friendly", "Yoga facilities", "Organic gardens", "Forest views"],
    activities: ["Yoga", "Meditation", "Nature walks", "Wellness treatments"],
    contact: "+91 8669505727",
  },
];

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

async function populateProperties() {
  const client = await pool.connect();
  try {
    console.log('Populating properties...');
    
    // Clear existing properties (optional but requested to move data as default)
    await client.query('DELETE FROM property_images');
    await client.query('DELETE FROM properties');

    // Section 1: camping - 5 properties, 3 images each
    const campingProps = [
      {
        title: "Pawna Riverside Glamping",
        price: "₹2,999",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Experience ultimate glamping at Pawna River with DJ and riverfront views.",
        amenities: ["Private Washroom", "DJ on Saturday", "Riverview", "Food Included", "Free Activities", "Bonfire", "Garden", "Music", "Liquor Bar"],
        location: "Pawna Lake",
        rating: 4.7,
        category: "camping",
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["River views", "DJ performance", "Bonfire night", "Garden access"],
        activities: ["Boating", "Bonfire", "Music", "Nature walks"],
        policies: ["Free cancellation up to 7 days", "No refund within 3 days"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4",
          "https://images.unsplash.com/photo-1532339142463-fd0a8979791a",
          "https://images.unsplash.com/photo-1510312305653-8ed496efbe75"
        ]
      },
      {
        title: "CozyNest at Chavsar – Pawna Lake",
        price: "₹3,300",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Cozy camping experience at Pawna with food included and lake access.",
        amenities: ["Private Washroom", "Food Included", "Paid Boating", "Bonfire", "Lake Access"],
        location: "Pawna Lake",
        rating: 4.5,
        category: "camping",
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Lake access", "Paid boating", "Bonfire", "Food included"],
        activities: ["Boating", "Bonfire", "Swimming", "Fishing"],
        policies: ["Free cancellation up to 7 days", "50% refund 3-7 days"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7",
          "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
          "https://images.unsplash.com/photo-1517824806704-9040b037703b"
        ]
      },
      {
        title: "Lakeside Glamping Camp – Pawna Lake",
        price: "₹2,499",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Exclusive glamping camp with stargazing and lake access.",
        amenities: ["Canvas Tent", "Bonfire", "Stargazing", "Food Included", "Lake Access", "Free Activities", "Riverside View", "Camping Bed"],
        location: "Pawna Lake",
        rating: 4.8,
        category: "camping",
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Stargazing", "Riverside views", "Canvas tents", "Free activities"],
        activities: ["Stargazing", "Bonfire", "Hiking", "Photography"],
        policies: ["Free cancellation up to 7 days"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1496080174650-637e3f22fa03",
          "https://images.unsplash.com/photo-1537905569824-f89f14cceb68",
          "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd"
        ]
      },
      {
        title: "Adventure Camping Resort – Pawna",
        price: "₹2,799",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Adventure-packed camping with nature trails and photography opportunities.",
        amenities: ["Adventure Activities", "Campfire", "Stargazing", "Food Included", "Nature Trails", "Photography Points", "Lake Proximity", "Friendly Staff"],
        location: "Pawna Lake",
        rating: 4.7,
        category: "camping",
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Adventure activities", "Nature trails", "Photography points", "Lake proximity"],
        activities: ["Hiking", "Adventure sports", "Photography", "Bonfire"],
        policies: ["Free cancellation up to 7 days"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1486915307544-b1ac7d338f37",
          "https://images.unsplash.com/photo-1464207687429-7507184927a0",
          "https://images.unsplash.com/photo-1455763933444-24d96696924a"
        ]
      },
      {
        title: "Nature's Embrace Camping – Pawna",
        price: "₹2,599",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Peaceful camping with local cuisine and expert guides.",
        amenities: ["Tent Stay", "Bonfire", "Local Cuisine", "Hiking", "Bird Watching", "Photography", "Sunset View", "Expert Guides"],
        location: "Pawna Lake",
        rating: 4.6,
        category: "camping",
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Sunset views", "Expert guides", "Local cuisine", "Bird watching"],
        activities: ["Bird watching", "Hiking", "Photography", "Bonfire"],
        policies: ["Free cancellation up to 7 days"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1516939884455-1445c8652f83",
          "https://images.unsplash.com/photo-1520095972714-909e91b038e5",
          "https://images.unsplash.com/photo-1445308306294-bfc3f79a2456"
        ]
      }
    ];

    // Section 2: cottage - 5 properties, 3 images each
    const cottageProps = [
      {
        title: "AC House with Sleeping Loft – Pawna Lake",
        price: "₹3,199",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Comfortable AC cottage with swimming pool and lake activities.",
        amenities: ["Private Washroom", "AC", "Common Swimming Pool", "Food Included", "Free Activities", "Paid Boating", "Bonfire", "Lake Access"],
        location: "Pawna Lake",
        rating: 4.6,
        category: "cottage",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["AC rooms", "Swimming pool", "Lake activities", "Food included"],
        activities: ["Boating", "Swimming", "Bonfire", "Games"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
        ]
      },
      {
        title: "Lakestory Resort – Pawna Lake",
        price: "₹7,499",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Luxury cottage resort with private pool and smart entertainment.",
        amenities: ["Private Pool", "Private Washroom", "AC", "Mini Fridge", "Smart Projector", "Home Theatre", "BBQ", "Food Included", "Lake Touch"],
        location: "Pawna Lake",
        rating: 4.8,
        category: "cottage",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Private pool", "Home theatre", "BBQ area", "Lake touch"],
        activities: ["Swimming", "Movie nights", "BBQ", "Lake activities"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1464333527363-c003e07a6c8f",
          "https://images.unsplash.com/photo-1433838552652-f9a46b332c40",
          "https://images.unsplash.com/photo-1510797215324-95aa89f43c33"
        ]
      },
      {
        title: "Dew Dreams – Couple Stay",
        price: "₹8,249",
        priceNote: "per person with meal",
        capacity: 2,
        description: "Romantic couple retreat with private pool and spa services.",
        amenities: ["Private Pool", "Lakeview Room", "Steam Bath", "Food Included", "Free Activities", "Paid Boating", "Bonfire", "Garden", "Room Service"],
        location: "Pawna Lake",
        rating: 4.9,
        category: "cottage",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Private pool", "Steam bath", "Garden", "Lakeview"],
        activities: ["Couples yoga", "Spa", "Bonfire", "Boating"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
          "https://images.unsplash.com/photo-1449156001437-37c641cc574a",
          "https://images.unsplash.com/photo-1472224311443-9cd57582d3ce"
        ]
      },
      {
        title: "Serene Cottage Retreat – Pawna",
        price: "₹4,999",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Peaceful cottage with valley views and mini kitchen.",
        amenities: ["Private Cottage", "Valley View", "AC & Heater", "Attached Bathroom", "Mini Kitchen", "Bonfire", "Food Included", "Peaceful Location"],
        location: "Pawna Lake",
        rating: 4.7,
        category: "cottage",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Valley views", "Mini kitchen", "Private cottage", "Peaceful"],
        activities: ["Cooking", "Bonfire", "Nature walks", "Meditation"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
          "https://images.unsplash.com/photo-1475855581690-80accde3ae2b"
        ]
      },
      {
        title: "Riverside Cottage Escape – Pawna",
        price: "₹5,499",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Riverside cottage with water activities and natural beauty.",
        amenities: ["Riverside Location", "Private Cottage", "AC", "Balcony", "Food Included", "River Activities", "Bonfire", "Natural Beauty"],
        location: "Pawna Lake",
        rating: 4.8,
        category: "cottage",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Riverside views", "River activities", "Natural beauty", "Balcony"],
        activities: ["Boating", "Fishing", "River rafting", "Photography"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
          "https://images.unsplash.com/photo-1505910147559-386362200312",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
        ]
      }
    ];

    // Section 3: villa - 5 properties, 3 images each
    const villaProps = [
      {
        title: "Dome Story Resort – Malvandi Lake",
        price: "₹7,499",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Luxury dome villa resort with lake views and exclusive amenities.",
        amenities: ["Private Washroom", "AC", "Mini Fridge", "Electric Kettle", "BBQ", "Food Included", "Free Boating", "Bonfire", "Lake Access"],
        location: "Lonavala",
        rating: 4.9,
        category: "villa",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Lake views", "Dome architecture", "Free boating", "BBQ area"],
        activities: ["Boating", "Swimming", "Bonfire", "Stargazing"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
        ]
      },
      {
        title: "Luxury Villa Estate – Lonavala",
        price: "₹12,999",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Ultimate luxury villa with private chef and premium amenities.",
        amenities: ["Private Villa", "Mountain View", "Infinity Pool", "Private Chef", "Wine Cellar", "Spa", "Garden Terrace", "24-Hour Butler"],
        location: "Lonavala",
        rating: 4.9,
        category: "villa",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Private chef", "Infinity pool", "Wine cellar", "24-hour butler"],
        activities: ["Fine dining", "Spa", "Wine tasting", "Terrace dining"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1518732714860-b62714ce0c59",
          "https://images.unsplash.com/photo-1613977257363-707ba9348227",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
        ]
      },
      {
        title: "Mountain Retreat Villa – Lonavala",
        price: "₹9,999",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Mountain villa with valley views and private pool.",
        amenities: ["Private Villa", "Valley View", "Private Pool", "Grill Kitchen", "Living Room", "Terrace Seating", "Nature Access", "Peaceful Location"],
        location: "Lonavala",
        rating: 4.8,
        category: "villa",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Valley views", "Private pool", "Grill kitchen", "Nature access"],
        activities: ["Hiking", "Grilling", "Swimming", "Nature walks"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
          "https://images.unsplash.com/photo-1512915922686-57c11f9ad6b3",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
        ]
      },
      {
        title: "Heritage Villa – Lonavala",
        price: "₹10,499",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Historic villa with antique furnishings and fine dining.",
        amenities: ["Historic Villa", "Antique Furnishings", "Private Grounds", "Library", "Music Room", "Fine Dining", "Garden", "Heritage Charm"],
        location: "Lonavala",
        rating: 4.7,
        category: "villa",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Historic architecture", "Antique furnishings", "Fine dining", "Garden"],
        activities: ["Fine dining", "Library visits", "Music events", "Garden tours"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3"
        ]
      },
      {
        title: "Eco-Luxury Villa – Lonavala",
        price: "₹8,999",
        priceNote: "per person with meal",
        capacity: 4,
        description: "Sustainable luxury villa with wellness facilities.",
        amenities: ["Sustainable Villa", "Solar Powered", "Organic Gardens", "Natural Pool", "Wellness Center", "Yoga Deck", "Forest View", "Eco-Friendly Materials"],
        location: "Lonavala",
        rating: 4.8,
        category: "villa",
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        highlights: ["Eco-friendly", "Yoga facilities", "Organic gardens", "Forest views"],
        activities: ["Yoga", "Meditation", "Nature walks", "Wellness treatments"],
        contact: "+91 8669505727",
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
          "https://images.unsplash.com/photo-1600570622744-d55b18027104"
        ]
      }
    ];

    const allProps = [...campingProps, ...cottageProps, ...villaProps];

    for (const property of allProps) {
      const slug = slugify(property.title);
      
      const query = `
        INSERT INTO properties (
          title, slug, description, category, location, rating, price, price_note,
          capacity, amenities, activities, highlights, policies, contact
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `;

      const values = [
        property.title,
        slug,
        property.description,
        property.category,
        property.location,
        property.rating,
        property.price,
        property.priceNote,
        property.capacity,
        JSON.stringify(property.amenities),
        JSON.stringify(property.activities || []),
        JSON.stringify(property.highlights || []),
        JSON.stringify(property.policies || []),
        property.contact
      ];

      const res = await client.query(query, values);
      const propertyId = res.rows[0].id;
      
      for (let i = 0; i < property.images.length; i++) {
        await client.query(
          'INSERT INTO property_images (property_id, image_url, display_order) VALUES ($1, $2, $3)',
          [propertyId, property.images[i], i]
        );
      }
    }

    console.log(`Successfully populated ${allProps.length} properties with 3 images each!`);
  } catch (err) {
    console.error('Error populating properties:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

populateProperties();
