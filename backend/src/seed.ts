import { MemberRole } from "../prisma/generated/prisma/enums";
import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";

// ─── Helper ────────────────────────────────────────────────────────────
async function createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: MemberRole;
    bio?: string;
    address?: string;
}) {
    const existing = await prisma.user.findFirst({
        where: { email: data.email },
    });
    if (existing) {
        console.log(`  ⏭  User "${data.email}" already exists – skipping`);
        return existing;
    }

    await auth.api.signUpEmail({
        body: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role ?? MemberRole.MEMBER,
        },
    });

    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (!user) throw new Error(`Failed to create user ${data.email}`);

    // Patch extra fields that better-auth doesn't handle
    if (data.bio || data.address) {
        await prisma.user.update({
            where: { id: user.id },
            data: { bio: data.bio, address: data.address },
        });
    }

    console.log(`  ✅ Created user: ${data.name} (${data.email})`);
    return user;
}

// ─── Seed Data ─────────────────────────────────────────────────────────

const CATEGORIES = [
    {
        slug: "adventure",
        title: "Adventure",
        description: "Thrilling outdoor and extreme travel experiences",
    },
    {
        slug: "beach",
        title: "Beach & Island",
        description: "Sun, sand, and the best coastal getaways",
    },
    {
        slug: "culture",
        title: "Culture & Heritage",
        description: "Historical landmarks, museums, and traditions",
    },
    {
        slug: "food",
        title: "Food & Culinary",
        description: "Street food, fine dining, and local cuisine tours",
    },
    {
        slug: "nature",
        title: "Nature & Wildlife",
        description: "National parks, wildlife reserves, and eco-tourism",
    },
    {
        slug: "city",
        title: "City Break",
        description: "Urban exploration and weekend city getaways",
    },
    {
        slug: "budget",
        title: "Budget Travel",
        description: "How to travel the world without breaking the bank",
    },
    {
        slug: "photography",
        title: "Photography",
        description: "The most photogenic destinations and travel photography tips",
    },
];

const USERS = [
    {
        name: "Admin Trekko",
        email: "admin@trekko.com",
        password: "Admin@1234",
        role: MemberRole.ADMIN,
        bio: "Platform administrator at Trekko",
        address: "Dhaka, Bangladesh",
    },
    {
        name: "Sarah Mitchell",
        email: "sarah@example.com",
        password: "Member@1234",
        role: MemberRole.MEMBER,
        bio: "Full-time traveler and adventure blogger sharing my journey.",
        address: "San Francisco, USA",
    },
    {
        name: "Rafiq Ahmed",
        email: "rafiq@example.com",
        password: "Member@1234",
        role: MemberRole.MEMBER,
        bio: "Local tour guide passionate about Bangladesh's hidden beauty.",
        address: "Chittagong, Bangladesh",
    },
    {
        name: "Elena Rossi",
        email: "elena@example.com",
        password: "Member@1234",
        role: MemberRole.MEMBER,
        bio: "Food and culture enthusiast traveling across Europe and Asia.",
        address: "Rome, Italy",
    },
    {
        name: "James Park",
        email: "james@example.com",
        password: "Member@1234",
        role: MemberRole.MEMBER,
        bio: "Budget traveler and photography lover. 50+ countries explored!",
        address: "Seoul, South Korea",
    },
];

interface GuideData {
    title: string;
    description: string;
    coverImage: string;
    categorySlug: string;
    isPaid: boolean;
    price?: number;
    status: "APPROVED";
    itinerary: { day: number; title: string; activities: string[] }[];
    memberIndex: number; // index into USERS array (skip admin)
}

const GUIDES: GuideData[] = [
    {
        title: "Trekking the Annapurna Circuit in Nepal",
        description:
            "A complete 14-day guide to trekking the legendary Annapurna Circuit, one of the world's greatest long-distance treks. From lush subtropical forests to the barren high-altitude deserts of Mustang, every day reveals breathtaking new landscapes.",
        coverImage:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "adventure",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 1,
        itinerary: [
            {
                day: 1,
                title: "Kathmandu to Besisahar",
                activities: [
                    "Take a local bus from Kathmandu (6-7 hrs)",
                    "Check in at Besisahar guesthouse",
                    "Get TIMS permit and ACAP entry",
                ],
            },
            {
                day: 2,
                title: "Besisahar to Chame",
                activities: [
                    "Jeep ride through rocky roads",
                    "Pass through Tal village and lake",
                    "First views of Annapurna II peak",
                ],
            },
            {
                day: 3,
                title: "Chame to Manang",
                activities: [
                    "Cross apple orchards and pine forests",
                    "Stop at Brathang and feel the altitude",
                    "Acclimatize in Manang (3540m)",
                ],
            },
            {
                day: 4,
                title: "Thorong La Pass (5416m)",
                activities: [
                    "Start at 3am for the highest point",
                    "Prayer flags and panoramic views at pass",
                    "Descent to Muktinath temple",
                ],
            },
        ],
    },
    {
        title: "7 Days in Bali: Beaches, Temples & Rice Terraces",
        description:
            "The ultimate Bali itinerary covering the island's best beaches, ancient Hindu temples, stunning rice terraces of Tegallalang, and the vibrant nightlife of Seminyak. Perfect for first-time visitors.",
        coverImage:
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "beach",
        isPaid: true,
        price: 9.99,
        status: "APPROVED",
        memberIndex: 2,
        itinerary: [
            {
                day: 1,
                title: "Arrival & Seminyak",
                activities: [
                    "Airport pickup and hotel check-in",
                    "Explore Seminyak beach sunset",
                    "Dinner at La Plancha beach bar",
                ],
            },
            {
                day: 2,
                title: "Ubud Exploration",
                activities: [
                    "Visit Tegallalang rice terraces",
                    "Sacred Monkey Forest walk",
                    "Traditional Balinese cooking class",
                ],
            },
            {
                day: 3,
                title: "Temples & Waterfalls",
                activities: [
                    "Tirta Empul holy spring temple",
                    "Tegenungan waterfall swim",
                    "Watch sunset at Tanah Lot temple",
                ],
            },
        ],
    },
    {
        title: "Exploring the Ancient Ruins of Angkor Wat",
        description:
            "A thorough 3-day guide to Cambodia's crown jewel. Navigate the vast temple complex, discover lesser-known sites away from the crowds, and witness the most magical sunrise in all of Southeast Asia.",
        coverImage:
            "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "culture",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 3,
        itinerary: [
            {
                day: 1,
                title: "Grand Circuit",
                activities: [
                    "Sunrise at Angkor Wat main temple",
                    "Explore Bayon's giant stone faces",
                    "Walk through overgrown Ta Prohm (Tomb Raider temple)",
                ],
            },
            {
                day: 2,
                title: "Outer Temples",
                activities: [
                    "Visit Banteay Srei pink sandstone temple",
                    "Float village on Tonle Sap lake",
                    "Artisan markets in Siem Reap",
                ],
            },
        ],
    },
    {
        title: "Street Food Tour: Bangkok's Hidden Gems",
        description:
            "Forget the tourist traps — this guide takes you to the authentic street food stalls where locals eat. From Chinatown's fiery wok hei to Silom's late-night grilled skewers, taste the real Bangkok.",
        coverImage:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "food",
        isPaid: true,
        price: 4.99,
        status: "APPROVED",
        memberIndex: 3,
        itinerary: [
            {
                day: 1,
                title: "Chinatown (Yaowarat Road)",
                activities: [
                    "Pad Thai at Thipsamai",
                    "Mango sticky rice from street vendors",
                    "Roasted duck and crispy pork at Nai Ek Roll Noodle",
                ],
            },
            {
                day: 2,
                title: "Old Bangkok & Sukhumvit",
                activities: [
                    "Boat noodles at Victory Monument",
                    "Tom Yum at P'Aor restaurant",
                    "Night market at Ratchada Train Market",
                ],
            },
        ],
    },
    {
        title: "Safari Guide: Serengeti & Masai Mara",
        description:
            "Witness the Great Migration across the Serengeti-Mara ecosystem. This guide covers the best times to visit, recommended camps, photography tips, and how to respect wildlife ethically.",
        coverImage:
            "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "nature",
        isPaid: true,
        price: 14.99,
        status: "APPROVED",
        memberIndex: 1,
        itinerary: [
            {
                day: 1,
                title: "Arusha to Central Serengeti",
                activities: [
                    "Fly from Arusha to Seronera airstrip",
                    "Afternoon game drive – look for Big 5",
                    "Sunset at Serengeti viewpoint",
                ],
            },
            {
                day: 2,
                title: "Northern Serengeti Migration",
                activities: [
                    "Drive to Mara River crossing point",
                    "Watch wildebeest cross the river",
                    "Night in luxury tented camp",
                ],
            },
            {
                day: 3,
                title: "Cross to Masai Mara",
                activities: [
                    "Border crossing to Kenya",
                    "Hot air balloon safari at dawn",
                    "Visit Masai village and cultural exchange",
                ],
            },
        ],
    },
    {
        title: "48 Hours in Tokyo: A First-Timer's Guide",
        description:
            "Pack the best of Tokyo into an action-filled weekend. From the futuristic streets of Shibuya to the serene Meiji Shrine, this guide balances iconic sights with hidden local spots.",
        coverImage:
            "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "city",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 4,
        itinerary: [
            {
                day: 1,
                title: "Classic Tokyo",
                activities: [
                    "Shibuya crossing photo stop",
                    "Meiji Shrine morning walk",
                    "Harajuku Takeshita Street snacks",
                    "Ramen at Fuunji (Shinjuku)",
                ],
            },
            {
                day: 2,
                title: "Traditional & Modern",
                activities: [
                    "Tsukiji outer market breakfast",
                    "TeamLab Borderless digital art museum",
                    "Asakusa Senso-ji temple",
                    "Izakaya hopping in Shinjuku Golden Gai",
                ],
            },
        ],
    },
    {
        title: "Backpacking Southeast Asia on $30/Day",
        description:
            "A detailed budget breakdown for backpacking through Thailand, Vietnam, Cambodia, and Laos. Includes accommodation hacks, cheapest transport options, and free activities in each country.",
        coverImage:
            "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "budget",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 4,
        itinerary: [
            {
                day: 1,
                title: "Thailand (Bangkok → Chiang Mai)",
                activities: [
                    "Hostels from $5/night near Khao San",
                    "Night train to Chiang Mai ($12)",
                    "Free temple visits in the Old City",
                ],
            },
            {
                day: 2,
                title: "Vietnam (Hanoi → Ho Chi Minh)",
                activities: [
                    "$1 banh mi breakfasts",
                    "Reunification Express sleeper train",
                    "Cu Chi Tunnels day trip ($8)",
                ],
            },
        ],
    },
    {
        title: "Iceland's Golden Circle Photography Guide",
        description:
            "Capture Iceland's most dramatic landscapes along the famous Golden Circle route. Detailed tips on the best times, camera settings, and secret viewpoints for Gullfoss, Geysir, and Thingvellir.",
        coverImage:
            "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "photography",
        isPaid: true,
        price: 7.99,
        status: "APPROVED",
        memberIndex: 4,
        itinerary: [
            {
                day: 1,
                title: "Thingvellir & Geysir",
                activities: [
                    "Golden hour at Öxarárfoss waterfall",
                    "Tectonic plate rift panoramic shots",
                    "Strokkur geyser burst timing tips",
                ],
            },
            {
                day: 2,
                title: "Gullfoss & Secret Lagoon",
                activities: [
                    "Long exposure at Gullfoss cascade",
                    "Steam and mist shots at Secret Lagoon",
                    "Night sky northern lights photography",
                ],
            },
        ],
    },
    {
        title: "Cox's Bazar to Saint Martin: Complete Bangladesh Coastal Guide",
        description:
            "Discover the world's longest natural sea beach and the only coral island in Bangladesh. From sunrise on the 120km beach to snorkeling off Saint Martin, this is Bangladesh at its tropical best.",
        coverImage:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "beach",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 2,
        itinerary: [
            {
                day: 1,
                title: "Cox's Bazar Beach",
                activities: [
                    "Sunrise walk on Laboni Beach",
                    "Visit Himchari waterfall",
                    "Fresh seafood dinner at local dhaba",
                ],
            },
            {
                day: 2,
                title: "Teknaf & Saint Martin Island",
                activities: [
                    "Morning boat from Teknaf (3 hrs)",
                    "Snorkeling on the coral reefs",
                    "Camp overnight under the stars",
                ],
            },
        ],
    },
    {
        title: "Sundarbans Mangrove Forest: 3-Day Wildlife Expedition",
        description:
            "Navigate the world's largest mangrove forest and a UNESCO World Heritage Site. Spot the Bengal tiger, saltwater crocodiles, and hundreds of bird species in this raw wilderness adventure.",
        coverImage:
            "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "nature",
        isPaid: true,
        price: 6.99,
        status: "APPROVED",
        memberIndex: 2,
        itinerary: [
            {
                day: 1,
                title: "Khulna to Sundarbans",
                activities: [
                    "Board the river cruise from Mongla",
                    "Enter the forest via Harbaria canal",
                    "Deer spotting at Katka wildlife point",
                ],
            },
            {
                day: 2,
                title: "Deep Forest Exploration",
                activities: [
                    "Early morning tiger track search",
                    "Visit Karamjal breeding center",
                    "Night anchor in the river with sounds of the forest",
                ],
            },
        ],
    },
    // ─── 20 NEW GUIDES ──────────────────────────────────────────────────
    {
        title: "Patagonia: End of the World Expedition",
        description:
            "Trek through Torres del Paine, witness glaciers calving into turquoise lakes, and experience the raw power of nature at the southern tip of South America.",
        coverImage:
            "https://images.unsplash.com/photo-1531794999484-4a8e81256849?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "adventure",
        isPaid: true,
        price: 12.99,
        status: "APPROVED",
        memberIndex: 1,
        itinerary: [
            { day: 1, title: "Puerto Natales Arrival", activities: ["Settle in at hostel", "Gear check and permits", "Lamb asado welcome dinner"] },
            { day: 2, title: "Torres del Paine W-Trek Day 1", activities: ["Hike to Mirador Base Torres", "Camp at Chileno", "Southern beech forest walk"] },
            { day: 3, title: "Grey Glacier", activities: ["Trek to Grey Glacier viewpoint", "Kayak among icebergs", "Return via Paine Grande"] },
        ],
    },
    {
        title: "Maldives on a Budget: Local Island Hopping",
        description:
            "Skip the luxury resorts and discover the Maldives the local way. Stay on inhabited islands, snorkel pristine reefs, and eat authentic Maldivian food — all for under $80/day.",
        coverImage:
            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "beach",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 4,
        itinerary: [
            { day: 1, title: "Maafushi Island", activities: ["Public ferry from Malé", "Bikini beach swim", "Sunset dolphin cruise ($25)"] },
            { day: 2, title: "Snorkeling & Sandbank", activities: ["Half-day snorkel trip", "Nurse shark spotting", "Sandbank BBQ lunch"] },
        ],
    },
    {
        title: "Temples of Kyoto: A Zen Journey",
        description:
            "Wander through 2,000 temples and shrines in Japan's cultural capital. From the golden shimmer of Kinkaku-ji to the bamboo groves of Arashiyama, Kyoto is a living time capsule.",
        coverImage:
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "culture",
        isPaid: true,
        price: 8.99,
        status: "APPROVED",
        memberIndex: 3,
        itinerary: [
            { day: 1, title: "Eastern Kyoto", activities: ["Fushimi Inari thousand gates sunrise", "Kiyomizu-dera temple", "Geisha district Gion evening walk"] },
            { day: 2, title: "Northern Kyoto", activities: ["Kinkaku-ji Golden Pavilion", "Ryoan-ji rock garden meditation", "Arashiyama bamboo grove"] },
        ],
    },
    {
        title: "Vietnam from North to South: A Foodie's Roadmap",
        description:
            "From Hanoi's steaming pho stalls to Saigon's buzzing street corners, eat your way through the entire length of Vietnam. Includes market tours, cooking classes, and hidden gems.",
        coverImage:
            "https://images.unsplash.com/photo-1583077874340-78d6e6c0de42?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "food",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 3,
        itinerary: [
            { day: 1, title: "Hanoi Old Quarter", activities: ["Egg coffee at Giang Café", "Bun cha at Dac Kim", "Night street food tour"] },
            { day: 2, title: "Hoi An & Central Coast", activities: ["Cao lau noodle breakfast", "Morning market tour", "Cooking class with local chef"] },
            { day: 3, title: "Ho Chi Minh City", activities: ["Banh mi Huynh Hoa", "District 4 street food crawl", "Rooftop cocktails at Saigon skyline"] },
        ],
    },
    {
        title: "Costa Rica: Rainforest & Wildlife Adventure",
        description:
            "Zip-line through cloud forests, spot sloths in Monteverde, and surf the Pacific coast. Costa Rica is nature's playground, and this guide covers every unmissable experience.",
        coverImage:
            "https://images.unsplash.com/photo-1518259102261-b6aa0a702b28?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "nature",
        isPaid: true,
        price: 11.99,
        status: "APPROVED",
        memberIndex: 1,
        itinerary: [
            { day: 1, title: "Monteverde Cloud Forest", activities: ["Hanging bridges canopy walk", "Night wildlife tour", "Hummingbird gallery"] },
            { day: 2, title: "Arenal Volcano", activities: ["Lava trail hike", "Hot springs relaxation", "La Fortuna waterfall swim"] },
            { day: 3, title: "Manuel Antonio Coast", activities: ["National park wildlife spotting", "White sand beach day", "Sunset catamaran cruise"] },
        ],
    },
    {
        title: "72 Hours in Istanbul: East Meets West",
        description:
            "Straddle two continents in one of the world's most fascinating cities. From the Hagia Sophia to the Grand Bazaar, Istanbul delivers history, flavor, and chaos in equal measure.",
        coverImage:
            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "city",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 2,
        itinerary: [
            { day: 1, title: "Sultanahmet District", activities: ["Hagia Sophia morning visit", "Blue Mosque exterior", "Grand Bazaar treasure hunt"] },
            { day: 2, title: "Bosphorus & Beyond", activities: ["Ferry ride to Asian side", "Çamlıca Hill panoramic views", "Kadıköy street food market"] },
        ],
    },
    {
        title: "Southeast Asia by Train: The Ultimate Rail Pass Guide",
        description:
            "Ditch the flights and see Asia from ground level. Covers the Bangkok–Singapore route, sleeper trains in Vietnam, and Myanmar's famous Gokteik Viaduct crossing.",
        coverImage:
            "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "budget",
        isPaid: true,
        price: 5.99,
        status: "APPROVED",
        memberIndex: 4,
        itinerary: [
            { day: 1, title: "Bangkok → Hua Hin", activities: ["Board the Southern Line", "$2 pad thai from train vendors", "Hua Hin night market"] },
            { day: 2, title: "Butterworth → Penang", activities: ["Cross the border at Padang Besar", "Georgetown heritage walk", "Hawker center dinner"] },
        ],
    },
    {
        title: "Norway's Fjords: A Photographer's Dream",
        description:
            "Capture the dramatic landscapes of Geirangerfjord, Trolltunga, and the Lofoten Islands. Includes golden hour timetables, drone regulations, and secret vantage points.",
        coverImage:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "photography",
        isPaid: true,
        price: 9.99,
        status: "APPROVED",
        memberIndex: 4,
        itinerary: [
            { day: 1, title: "Geirangerfjord", activities: ["Flydalsjuvet viewpoint sunrise", "Seven Sisters waterfall cruise", "Eagle Road switchback shots"] },
            { day: 2, title: "Trolltunga Hike", activities: ["10-hour round trip hike", "Iconic cliff-edge photo", "Odda town celebration dinner"] },
        ],
    },
    {
        title: "Rock Climbing in Kalymnos, Greece",
        description:
            "The Mediterranean's top climbing destination. This guide covers the best crags for all levels, gear rental info, and the island's incredible post-climb tavernas.",
        coverImage:
            "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "adventure",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 1,
        itinerary: [
            { day: 1, title: "Grande Grotta Sector", activities: ["Warm-up on 5a–5c routes", "Photograph the iconic overhang", "Sunset swim at Emporios beach"] },
            { day: 2, title: "Odyssey & Poets", activities: ["Multi-pitch climbing session", "Rest day snorkeling option", "Traditional meze dinner in Massouri"] },
        ],
    },
    {
        title: "Zanzibar: Spice Island Paradise",
        description:
            "Beyond the turquoise waters lies a world of spice plantations, Stone Town alleyways, and Swahili culture. This guide blends beach bliss with deep cultural immersion.",
        coverImage:
            "https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "beach",
        isPaid: true,
        price: 7.49,
        status: "APPROVED",
        memberIndex: 2,
        itinerary: [
            { day: 1, title: "Stone Town", activities: ["Forodhani night market", "House of Wonders museum", "Dhow sunset cruise"] },
            { day: 2, title: "Spice Tour & Nungwi Beach", activities: ["Morning spice plantation visit", "Drive to northern beaches", "Swim with sea turtles"] },
        ],
    },
    {
        title: "Camino de Santiago: 30-Day Pilgrimage Guide",
        description:
            "Walk the ancient 800km pilgrimage from Saint-Jean-Pied-de-Port to Santiago de Compostela. Covers packing lists, albergue tips, and the spiritual transformation along the way.",
        coverImage:
            "https://images.unsplash.com/photo-1553152531-b98a2fc8d3bf?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "culture",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 3,
        itinerary: [
            { day: 1, title: "Saint-Jean to Roncesvalles", activities: ["Cross the Pyrenees (25km)", "Napoleon Route vs Valcarlos", "First albergue check-in"] },
            { day: 2, title: "Pamplona & Meseta", activities: ["Bull run streets walk-through", "Wine fountain at Irache", "Endless Meseta plains meditation"] },
        ],
    },
    {
        title: "Oaxaca: Mexico's Culinary Capital",
        description:
            "Explore the seven moles of Oaxaca, learn to make tlayudas from street vendors, and sip artisanal mezcal in the valleys. A food lover's ultimate Mexican adventure.",
        coverImage:
            "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "food",
        isPaid: true,
        price: 6.49,
        status: "APPROVED",
        memberIndex: 3,
        itinerary: [
            { day: 1, title: "Oaxaca City Markets", activities: ["Benito Juárez market chocolate tasting", "Tlayuda at Doña Elia", "Mezcal tasting at In Situ"] },
            { day: 2, title: "Valley Day Trip", activities: ["Hierve el Agua petrified waterfalls", "Village mezcal distillery tour", "Mole negro cooking class"] },
        ],
    },
    {
        title: "Galápagos Islands: Darwin's Living Laboratory",
        description:
            "Snorkel with sea lions, walk among giant tortoises, and kayak past blue-footed boobies. This guide covers the budget-friendly land-based approach to the Galápagos.",
        coverImage:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "nature",
        isPaid: true,
        price: 13.99,
        status: "APPROVED",
        memberIndex: 1,
        itinerary: [
            { day: 1, title: "Santa Cruz Island", activities: ["Charles Darwin Research Station", "Tortuga Bay beach hike", "Los Gemelos sinkhole viewpoints"] },
            { day: 2, title: "Isabela Island", activities: ["Los Túneles snorkeling trip", "Wall of Tears historical hike", "Flamingo lagoon kayaking"] },
        ],
    },
    {
        title: "Lisbon & Porto: A Weekend Duo",
        description:
            "Combine Portugal's two greatest cities in one epic weekend. Ride vintage trams, eat pastéis de nata, sip port wine, and soak in Atlantic sunsets.",
        coverImage:
            "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "city",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 2,
        itinerary: [
            { day: 1, title: "Lisbon Highlights", activities: ["Tram 28 through Alfama", "Pastéis de Belém tasting", "Sunset at Miradouro da Graça"] },
            { day: 2, title: "Porto Day", activities: ["High-speed train to Porto", "Port wine tasting in Vila Nova", "Livraria Lello bookshop visit"] },
        ],
    },
    {
        title: "Central America on $25/Day",
        description:
            "Backpack through Guatemala, Honduras, El Salvador, and Nicaragua without breaking the bank. Covers chicken buses, homestays, and the best free activities in each country.",
        coverImage:
            "https://images.unsplash.com/photo-1591378603223-e15b45a81640?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "budget",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 4,
        itinerary: [
            { day: 1, title: "Guatemala (Antigua & Lake Atitlán)", activities: ["$3/night dorm in Antigua", "Chicken bus to Lake Atitlán", "Free volcano viewpoint hike"] },
            { day: 2, title: "Nicaragua (Granada & León)", activities: ["$5 hostel in Granada", "Volcano boarding in León ($30)", "Free colonial architecture walk"] },
        ],
    },
    {
        title: "Morocco: Sahara Desert & Medina Moments",
        description:
            "From the chaos of Marrakech's Jemaa el-Fnaa to sleeping under the stars in the Sahara, Morocco is sensory overload in the best possible way.",
        coverImage:
            "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "photography",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 4,
        itinerary: [
            { day: 1, title: "Marrakech Medina", activities: ["Jemaa el-Fnaa sunset photography", "Bahia Palace golden hour", "Rooftop dinner at Nomad"] },
            { day: 2, title: "Sahara Desert Camp", activities: ["Camel trek to desert camp", "Milky Way long exposure shots", "Sunrise over Erg Chebbi dunes"] },
        ],
    },
    {
        title: "Everest Base Camp Trek: Complete Guide",
        description:
            "The ultimate bucket-list trek. A day-by-day guide from Lukla to Everest Base Camp, covering acclimatization, gear, Sherpa culture, and the emotional journey to 5,364m.",
        coverImage:
            "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "adventure",
        isPaid: true,
        price: 15.99,
        status: "APPROVED",
        memberIndex: 1,
        itinerary: [
            { day: 1, title: "Lukla to Phakding", activities: ["Scenic flight from Kathmandu", "Cross first suspension bridges", "Tea house check-in at Phakding"] },
            { day: 2, title: "Namche Bazaar", activities: ["Steep climb to Namche", "Acclimatization day hike", "Sherpa Culture Museum visit"] },
            { day: 3, title: "Gorak Shep to EBC", activities: ["Final push to Base Camp (5,364m)", "Prayer flags and panoramic views", "Return to Gorak Shep lodge"] },
        ],
    },
    {
        title: "Sri Lanka: The Teardrop Island in 10 Days",
        description:
            "Train through tea plantations, climb Sigiriya rock fortress, spot leopards in Yala, and surf in Mirissa. Sri Lanka packs an extraordinary amount into a small island.",
        coverImage:
            "https://images.unsplash.com/photo-1586523969720-2f9e0c2f9e73?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "culture",
        isPaid: true,
        price: 8.49,
        status: "APPROVED",
        memberIndex: 2,
        itinerary: [
            { day: 1, title: "Colombo to Kandy", activities: ["Temple of the Tooth visit", "Kandyan dance performance", "Botanical gardens walk"] },
            { day: 2, title: "Ella & Tea Country", activities: ["Famous Ella train ride", "Nine Arches Bridge sunrise", "Tea factory tour and tasting"] },
        ],
    },
    {
        title: "Buenos Aires: Tango, Steak & Street Art",
        description:
            "Argentina's capital pulses with passion. Learn to tango in San Telmo, feast on world-class steak at a parrilla, and discover La Boca's colorful street art scene.",
        coverImage:
            "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&q=80&w=1200",
        categorySlug: "city",
        isPaid: false,
        status: "APPROVED",
        memberIndex: 2,
        itinerary: [
            { day: 1, title: "San Telmo & La Boca", activities: ["Sunday antiques market at San Telmo", "Caminito street art walk", "Steak at Don Julio parrilla"] },
            { day: 2, title: "Recoleta & Palermo", activities: ["Recoleta Cemetery morning walk", "Palermo Soho boutique shopping", "Milonga tango evening show"] },
        ],
    },
];

const COMMENTS = [
    "This guide is absolutely fantastic! Helped me plan my trip perfectly.",
    "Great detail on the itinerary. Wish I had this when I went last year!",
    "The photography tips section was incredibly helpful. Thank you!",
    "Just came back from this trip following your guide – best vacation ever!",
    "Really well organized. The budget breakdown is so useful.",
    "Bookmarked this for my upcoming trip in the summer. Can't wait!",
    "Wonderful guide! The hidden gems recommendations were spot on.",
    "I appreciate the honest and detailed review of each location.",
];

// ─── Main Seed Function ────────────────────────────────────────────────
async function seed() {
    console.log("\n🌱 Starting Trekko database seed...\n");

    // 1. Create Users
    console.log("👤 Creating users...");
    const users = [];
    for (const u of USERS) {
        const user = await createUser(u);
        users.push(user);
    }

    // 2. Create Categories
    console.log("\n📂 Creating categories...");
    const categoryMap = new Map<string, string>();
    for (const cat of CATEGORIES) {
        const existing = await prisma.category.findFirst({
            where: { slug: cat.slug },
        });
        if (existing) {
            console.log(`  ⏭  Category "${cat.title}" already exists`);
            categoryMap.set(cat.slug, existing.id);
            continue;
        }
        const created = await prisma.category.create({ data: cat });
        categoryMap.set(cat.slug, created.id);
        console.log(`  ✅ Created category: ${cat.title}`);
    }

    // 3. Create Travel Guides
    console.log("\n📝 Creating travel guides...");
    const guideIds: string[] = [];
    for (const g of GUIDES) {
        const categoryId = categoryMap.get(g.categorySlug);
        if (!categoryId) {
            console.log(`  ⚠️  Category "${g.categorySlug}" not found – skipping guide`);
            continue;
        }

        const memberId = users[g.memberIndex].id;

        // Check if guide already exists (by title + member)
        const existing = await prisma.travelGuide.findFirst({
            where: { title: g.title, memberId },
        });
        if (existing) {
            console.log(`  ⏭  Guide "${g.title}" already exists`);
            guideIds.push(existing.id);
            continue;
        }

        const guide = await prisma.travelGuide.create({
            data: {
                title: g.title,
                description: g.description,
                coverImage: g.coverImage,
                categoryId,
                memberId,
                isPaid: g.isPaid,
                price: g.price ?? null,
                status: g.status,
                itinerary: JSON.stringify(g.itinerary),
            },
        });
        guideIds.push(guide.id);
        console.log(`  ✅ Created guide: ${g.title}`);
    }

    // 4. Create Votes (members vote on each other's guides)
    console.log("\n👍 Creating votes...");
    const memberUsers = users.filter((u) => u.role !== MemberRole.ADMIN);
    for (const guideId of guideIds) {
        const guide = await prisma.travelGuide.findUnique({
            where: { id: guideId },
        });
        if (!guide) continue;

        for (const voter of memberUsers) {
            if (voter.id === guide.memberId) continue; // Don't vote on own guide

            const existing = await prisma.vote.findFirst({
                where: { memberId: voter.id, guideId },
            });
            if (existing) continue;

            await prisma.vote.create({
                data: {
                    memberId: voter.id,
                    guideId,
                    voteType: Math.random() > 0.15 ? "UP" : "DOWN", // 85% upvotes
                },
            });
        }
    }
    console.log("  ✅ Votes seeded");

    // 5. Create Comments
    console.log("\n💬 Creating comments...");
    let commentIdx = 0;
    for (const guideId of guideIds) {
        const guide = await prisma.travelGuide.findUnique({
            where: { id: guideId },
        });
        if (!guide) continue;

        // 2-3 comments per guide from different members
        const commenters = memberUsers
            .filter((u) => u.id !== guide.memberId)
            .slice(0, 3);

        for (const commenter of commenters) {
            const existing = await prisma.comment.findFirst({
                where: { guideId, memberId: commenter.id },
            });
            if (existing) continue;

            await prisma.comment.create({
                data: {
                    guideId,
                    memberId: commenter.id,
                    comment: COMMENTS[commentIdx % COMMENTS.length],
                },
            });
            commentIdx++;
        }
    }
    console.log("  ✅ Comments seeded");

    // 6. Create Favorites
    console.log("\n❤️  Creating favorites...");
    for (const user of memberUsers) {
        // Each member favorites 3-4 random guides
        const shuffled = [...guideIds].sort(() => Math.random() - 0.5).slice(0, 4);
        for (const guideId of shuffled) {
            const existing = await prisma.favorite.findFirst({
                where: { memberId: user.id, guideId },
            });
            if (existing) continue;

            await prisma.favorite.create({
                data: { memberId: user.id, guideId },
            });
        }
    }
    console.log("  ✅ Favorites seeded");

    // 7. Newsletter subscriptions
    console.log("\n📧 Creating newsletter subscriptions...");
    const newsletters = [
        "traveler@example.com",
        "explorer@example.com",
        "wanderlust@example.com",
    ];
    for (const email of newsletters) {
        const existing = await prisma.newsletterSubscription.findFirst({
            where: { email },
        });
        if (existing) continue;
        await prisma.newsletterSubscription.create({ data: { email } });
    }
    console.log("  ✅ Newsletter subscriptions seeded");

    console.log("\n🎉 Seed complete!\n");
    console.log("  Login credentials:");
    console.log("  ────────────────────────────────────────");
    console.log("  Admin:  admin@trekko.com / Admin@1234");
    console.log("  Member: sarah@example.com / Member@1234");
    console.log("  Member: rafiq@example.com / Member@1234");
    console.log("  Member: elena@example.com / Member@1234");
    console.log("  Member: james@example.com / Member@1234");
    console.log("  ────────────────────────────────────────\n");

    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
