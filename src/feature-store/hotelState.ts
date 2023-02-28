import { defineStore } from "pinia";
import { User } from "./userState";

// Modes
export interface Address {
  district: string;
  subDistrict: string;
  houseNumber: string;
  postalCode: string;
  geo: Geolocation;
}

export interface Geolocation {
  lat: number;
  long: number;
}

export interface RoomFeature {
  size: string;
  bedType: "single" | "twin" | "double";
  bathroomItems: string[]; //* details
  inRoomAmenities: string[]; //* details
}

enum RoomType {
  Standard = "Standard",
  Deluxe = "Deluxe",
  Suite = "Suite",
}

export interface Contract {
  tel: string;
  email: string;
}

export interface HouseFeature {
  hasParking: boolean;
  numRooms?: number;
  roomTypes?: string[];
  numFloors: "one" | "two" | "other";
}

export interface ServiceFeatures {
  restaurantServiceTimes?: ("breakfast" | "lunch" | "dinner" | "none")[];
  shuttleService: boolean;
  petsAllowed: boolean;
  securities: string[];
}

export interface Hotel {
  hotelId: string;
  geo: Geolocation;
  name: string;
  description: string;
  address: Address;
  checkIn: Date;
  checkOut: Date;
  roomFeatures: RoomFeature[];
  hotelType: "hotel" | "house" | "poolvilla";
  houseFeatures?: HouseFeature;
  roomType: RoomType;
  restaurantServiceTimes?: ("breakfast" | "lunch" | "dinner" | "none")[];
  shuttleService: boolean;
  petsAllowed: boolean;
  price: number;
  images: string[];
  services: ServiceFeatures;
  occupancy: {
    adults: number;
    children: number;
  };
  contract: Contract;
  rating: {
    stars: number;
    reviews: {
      user: User;
      date: Date;
      rating: number;
      comment: string;
    }[];
  };
}
