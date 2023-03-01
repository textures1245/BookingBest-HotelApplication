import { defineStore } from "pinia";
import { getDocs, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase.config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { getCurrentUser, useCollection, useCurrentUser } from "vuefire";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export type Account = {
  email: string;
  password: string;
  geolocation: {
    lat: number;
    lng: number;
  };
};

type CurrentAccount = UserCollection;

type UserCollection = {
  uId: string;
  email: string;
  geolocation: {
    lat: number;
    lng: number;
  };
};

export const useAuthState = defineStore("authState", {
  state: () => {
    return {
      currAccount: <CurrentAccount>{},
    };
  },
  getters: {},
  actions: {
    getGeoRequest(): Promise<{ lat: number; lng: number }> {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // save the latitude and longitude data to the Firebase database
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error("User denied the request for geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                console.error("The request to get user location timed out.");
                break;
              default:
                console.error("An unknown error occurred.");
                break;
            }
          }
        );
      });
    },
    async onSignUp(email: string, password: string): Promise<boolean> {
      return createUserWithEmailAndPassword(auth, email, password).then(
        async (userCredential) => {
          const useruid = userCredential.user.uid;
          return await this.getGeoRequest().then((geo) => {
            const createAcc: UserCollection = {
              uId: useruid,
              email,
              geolocation: { lat: geo.lat, lng: geo.lng },
            };
            return addDoc(collection(db, "Users"), createAcc)
              .then((doc) => {
                console.log(
                  `Added successfully on User UID: ${useruid}, docId: ${doc.id}`
                );
                return true;
              })
              .catch((err) => {
                throw new Error("Error when saving user state", err);
              });
          });
        }
      );
    },

    async autoAuth(): Promise<boolean> {
      const user = await getCurrentUser();
      if (!user) {
        console.log("Auth failed");
        return false;
      }
      const res = await useCollection<UserCollection>(collection(db, "User"), {
        wait: true,
      }).promise.value.then((userDocs) => {
        let userData = userDocs.find((u) => u.uId === user.uid);
        if (userData) {
          this.$state.currAccount = userData;
          console.log(userData);
          return true;
        } else return false;
      });
      return res;
    },
  },
});
