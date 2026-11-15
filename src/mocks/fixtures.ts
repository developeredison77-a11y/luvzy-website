import type { DemoState, Person } from '../types/models';

const image = (file: string) => `/images/${file}`;

export const people: Person[] = [
  { id: 1, name: 'Ananya', age: 26, city: 'Bengaluru', bio: 'Coffee, mountain air, and long conversations. Looking for genuine chemistry.', work: 'Product designer', interests: ['Travel', 'Coffee', 'Music'], photo: image('offline_1.webp'), role: 'girl', distance: '3 km away', availableActions: ['video', 'audio', 'chat'] },
  { id: 2, name: 'Mira', age: 25, city: 'Kochi', bio: 'Little cafés, sunset walks, warm people and spontaneous weekend plans.', work: 'Architect', interests: ['Art', 'Travel', 'Food'], photo: image('offline_2.webp'), role: 'girl', distance: '6 km away', availableActions: ['audio', 'chat'] },
  { id: 3, name: 'Dev', age: 29, city: 'Bengaluru', bio: 'Photographer, curious traveller, and someone who loves a good playlist.', work: 'Photographer', interests: ['Travel', 'Music', 'Books'], photo: image('offline_3.webp'), role: 'boy', distance: '9 km away' },
  { id: 4, name: 'Sara', age: 27, city: 'Hyderabad', bio: 'I collect playlists, recipes and beautiful stories from different cities.', work: 'Content creator', interests: ['Music', 'Food', 'Art'], photo: image('offline_4.webp'), role: 'girl', distance: '11 km away', availableActions: ['audio', 'chat'] },
  { id: 5, name: 'Aarav', age: 28, city: 'Chennai', bio: 'Books, early morning runs and conversations that go beyond small talk.', work: 'Software engineer', interests: ['Fitness', 'Books', 'Travel'], photo: image('offline_5.webp'), role: 'boy', distance: '14 km away' },
  { id: 6, name: 'Riya', age: 24, city: 'Mumbai', bio: 'Great energy, thoughtful gestures, and the occasional terrible joke.', work: 'Marketing lead', interests: ['Art', 'Coffee', 'Fitness'], photo: image('offline_6.webp'), role: 'girl', distance: '8 km away', availableActions: ['video', 'chat'] },
  { id: 7, name: 'Arjun', age: 30, city: 'Kochi', bio: 'Weekend road trips, local food spots and finding joy in small things.', work: 'Entrepreneur', interests: ['Food', 'Travel', 'Fitness'], photo: image('offline_7.webp'), role: 'boy', distance: '18 km away' },
  { id: 8, name: 'Isha', age: 26, city: 'Pune', bio: 'Always curious about the next exhibition, book or spontaneous journey.', work: 'Illustrator', interests: ['Art', 'Books', 'Coffee'], photo: image('offline_8.webp'), role: 'girl', distance: '12 km away', availableActions: ['video', 'audio', 'chat'] },
  { id: 9, name: 'Neha', age: 27, city: 'Delhi', bio: 'Curious about thoughtful ideas, new places, and the stories people carry.', work: 'UX researcher', interests: ['Art', 'Travel', 'Books'], photo: image('users/women/wome_006.webp'), role: 'girl', distance: '5 km away', availableActions: ['video', 'chat'] },
  { id: 10, name: 'Kavya', age: 25, city: 'Chennai', bio: 'Finding balance through movement, good food, and a little time outdoors.', work: 'Fitness & wellness', interests: ['Fitness', 'Books', 'Music'], photo: image('users/women/wome_007.webp'), role: 'girl', distance: '7 km away', availableActions: ['audio', 'chat'] },
  { id: 11, name: 'Diya', age: 26, city: 'Kolkata', bio: 'Writing songs, collecting playlists, and saying yes to creative plans.', work: 'Musician & songwriter', interests: ['Music', 'Travel', 'Art'], photo: image('users/women/wome_008.webp'), role: 'girl', distance: '10 km away', availableActions: ['video', 'audio'] },
  { id: 12, name: 'Aditi', age: 24, city: 'Jaipur', bio: 'Weekend galleries, street food, and conversations that make time fly.', work: 'Visual artist', interests: ['Art', 'Food', 'Travel'], photo: image('users/women/wome_009.webp'), role: 'girl', distance: '4 km away', availableActions: ['video', 'chat'] },
  { id: 13, name: 'Nisha', age: 28, city: 'Ahmedabad', bio: 'A little yoga, a lot of music, and always up for a new café.', work: 'Yoga instructor', interests: ['Fitness', 'Music', 'Coffee'], photo: image('users/women/wome_010.webp'), role: 'girl', distance: '8 km away', availableActions: ['audio', 'chat'] },
  { id: 14, name: 'Tara', age: 23, city: 'Mysuru', bio: 'Bookshop regular with a soft spot for spontaneous road trips.', work: 'Graduate student', interests: ['Books', 'Travel', 'Coffee'], photo: image('users/women/wome_011.webp'), role: 'girl', distance: '6 km away', availableActions: ['video', 'audio', 'chat'] },
  { id: 15, name: 'Meera', age: 29, city: 'Indore', bio: 'Trying new recipes and finding the best live music in town.', work: 'Chef', interests: ['Food', 'Music', 'Art'], photo: image('users/women/wome_012.webp'), role: 'girl', distance: '9 km away', availableActions: ['video', 'chat'] },
  { id: 16, name: 'Pooja', age: 27, city: 'Lucknow', bio: 'Long walks, clever films, and good company are my kind of plans.', work: 'Film editor', interests: ['Movies', 'Travel', 'Books'], photo: image('users/women/wome_013.webp'), role: 'girl', distance: '12 km away', availableActions: ['audio', 'chat'] },
  { id: 17, name: 'Sana', age: 25, city: 'Coimbatore', bio: 'Design-minded, outdoorsy, and happiest around kind people.', work: 'Interior designer', interests: ['Art', 'Fitness', 'Travel'], photo: image('users/women/wome_014.webp'), role: 'girl', distance: '5 km away', availableActions: ['video', 'audio'] },
  { id: 18, name: 'Ira', age: 26, city: 'Visakhapatnam', bio: 'Collecting playlists and little moments worth remembering.', work: 'Music teacher', interests: ['Music', 'Coffee', 'Books'], photo: image('users/women/wome_015.webp'), role: 'girl', distance: '7 km away', availableActions: ['video', 'chat'] },
  { id: 19, name: 'Rhea', age: 24, city: 'Thiruvananthapuram', bio: 'Nature trails, beach sunsets, and a genuinely good conversation.', work: 'Marine biologist', interests: ['Travel', 'Fitness', 'Art'], photo: image('users/women/wome_016.webp'), role: 'girl', distance: '11 km away', availableActions: ['audio', 'chat'] },
];

export const initialState: DemoState = {
  signedIn: false,
  profile: { name: 'LUVZY Member', age: 26, city: 'Bengaluru', role: 'boy', bio: 'Here for good conversations and a little everyday magic.', interests: ['Travel', 'Music', 'Coffee'] },
  likes: [], interestsSent: [], passes: [], blocked: [], unreadNotifications: [1, 2, 3], messages: [],
  walletCoins: 500, rewardCoins: 18450, online: true, discoverable: true, quietMode: false, notificationsEnabled: true, membership: 'Starter',
  withdrawals: [], reports: [], calls: [
    { id: 'sample-call-1', personId: 3, createdAt: new Date(Date.now() - 45 * 60_000).toISOString(), mode: 'video', durationSeconds: 420, coinsSpent: 560, status: 'completed', direction: 'outgoing' },
    { id: 'sample-call-2', personId: 5, createdAt: new Date(Date.now() - 26 * 60 * 60_000).toISOString(), mode: 'audio', durationSeconds: 180, coinsSpent: 240, status: 'completed', direction: 'incoming' },
    { id: 'sample-call-3', personId: 7, createdAt: new Date(Date.now() - 29 * 60 * 60_000).toISOString(), mode: 'video', durationSeconds: 0, coinsSpent: 0, status: 'missed', direction: 'incoming' },
  ], faqOpen: null, storyReactions: {}, storyComments: {},
};

export const cities = [...new Set(people.map((person) => person.city))];
export const interests = [...new Set(people.flatMap((person) => person.interests))].sort();
export const coinPacks = [
  { id: 'starter', coins: 100, price: 20, label: 'Starter' },
  { id: 'popular', coins: 300, price: 50, label: 'Most popular' },
  { id: 'value', coins: 700, price: 100, label: 'Extra value' },
  { id: 'max', coins: 1600, price: 200, label: 'Best value' },
] as const;

export const storyImages = [
  'photo-1500530855697-b586d89ba3ee.jpg', 'photo-1470252649378-9c29740c9fa8.jpg',
  'photo-1490750967868-88aa4486c946.jpg', 'photo-1441974231531-c6227db76b6e.jpg',
  'photo-1472214103451-9374bd1c798e.jpg', 'photo-1500534623283-312aade485b7.jpg',
  'photo-1511988617509-a57c8a288659.jpg', 'photo-1518837695005-2083093ee35b.jpg',
].map(image);
