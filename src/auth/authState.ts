// @ts-nocheck

import { defineStore } from "pinia";
import {
  Timestamp,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
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
import router from "../routes/app-rotues";
import { Hotel } from "../feature-store/hotelState";

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

export type CurrentAccount = UserCollection;

export type RentalHotelHistory = {
  rentalId: number;
  rentalDate: Timestamp;
  hotel: Hotel;
};

export type UserCollection = {
  uId: string;
  email: string;
  geolocation: {
    lat: number;
    lng: number;
  };
  rentalHistory: RentalHotelHistory[];
};

export const useAuthState = defineStore("authState", {
  state: () => {
    return {
      currAccount: <CurrentAccount>{},
    };
  },
  getters: {
    getCurrAcc: (state) => state.currAccount,
  },
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
      return createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const useruid = userCredential.user.uid;
          return await this.getGeoRequest().then(async (geo) => {
            const createAcc: CurrentAccount = {
              uId: useruid,
              email,
              geolocation: { lat: geo.lat, lng: geo.lng },
              rentalHistory: [],
            };
            return await addDoc(collection(db, "Users"), createAcc)
              .then((doc) => {
                console.log(
                  `Added successfully on User UID: ${useruid}, docId: ${doc.id}`
                );
                this.currAccount = createAcc;
                console.log(this.currAccount);
                router.push("/app-overview");
                return true;
              })
              .catch((err) => {
                console.error(err);
                return false;
              });
          });
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
    },

    async onSignIn(email: string, password: string) {
      return signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          if (!userCredential) {
            console.error("user credentials not found");
            return false;
          }
          const userUid = userCredential.user.uid;
          const res = await useCollection<UserCollection>(
            collection(db, "Users"),
            {
              wait: true,
            }
          ).promise.value.then((userDocs) => {
            let userData = userDocs.find((u) => u.uId === userUid);
            if (userData) {
              this.currAccount = userData;
              console.log(this.currAccount);
              router.push("/app-overview");
              return true;
            } else return false;
          });
          return res;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
    },

    async autoAuth(): Promise<boolean> {
      const user = await getCurrentUser();
      console.log(user);
      if (!user) {
        console.log("Auth failed");
        return false;
      }
      return await useCollection<UserCollection>(collection(db, "Users"), {
        wait: true,
      })
        .promise.value.then((userDocs) => {
          console.log("asdsad");
          let userData = userDocs.find((u) => u.uId === user.uid);
          console.log(userData);
          if (userData) {
            this.currAccount = userData;
            console.log(this.currAccount);
            return true;
          } else return false;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
    },

    async onSignOut() {
      return signOut(auth)
        .then(() => {
          this.currAccount = null;
          console.log(this.currAccount);
          return true;
        })
        .catch((error) => {
          throw new Error(error);
        });
    },

    genRentalHotelHistoryID() {
      const maxID = this.currAccount.rentalHistory.reduce((acc, obj) => {
        return obj.rentalId > acc ? obj.rentalId : acc;
      }, 0);
      return maxID + 1;
    },

    async onRentHotel(hotelRented: Hotel) {
      console.log(this.currAccount);
      let validRented: RentalHotelHistory = {
        rentalId: this.genRentalHotelHistoryID(),
        rentalDate: Timestamp.now(),
        hotel: hotelRented,
      };
      this.currAccount!.rentalHistory.push(validRented);
      return setDoc(doc(db, "Users", this.currAccount.uId), this.currAccount)
        .then(() => {
          console.log(
            `update rental history state on docs Id ${this.currAccount.uId}`
          );
          return true;
        })
        .catch((err) => {
          throw new Error(err);
        });
    },

    setCurrentGeoLocation() {
      var map = new longdo.Map();
      let { lon, lat } = map.location();
      this.getCurrAcc!.geolocation = { lat, lng: lon };
    },
  },
});
