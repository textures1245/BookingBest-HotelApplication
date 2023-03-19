import { defineStore } from "pinia";

export type Review = {
  user: User;
  timestamp: Date;
  rating: number;
  comment: string;
};

export type User = {
  name: string;
  reviews: Review[];
};
