export interface Service {
  _id?: string;
  serviceName: string;
  category: string;
  subCategory: string;
  description: string;
  duration: number;
  price: number;
  discountPrice: number | null;
  image: string;
  benefits: string[];
  includes: string[];
  suitableFor: string[];
  preparation: string;
  aftercare: string;
  rating: number;
  totalReviews: number;
  availability: boolean;
  featured: boolean;
  tags: string[];
}

export interface Appointment extends Service {
  _id?: string;
  date: string;
  time: string;
  userId: string;
  userName: string;
  userEmail: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment: "unpaid" | "paid" 
}