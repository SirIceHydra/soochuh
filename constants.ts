import { ColorVariant, Product } from './types';

export const COLORS: ColorVariant[] = [
  { id: 'navy', name: 'Deep Navy', hex: '#1e293b', tailWindClass: 'bg-slate-800' },
  { id: 'black', name: 'Midnight Black', hex: '#000000', tailWindClass: 'bg-black' },
  { id: 'burgundy', name: 'Royal Burgundy', hex: '#5b1825', tailWindClass: 'bg-rose-900' },
  { id: 'ceil', name: 'Ceil Blue', hex: '#6aa6d9', tailWindClass: 'bg-sky-400' },
  { id: 'olive', name: 'Martini Olive', hex: '#556b2f', tailWindClass: 'bg-olive-700' },
  { id: 'mauve', name: 'Dusty Mauve', hex: '#b784a7', tailWindClass: 'bg-pink-400' },
];

export const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL'];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'The Rafael Scrub Top',
    subtitle: 'One-Pocket Modern Fit',
    price: 950,
    salePrice: 850,
    category: 'tops',
    description: 'Engineered for the modern medical professional. Features our proprietary FIONx fabric technology offering four-way stretch, moisture-wicking properties, and anti-wrinkle capabilities.',
    colors: COLORS,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2670&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=2670&auto=format&fit=crop',
    rating: 4.9,
    reviews: 1240,
    features: ['Total of 3 pockets', 'Modern V-neck', 'Moisture wicking', 'Anti-wrinkle'],
    isBestSeller: true
  },
  {
    id: 'p2',
    name: 'The Zamora Jogger',
    subtitle: 'High Waisted Slim Fit',
    price: 1150,
    category: 'pants',
    description: 'The jogger that started it all. Designed with a slim fit and five utilitarian pockets, providing maximum storage without compromising style.',
    colors: COLORS,
    image: 'https://images.unsplash.com/photo-1551505688-596c3d516a84?q=80&w=2572&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=2622&auto=format&fit=crop',
    rating: 4.8,
    reviews: 3400,
    features: ['5 Pockets', 'Yoga waistband', 'Ribbed ankle cuffs', 'Four-way stretch'],
    isBestSeller: true
  },
  {
    id: 'p3',
    name: 'The Casma Scrub Top',
    subtitle: 'Three-Pocket Classic Fit',
    price: 950,
    category: 'tops',
    description: 'A classic silhouette updated with modern technology. Features a tailored fit that provides a professional appearance while maintaining all-day comfort.',
    colors: COLORS,
    image: 'https://images.unsplash.com/photo-1599045118108-bf9954418b76?q=80&w=2574&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=2572&auto=format&fit=crop',
    rating: 4.7,
    reviews: 890,
    features: ['Classic V-neck', 'Hidden side pocket', 'Tailored fit', 'Super soft'],
    isNew: true
  },
  {
    id: 'p4',
    name: 'The Yola Skinny Pant',
    subtitle: 'Skinny Leg Regular Rise',
    price: 1100,
    salePrice: 899,
    category: 'pants',
    description: 'Sleek, sharp, and professional. The Yola offers a straight skinny leg cut with multiple secure pockets for your essentials.',
    colors: COLORS,
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=2574&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2609&auto=format&fit=crop',
    rating: 4.6,
    reviews: 650,
    features: ['10 Pockets', 'Skinny fit', 'Side slits', 'Drawstring waist']
  },
  {
    id: 'p5',
    name: 'The Chisec Lab Coat',
    subtitle: 'Modern Professional Coat',
    price: 2100,
    category: 'outerwear',
    description: 'Reinventing the white coat. Fluid resistant, plenty of pockets, and a cut that looks like a blazer but functions like a lab coat.',
    colors: [COLORS[0], COLORS[1]], // Only Navy and Black for coats usually
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2680&auto=format&fit=crop',
    rating: 5.0,
    reviews: 210,
    features: ['Tablet pocket', 'Back vent', 'Notched lapel', 'Fluid barrier'],
    isNew: true
  },
  {
    id: 'p6',
    name: 'The Soochuh Kit',
    subtitle: 'Complete Scrub Set',
    price: 1950,
    salePrice: 1750,
    category: 'kits',
    description: 'Get the full look. Includes one Rafael Top and one Zamora Jogger in matching colors. The ultimate starter pack for residents.',
    colors: COLORS,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2564&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1606265339309-7c8646b3f0f2?q=80&w=2670&auto=format&fit=crop',
    rating: 4.9,
    reviews: 5000,
    features: ['Best value', 'Perfect color match', 'Full outfit', 'Gift ready'],
    isBestSeller: true
  }
];