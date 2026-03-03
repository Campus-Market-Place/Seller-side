export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  status: 'pending' | 'active' | 'rejected' | 'hidden';
  description: string;
  category: string;
  rejectionReason?: string;
}

export interface Follower {
  id: string;
  username: string;
  avatar: string;
  followedAt: string;
}

export interface Activity {
  id: string;
  type: 'follower' | 'view';
  message: string;
  time: string;
}

export interface ShopProfile {
  name: string;
  description: string;
  logo: string;
  telegramLink: string;
  instagram?: string;
  tiktok?: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    rating: 4.5,
    status: 'active',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Campus Backpack',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    rating: 4.8,
    status: 'active',
    description: 'Durable backpack perfect for students',
    category: 'Accessories',
  },
  {
    id: '3',
    name: 'Notebook Set',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
    rating: 4.3,
    status: 'hidden',
    description: 'Set of 5 quality notebooks',
    category: 'Stationery',
  },
  {
    id: '4',
    name: 'USB-C Cable',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
    rating: 4.6,
    status: 'active',
    description: 'Fast charging USB-C cable 2m',
    category: 'Electronics',
  },
  {
    id: '5',
    name: 'Desk Lamp',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    rating: 0,
    status: 'pending',
    description: 'LED desk lamp with adjustable brightness',
    category: 'Electronics',
  },
  {
    id: '6',
    name: 'Water Bottle',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    rating: 0,
    status: 'rejected',
    description: 'Stainless steel water bottle',
    category: 'Accessories',
    rejectionReason: 'Product image quality is too low. Please upload a clearer photo.',
  },
];

export const mockFollowers: Follower[] = [
  {
    id: '1',
    username: '@sarah_chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    followedAt: '2h ago',
  },
  {
    id: '2',
    username: '@mike_student',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    followedAt: '5h ago',
  },
  {
    id: '3',
    username: '@emma_wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    followedAt: '1d ago',
  },
  {
    id: '4',
    username: '@alex_brown',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    followedAt: '2d ago',
  },
  {
    id: '5',
    username: '@jess_lee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    followedAt: '3d ago',
  },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'follower',
    message: '@sarah_chen started following your shop',
    time: '2h ago',
  },
  {
    id: '2',
    type: 'view',
    message: 'Wireless Headphones was viewed 12 times',
    time: '4h ago',
  },
  {
    id: '3',
    type: 'follower',
    message: '@mike_student started following your shop',
    time: '5h ago',
  },
  {
    id: '4',
    type: 'view',
    message: 'Campus Backpack was viewed 8 times',
    time: '1d ago',
  },
];

export const mockShopProfile: ShopProfile = {
  name: 'Campus Tech Store',
  description: 'Your one-stop shop for tech accessories and campus essentials. Quality products at student-friendly prices!',
  logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
  telegramLink: 't.me/campustechstore',
  instagram: 'campustechstore',
  tiktok: '@campustech',
};

export const productCategories = [
  'Electronics',
  'Accessories',
  'Stationery',
  'Books',
  'Clothing',
  'Food & Snacks',
  'Other',
];