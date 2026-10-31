/**
 * MERZY — public social & business data gathered by scraping public sources
 * (Instagram @merzy.eg, Facebook page, Talabat listing) on Oct 31, 2026.
 *
 * All images are stored locally under /scraped/instagram/ so the site does not
 * depend on Instagram CDN links (which expire).
 */

export interface MerzySocialProfile {
  handle: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  organization: string;
  location: string;
  linkLabel: string;
  externalLinks: string[];
  avatar: string;
}

export interface MerzyHighlight {
  name: string;
  cover: string;
  url: string;
}

export interface MerzySocialPost {
  code: string;
  type: 'reel' | 'photo' | 'carousel';
  date: string; // display date
  image: string; // local asset path
  caption: string;
  likesText: string;
  location?: string;
  collabWith?: string;
  audio?: string;
  textOnImage?: string;
  url: string;
}

export interface MerzyComment {
  author: string;
  text: string;
  source: string;
}

export interface MerzyBusinessLinks {
  instagram: string;
  facebook: string;
  talabat: string;
}

export const MERZY_PROFILE: MerzySocialProfile = {
  handle: '@merzy.eg',
  name: 'Merzy Coffee',
  bio: 'for those who value the details.',
  followers: 4836,
  following: 127,
  organization: 'Merzy Coffee',
  location: 'Bibliotheca Alexandrina — Alexandria',
  linkLabel: 'www.talabat.com/egypt/merzy',
  externalLinks: [
    'https://www.instagram.com/merzy.eg/',
    'https://www.facebook.com/p/Merzy-Coffee-61583371166412/',
    'https://www.talabat.com/egypt/restaurant/1102357/merzy-shatby',
  ],
  avatar: '/scraped/instagram/profile-pic.jpg',
};

export const MERZY_LINKS: MerzyBusinessLinks = {
  instagram: 'https://www.instagram.com/merzy.eg/',
  facebook: 'https://www.facebook.com/p/Merzy-Coffee-61583371166412/',
  talabat: 'https://www.talabat.com/egypt/restaurant/1102357/merzy-shatby',
};

export const MERZY_HIGHLIGHTS: MerzyHighlight[] = [
  { name: 'Desserts', cover: '/scraped/instagram/highlight-desserts.jpg', url: 'https://www.instagram.com/stories/highlights/17937361365232810/' },
  { name: 'Coffee', cover: '/scraped/instagram/highlight-coffee.jpg', url: 'https://www.instagram.com/stories/highlights/18010823693811193/' },
  { name: 'Pastries', cover: '/scraped/instagram/highlight-pastries.jpg', url: 'https://www.instagram.com/stories/highlights/17848572765607283/' },
  { name: 'Visits', cover: '/scraped/instagram/highlight-visits.jpg', url: 'https://www.instagram.com/stories/highlights/18070516913242324/' },
];

export const MERZY_POSTS: MerzySocialPost[] = [
  {
    code: 'DdDqTxbDem_',
    type: 'carousel',
    date: 'September 8, 2026',
    image: '/scraped/instagram/post-sep08-details.jpg',
    caption: "It's all in the details. Designed for the moments in between 💜",
    likesText: '318 likes',
    location: 'Bibliotheca Alexandrina - مكتبة الاسكندرية',
    collabWith: 'kayan.interiors',
    url: 'https://www.instagram.com/p/DdDqTxbDem_/',
  },
  {
    code: 'DdoGo7FtktG',
    type: 'photo',
    date: 'September 23, 2026',
    image: '/scraped/instagram/post-sep23-moments.jpg',
    caption: 'Made for moments like this. 💜',
    likesText: '73 likes',
    location: 'Bibliotheca Alexandrina - مكتبة الاسكندرية',
    url: 'https://www.instagram.com/p/DdoGo7FtktG/',
  },
  {
    code: 'DejdxEUtHhg',
    type: 'reel',
    date: 'October 16, 2026',
    image: '/scraped/instagram/post-oct16-dirty-espresso.jpg',
    caption: 'Dirty esspreso 💜',
    likesText: '44 likes',
    audio: 'Rivaro • Sun On Replay',
    url: 'https://www.instagram.com/reel/DejdxEUtHhg/',
  },
  {
    code: 'DefQCBoDSHz',
    type: 'carousel',
    date: 'October 14, 2026',
    image: '/scraped/instagram/post-oct14-v60.jpg',
    caption: 'Every pour, a little closer to perfection. ☕️ The art of V60 at MERZY. More than coffee. 💜',
    likesText: '22 likes',
    location: 'Bibliotheca Alexandrina - مكتبة الاسكندرية',
    url: 'https://www.instagram.com/p/DefQCBoDSHz/',
  },
  {
    code: 'DdwKyiVtQLj',
    type: 'photo',
    date: 'September 26, 2026',
    image: '/scraped/instagram/post-sep26-coffee-break.jpg',
    caption: 'Your kind of coffee break 💜',
    likesText: '27 likes',
    location: 'Bibliotheca Alexandrina - مكتبة الاسكندرية',
    url: 'https://www.instagram.com/p/DdwKyiVtQLj/',
  },
  {
    code: 'Ddbh6QcjayR',
    type: 'carousel',
    date: 'September 18, 2026',
    image: '/scraped/instagram/post-sep18-bw.jpg',
    caption: 'Even in black and white, MERZY still stands out. 💜',
    likesText: '94 likes',
    location: 'Bibliotheca Alexandrina - مكتبة الاسكندرية',
    url: 'https://www.instagram.com/p/Ddbh6QcjayR/',
  },
  {
    code: 'DdbSyMltqtZ',
    type: 'photo',
    date: 'September 18, 2026',
    image: '/scraped/instagram/post-sep18-smoothie.jpg',
    caption: '',
    likesText: '',
    url: 'https://www.instagram.com/p/DdbSyMltqtZ/',
  },
  {
    code: 'DdObF8yNcC5',
    type: 'photo',
    date: 'September 13, 2026',
    image: '/scraped/instagram/post-sep13-new.jpg',
    caption: "You weren't supposed to see this yet. 👀",
    likesText: '47 likes',
    location: 'Bibliotheca Alexandrina - مكتبة الاسكندرية',
    textOnImage: 'SOMETHING NEW IS TAKING SHAPE',
    url: 'https://www.instagram.com/p/DdObF8yNcC5/',
  },
  {
    code: 'DdI_IJIty8d',
    type: 'reel',
    date: 'September 11, 2026',
    image: '/scraped/instagram/post-sep11-gear.jpg',
    caption: 'Good coffee. Better details. Specialty coffee, the MERZY way. ☕️',
    likesText: '30 likes',
    textOnImage: '3BOMBER MHW',
    url: 'https://www.instagram.com/reel/DdI_IJIty8d/',
  },
  {
    code: 'DdGKz9lt7Nz',
    type: 'photo',
    date: 'September 9, 2026',
    image: '/scraped/instagram/post-sep09-pause.jpg',
    caption: 'A little pause, made well.',
    likesText: '16 likes',
    location: 'Bibliotheca Alexandrina - مكتبة الاسكندرية',
    url: 'https://www.instagram.com/p/DdGKz9lt7Nz/',
  },
  {
    code: 'DZMgknFtwhS',
    type: 'reel',
    date: 'June 5, 2026',
    image: '/scraped/instagram/post-jun05-morning.jpg',
    caption: 'Morning at merzy ☀️',
    likesText: '168 likes',
    url: 'https://www.instagram.com/reel/DZMgknFtwhS/',
  },
  {
    code: 'DX7HR7nt7Hy',
    type: 'reel',
    date: 'May 4, 2026',
    image: '/scraped/instagram/post-may04-vibes.jpg',
    caption: "It's Not Just Vibes… It's Merzy 💜",
    likesText: '68 likes',
    url: 'https://www.instagram.com/reel/DX7HR7nt7Hy/',
  },
];

/** Real reactions scraped from the @merzy.eg post comments. */
export const MERZY_COMMENTS: MerzyComment[] = [
  { author: 'aya_samir564428', text: 'Perfecttttttt', source: 'Instagram, Sep 8 post' },
  { author: 'marimarfaa_', text: 'Wooooowwwwwww 😍', source: 'Instagram, Sep 8 post' },
  { author: 'nayroz_ramadan', text: 'يا نهار ابييييض عالحلاوة 😢❤️', source: 'Instagram, Sep 13 post' },
  { author: 'ragiaamgad98', text: 'Tohfa 😍😍😍', source: 'Instagram, Sep 18 post' },
  { author: 'aya_samir564428', text: 'Fireee ❤️🔥', source: 'Instagram, Sep 11 post' },
  { author: 'aya_samir564428', text: 'Dangerous as usual 🔥', source: 'Instagram, Oct 16 post' },
  { author: 'tota_guitarista', text: '🔥❤️❤️', source: 'Instagram, Jun 5 post' },
];
