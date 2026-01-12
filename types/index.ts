export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'agent' | 'admin' | 'investor';
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  // Legacy fields found in DB
  beds?: number;
  baths?: number;
  priceUsd?: number;
  sqft: number;
  yearBuilt: number;
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse';
  listingType: 'sale' | 'rent';
  status: 'active' | 'pending' | 'sold';
  images: string[];
  agent: User;
  verified: boolean;
  createdAt: string;
}

export interface ApiError {
  message: string;
  status: number;
}
