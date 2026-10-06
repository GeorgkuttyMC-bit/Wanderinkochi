import heroCreatorImg from '../assets/images/hero_fort_kochi_creator_1791273141556.jpg';
import culinaryReelsImg from '../assets/images/showcase_culinary_reels_1791273157721.jpg';
import heritageWalksImg from '../assets/images/showcase_heritage_walks_1791273170129.jpg';
import waterMetroImg from '../assets/images/showcase_water_metro_1791273181973.jpg';
import streetFoodHostImg from '../assets/images/ig_reel_street_food_kochi_1791274543381.jpg';
import kathakaliCultureImg from '../assets/images/ig_post_kathakali_culture_1791274573169.jpg';
import kadamakkudySunsetImg from '../assets/images/ig_reel_kadamakkudy_sunset_1791274586127.jpg';

export const WANDER_INSTAGRAM_URL =
  'https://www.instagram.com/wander.in.kochi?stkn=MWc3NXB0NnMwbmw5dQ%3D%3D&utm_source=qr';

export const WANDER_INSTAGRAM_HANDLE = '@wander.in.kochi';
export const TARGET_WHATSAPP_RAW = '8891396469';
export const TARGET_WHATSAPP_INTL = '918891396469';
export const TARGET_WHATSAPP_DISPLAY = '+91 88913 96469';

export const ASSETS = {
  heroCreator: heroCreatorImg,
  culinaryReels: culinaryReelsImg,
  heritageWalks: heritageWalksImg,
  waterMetro: waterMetroImg,
  streetFoodHost: streetFoodHostImg,
  kathakaliCulture: kathakaliCultureImg,
  kadamakkudySunset: kadamakkudySunsetImg,
};

export const OPEN_HOST_ROLE = {
  title: 'On-Camera Host & Storyteller',
  department: 'On-Camera Hosting · Exclusive Opening',
  schedule: 'Flexible Part-Time / Weekend Field Shoots',
  locations: 'Fort Kochi · Mattancherry · Marine Drive · Kadamakkudy · Panampilly Nagar',
  summary:
    'We are looking for charismatic, camera-confident presenters to be the face and voice of @wander.in.kochi. You will walk through Kochi’s historic lanes, taste legendary street food, talk to local artisans, and bring Cochin’s stories alive on Instagram Reels.',
  whatYouDo: [
    'Host engaging 30–90 second vertical Reels across Kochi’s food spots, heritage streets, and backwater islands',
    'Lead warm, spontaneous conversations with cafe owners, fishermen, artists, and everyday Cochin locals',
    'Deliver natural walk-and-talk intros and voiceovers in Malayalam and English without sounding scripted',
    'Collaborate with our on-ground camera and editing crew during golden-hour and weekend shoots',
  ],
  requirements: [
    'Natural camera presence, expressive energy, and genuine curiosity about Kochi',
    'Comfort speaking in conversational Malayalam and/or English on camera',
    'Based in or able to commute easily across Kochi / Ernakulam for field shoots',
    'No heavy camera gear required—our production team handles filming and editing',
  ],
};

export interface HostingStyleOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export const HOSTING_STYLES: HostingStyleOption[] = [
  {
    id: 'street-food-explorer',
    title: 'Food & Cafe Explorer',
    subtitle: 'Chai stalls, toddy shops & art cafes',
    description: 'High-warmth tasting reactions and stories behind Kochi’s kitchens',
  },
  {
    id: 'culture-walk-narrator',
    title: 'Culture & Heritage Storyteller',
    subtitle: 'Fort Kochi, Jew Town & hidden lanes',
    description: 'Immersive walk-and-talk hosting through history, art & architecture',
  },
  {
    id: 'vox-pop-conversationalist',
    title: 'Street Conversations & Local Banter',
    subtitle: 'Markets, ferries & public squares',
    description: 'Spontaneous, witty interviews with Cochin locals and characters',
  },
  {
    id: 'scenic-travel-presenter',
    title: 'Island & Backwater Guide',
    subtitle: 'Kadamakkudy, Vypin & Water Metro',
    description: 'Calm, cinematic on-camera presence for sunset and travel trails',
  },
];

export interface InstagramFeedPost {
  id: string;
  title: string;
  caption: string;
  format: 'Reel · 9:16' | 'Carousel · 4:5' | 'Spotlight · 16:9';
  location: string;
  viewsOrLikes: string;
  image: string;
  hostingPrompt: string;
  featured?: boolean;
}

export const INSTAGRAM_FEED_POSTS: InstagramFeedPost[] = [
  {
    id: 'ig-street-food-pazhampori',
    title: 'Evening Chaya & Pazhampori Trail in Ernakulam',
    caption:
      'Follow our host into the evening steam of Ernakulam’s oldest tea stalls—where brass samovars never stop boiling and every local has a favourite bench.',
    format: 'Reel · 9:16',
    location: 'Broadway & Market Road, Ernakulam',
    viewsOrLikes: 'On-Camera Food Reel · @wander.in.kochi',
    image: ASSETS.streetFoodHost,
    hostingPrompt:
      'I want to host a high-energy evening street food walk through Broadway and Kaloor, talking to tea-masters and regulars over hot pazhampori and beef roast.',
    featured: true,
  },
  {
    id: 'ig-kadamakkudy-sunset',
    title: 'Golden Hour Country Boat Across Kadamakkudy',
    caption:
      'Twenty minutes from the city traffic lies a labyrinth of pokkali islands, Chinese nets, and pink evening skies. Hosted live on the water.',
    format: 'Reel · 9:16',
    location: 'Kadamakkudy Islands, Kochi',
    viewsOrLikes: 'On-Camera Travel Reel · @wander.in.kochi',
    image: ASSETS.kadamakkudySunset,
    hostingPrompt:
      'I want to host a sunset boat reel in Kadamakkudy, introducing viewers to the toddy tappers, pokkali farms, and quiet island life just outside the city.',
    featured: true,
  },
  {
    id: 'ig-fort-kochi-nets',
    title: '500 Years of Chinese Fishing Nets at Sunset',
    caption:
      'Walking Vasco da Gama Square at 5:45 PM as the wooden cantilevers drop into the Arabian Sea—talking with the fishermen who pull the ropes every tide.',
    format: 'Spotlight · 16:9',
    location: 'Vasco da Gama Square, Fort Kochi',
    viewsOrLikes: 'Signature Host Feature · @wander.in.kochi',
    image: ASSETS.heroCreator,
    hostingPrompt:
      'I want to host a walk-and-talk episode at the Fort Kochi Chinese fishing nets at dawn, joining the crew and sharing the real history behind the shore.',
    featured: true,
  },
  {
    id: 'ig-mattancherry-cafes',
    title: 'Inside Fort Kochi’s Sunlit Courtyard Art Cafes',
    caption:
      'Distressed teak tables, Malabar filter coffee, coastal seafood platters, and contemporary art tucked behind 300-year-old colonial doors.',
    format: 'Carousel · 4:5',
    location: 'Princess Street, Fort Kochi',
    viewsOrLikes: 'Cafe Guide Reel · @wander.in.kochi',
    image: ASSETS.culinaryReels,
    hostingPrompt:
      'I want to host a “3 Hidden Courtyard Cafes in Fort Kochi” reel where we taste their signature dish and chat with the chefs and artists inside.',
  },
  {
    id: 'ig-jew-town-lanes',
    title: 'Spice Warehouses & Pastel Lanes of Jew Town',
    caption:
      'Wandering past ginger-scented warehouses, antique wooden doorways, and local perfumers along Synagogue Lane in Mattancherry.',
    format: 'Reel · 9:16',
    location: 'Jew Town, Mattancherry',
    viewsOrLikes: 'Heritage Walk Reel · @wander.in.kochi',
    image: ASSETS.heritageWalks,
    hostingPrompt:
      'I want to host a sensory walking tour down Synagogue Lane in Mattancherry, uncovering stories of spice merchants and heirloom antique collectors.',
  },
  {
    id: 'ig-kathakali-backstage',
    title: 'Before the Curtain Rises: Kathakali Greenroom',
    caption:
      'Three hours of natural mineral pigments, rice-paste chutti, and centuries of devotion inside Fort Kochi’s cultural stage.',
    format: 'Carousel · 4:5',
    location: 'Fort Kochi Cultural Centre',
    viewsOrLikes: 'Culture Feature · @wander.in.kochi',
    image: ASSETS.kathakaliCulture,
    hostingPrompt:
      'I want to host a behind-the-scenes cultural reel interviewing Kathakali and Kalaripayattu artists as they prepare backstage before an evening performance.',
  },
  {
    id: 'ig-water-metro-twilight',
    title: 'Island Hopping on the Kochi Water Metro at Blue Hour',
    caption:
      'Gliding from High Court Terminal to Vypin and Bolgatty as the city skyline lights up across the emerald backwaters.',
    format: 'Spotlight · 16:9',
    location: 'High Court Terminal to Vypin Island',
    viewsOrLikes: 'City Transit Reel · @wander.in.kochi',
    image: ASSETS.waterMetro,
    hostingPrompt:
      'I want to host a ₹40 Water Metro island-hopping challenge, showing viewers the best sunset spots and snacks reachable by ferry from High Court.',
  },
];

export const KOCHI_ZONES = [
  'Fort Kochi & Mattancherry',
  'Ernakulam Central / Marine Drive / MG Road',
  'Panampilly Nagar / Kadavanthra / Vyttila',
  'Kakkanad / Edappally / Kaloor',
  'Vypin / Cherai / Kadamakkudy Islands',
  'Aluva / Tripunithura / Greater Kochi',
];

export const EXPERIENCE_LEVELS = [
  'Fresh Face (Natural on camera, excited to start)',
  'Active Creator (1+ yrs hosting Reels, vlogs, or stage events)',
  'Experienced Presenter / Anchor (2+ yrs on-camera interviews & storytelling)',
];

export const AVAILABILITY_OPTIONS = [
  'Weekends & Golden Hours (1–2 shoots/week)',
  'Part-Time Flexible (3–4 shoots/week)',
  'Full-Time On-Camera Host',
  'Per-Episode / Freelance Shoots',
];

export const SAMPLE_HOST_APPLICATIONS = [
  {
    fullName: 'Diya Varghese',
    whatsappNumber: '9447890123',
    instagramHandle: '@diyawanders.kochi',
    portfolioUrl: 'https://www.instagram.com/wander.in.kochi',
    hostingStyle: 'Food & Cafe Explorer',
    kochiZone: 'Panampilly Nagar / Kadavanthra / Vyttila',
    experienceLevel: 'Active Creator (1+ yrs hosting Reels, vlogs, or stage events)',
    availability: 'Weekends & Golden Hours (1–2 shoots/week)',
    languages: 'Malayalam (Fluent + Cochin Slang), English',
    cameraComfort: 'Comfortable with spontaneous street interviews & live food tasting',
    storyPitch:
      'An undisclosed heritage bakeries trail across Mattancherry and Broadway—talking on camera with 70-year-old wood-fired oven bakers about plum cakes, local bread stamps, and stories that never make it to mainstream vlogs.',
  },
  {
    fullName: 'Aarav Menon',
    whatsappNumber: '9847123456',
    instagramHandle: '@aaravtalks.kochi',
    portfolioUrl: 'https://www.instagram.com/wander.in.kochi',
    hostingStyle: 'Culture & Heritage Storyteller',
    kochiZone: 'Fort Kochi & Mattancherry',
    experienceLevel: 'Experienced Presenter / Anchor (2+ yrs on-camera interviews & storytelling)',
    availability: 'Part-Time Flexible (3–4 shoots/week)',
    languages: 'Malayalam, English, Hindi',
    cameraComfort: 'Strong walk-and-talk narration, crowd interaction & bilingual hosting',
    storyPitch:
      'A 60-second dawn ferry episode from Fort Kochi to Vypin at 6:00 AM—starting with a live on-camera hook on the boat deck, chatting with daily commuters, and ending at the morning fish auction.',
  },
];
