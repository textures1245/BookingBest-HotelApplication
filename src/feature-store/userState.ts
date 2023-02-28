import { defineStore } from "pinia";

type Review = {
  user: User;
  timestamp: Date;
  rating: number;
  comment: string;
};

type User = {
  name: string;
  profilePicture: string;
  reviews: Review[];
};
