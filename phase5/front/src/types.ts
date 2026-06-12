export type CarType = 'SUV' | 'Luxury' | 'Sedan' | 'Sports' | 'Electric' | 'Compact';
export type Transmission = 'Automatic' | 'Manual';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface RentalCompany {
  id: string;
  name: string;
  country: string;
  logo?: string;
}

export interface Location {
  id: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  companyId: string;
}

export interface Car {
  car_id: string;
  brand: string;
  model: string;
  year: number;
  car_type: CarType;
  seats_number: number;
  transmission_type: Transmission;
  trunk_capacity: string;
  price_per_day: number;
  car_features: string[];
  status: 'Available' | 'Rented' | 'Maintenance';
  image: string;
  isBestSeller?: boolean;
  company_id?: number;
  city_id?: number;
}

export interface Booking {
  booking_id: string;
  car_id: string;
  car_name: string;
  booking_date: string;
  pickup_date: string;
  return_date: string;
  pickup_location: Location;
  return_location: Location;
  total_price: number;
  status: BookingStatus;
}

export interface Review {
  review_id: string;
  car_id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  review_title: string;
  comment: string;
  review_date: string;
}

export interface Tourist {
  passportNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}
