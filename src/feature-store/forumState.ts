import { defineStore } from "pinia";
import { Hotel } from "./hotelState";
import { User } from "./userState";

interface Topic {
  id: string;
  title: string;
  author: User;
  createdDate: Date;
  hotel: Hotel;
  topicPost: Post;
  posts: Post[];
}

interface Post {
  id: string;
  content: string;
  author: User;
  createdDate: Date;
  images: Image[];
  comments: Post[];
}

interface Image {
  id: string;
  url: string;
  author: User;
  post: Post;
}

export const useForumState = defineStore("forumState", {
  state: () => ({}),
  getters: {},
  actions: {},
});
