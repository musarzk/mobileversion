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
  priceUsd?: number | null;
  listingType: "sale" | "rent";
  location: string;
  address?: string;
  type: "residential" | "commercial" | "land";
  propertyType?: string;
  beds?: number;
  bedrooms?: number;
  baths?: number;
  bathrooms?: number;
  sqft?: number;
  yearBuilt?: number;
  images: string[];
  ownerId: string;
  agentId?: string;
  status: "pending" | "approved" | "rejected" | "suspended" | "sold";
  verified?: boolean;
  approvedAt?: string | Date; // Allow string for JSON response
  approvedBy?: string;
  rejectionReason?: string;
  amenities: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  views: number;
  favorites: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  
  // Legacy fields (optional support if needed, but schema is strict now)
  agent?: User; // Keeping agent for compatibility with existing UI that uses property.agent
}

export interface ApiError {
  message: string;
  status: number;
}
