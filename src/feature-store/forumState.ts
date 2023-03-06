import { defineStore } from "pinia";
import { Hotel, HotelSearcher } from "./hotelState";
import { User } from "./userState";
import { Account, CurrentAccount, UserCollection } from "../auth/authState";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase.config";
import {
  firestoreDefaultConverter,
  globalFirestoreOptions,
  useCollection,
} from "vuefire";
import { useAuthState } from "../auth/authState";

globalFirestoreOptions.converter = {
  // the default converter just returns the data: (data) => data
  toFirestore: firestoreDefaultConverter.toFirestore,
  fromFirestore: (snapshot, options) => {
    const data = firestoreDefaultConverter.fromFirestore(snapshot, options);
    // if the document doesn't exist, return null
    if (!data) return null;
    // add anything custom to the returned object
    data.metadata = snapshot.metadata;
    return data;
  },
};

//- auth provider
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export type ForumPost = {
  uId: string;
  forumPostId: number;
  user: UserCollection | CurrentAccount;
  title: string;
  desc: string;
  createdDate: Timestamp;
  hotelRef: Hotel | HotelSearcher;
  comments: ForumPostComment[];
  images?: string[];
  stars: number;
};

export type ForumPostComment = {
  uid: string;
  forumPostRefId: number;
  user: CurrentAccount;
  comment: string;
  isAgreed: boolean;
  createdDate: Timestamp;
};

export const useForumState = defineStore("forumState", {
  state: () => ({
    forumPostState: <ForumPost[]>[],
    isFirstInitials: true,
  }),
  getters: {
    getForumPostState: (state) => state.forumPostState,
  },
  actions: {
    genId(): number {
      const maxID = this.forumPostState.reduce((acc, obj) => {
        return obj.forumPostId > acc ? obj.forumPostId : acc;
      }, 0);
      return maxID + 1;
    },

    async fetchForumPostFromFirebase() {
      let fetchedPosts: ForumPost[] = [];
      await useCollection<ForumPost[]>(collection(db, "ForumPosts"), {
        wait: true,
      })
        .promise.value.then((postStates) => {
          fetchedPosts = <ForumPost[]>postStates.map(
            (post: ForumPost | any) => {
              return { ...post, uId: post.id };
            }
          );
          this.forumPostState = fetchedPosts;
          console.log(this.forumPostState);
        })
        .catch((err) => {
          throw new Error(err);
        });
      return fetchedPosts;
    },

    firstInitialsPostState() {
      if (this.isFirstInitials) {
        this.fetchForumPostFromFirebase().then((fetchPosts) => {
          if (fetchPosts) {
            this.isFirstInitials = false;
          } else {
            console.log("can't get fetched posts on first initial state");
          }
        });
      }
    },

    async onAddForumPost(post: ForumPost) {
      return addDoc(collection(db, "ForumPosts"), post)
        .then((doc) => {
          console.log(`Forum Action added successfully on Id: ` + doc.id);
          this.forumPostState.push({ ...post, uId: doc.id });
          return true;
        })
        .catch((err) => {
          throw new Error("Error when saving user state", err);
        });
    },

    async onEditForumPostAction(uid: string, newPost: ForumPost) {
      const fIndex = this.forumPostState.findIndex((f) => f.uId === uid);
      if (fIndex === -1) {
        console.error("pet index not found");
        return false;
      }

      return setDoc(doc(db, "ForumPosts", uid), newPost)
        .then(() => {
          this.forumPostState[fIndex] = { ...newPost, uId: uid };
          console.log(`Edit state on docs Id ${uid}, index: ${fIndex}`);
          return true;
        })
        .catch((err) => {
          throw new Error(err);
        });
    },

    async onDeleteForumPosteAction(uId: string) {
      return deleteDoc(doc(db, "ForumPosts", uId))
        .then(() => {
          const petIndex = this.forumPostState.findIndex((f) => f.uId === uId);
          if (petIndex === -1) {
            console.error("pet index not found");
            return false;
          }
          this.forumPostState.splice(petIndex, 1);
          console.log("delete Item on ID: " + uId);
          return true;
        })
        .catch((err) => {
          throw new Error(err);
        });
    },

    async onPushCommentForum(uid: string, comment: ForumPostComment) {
      if (!uid) {
        console.error("uid is emtyp");
        return false;
      }

      const fIndex = this.forumPostState.findIndex((f) => f.uId === uid);
      if (fIndex === -1) {
        console.error("forum index not found");
        return false;
      }

      this.forumPostState[fIndex].comments.push(comment);
      return setDoc(
        doc(db, "ForumPosts", uid),
        this.forumPostState[fIndex]
      ).then(() => {
        console.log("You had sent pet required to employee now ");
        return true;
      });
    },
  },
});

const forumStore = useForumState();
