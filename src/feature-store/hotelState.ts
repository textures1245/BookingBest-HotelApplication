import { defineStore } from "pinia";
import districtJSON from "../assets/json/district.json";
import hotelJSON from "../assets/json/้hotels2.json";
import { Review, User } from "./userState";

// Modes
export type Address = {
  district: string;
  subDistrict: string;
  houseNumber: string | number;
  postalCode: string | number;
  moo: string | number;
  geo: Geolocation;
};

export type DistrictCollection = {
  id: number;
  district: string;
  lat: number;
  lng: number;
};

type Rating = {
  stars: number;
  reviews: Review[];
};

export type Geolocation = {
  lat: number;
  lng: number;
};

export type RoomFeature = {
  size: string;
  bedType: "เตียงเดี่ยว" | "เตียงคู่" | "เตียงสองชั้น";
  generalItems: string[];
  bathroomItems: string[]; //* details
  bedroomItems: string[]; //* details
  techItems: string[];
  internetItems: string[];
  viewItems: string[];
  kitchenItems: string[];
  securityItems: string[];
};

export type Partner = {
  isPartner: boolean;
  voucherCode: string;
  discount: number;
};

export type ServiceFeatures = {
  restaurantServiceTimes: "breakfast" | "lunch" | "dinner" | "none";
  hasOwnParking: boolean;
  petsAllowed: boolean;
};

export type Hotel = {
  hotelId: number;
  name: string;
  description: string;
  imgUrls: string[];
  address: Address;
  checkIn: string;
  checkOut: string;
  price: number;
  guests: {
    adults: number;
    children: number;
  };
  roomFeature: RoomFeature;
  services: ServiceFeatures;
  petsAllowed: boolean;
  placeNameNearByArr: string[];
  contact: {
    email: string;
    tel: string;
  };
  partner: Partner;
  rating: Rating;
};

export type HotelSearcher = {
  formRefDistract: number;
} & Hotel;

function randImage(amount: number) {
  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8&w=1000&q=80",
    "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWxzfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    "https://media.timeout.com/images/105938335/image.jpg",
    "https://www.welcome-hotels.com/site/assets/files/35059/welcome_hotel_marburg_lobby_2k.2560x1600.jpg",
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/a1/9c/80/essentia-luxury-hotel.jpg?w=700&h=-1&s=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/386516730.jpg?k=010021c4b79cf89b87e870b394f725293dc1b4d422a19c1da36869aebcc63904&o=&hp=1",
    "https://pix8.agoda.net/hotelImages/427/42779/42779_16101107150047602105.jpg?ca=6&ce=1&s=1024x768",
    "https://pix8.agoda.net/hotelImages/42779/-1/a984b94d692b7f6ff9779d265bd78fd5.jpg?ca=9&ce=1&s=1024x768",
    "https://pix8.agoda.net/hotelImages/42779/-1/48e85c964cb1cd340612a017884dfada.jpg?ca=11&ce=1&s=1024x768",
    "https://pix8.agoda.net/hotelImages/569305/-1/5e4978b5de52112359b389619a522045.jpg?ca=0&ce=1&s=1024x768",
    "https://pix8.agoda.net/hotelImages/569/569305/569305_14030514070018560169.jpg?ca=13&ce=1&s=1024x768",
    "https://pix8.agoda.net/hotelImages/569305/-1/ea874eb17a172354b021d69c9b79bb93.jpg?ca=0&ce=1&s=1024x768",
  ];
  let imgArr = [];
  for (let i = 0; i <= amount; i++) {
    imgArr.push(images[Math.floor(Math.random() * images.length)]);
  }
  return imgArr;
}

export const useHotelState = defineStore("hotelState", {
  state() {
    return {
      searchMode: false,
      cityGeo: { lat: 18.86573608, lng: 99.03157315 },
      lastSearchHotelState: <HotelSearcher[]>[],
      districts: <DistrictCollection[]>[...districtJSON],
      hotels: <Hotel[]>[],
    };
  },
  getters: {
    getHotelState: (state) => state.hotels,
    getDistrictState: (state) => state.districts,
  },
  actions: {
    setHotelState() {
      //- it should be called once when app is initialized
      const initialHotelState = <Hotel[]>hotelJSON.map((hotelJson: any) => {
        return {
          hotelId: hotelJson.hotelId,
          name: hotelJson.name,
          description: hotelJson.description,
          address: {
            district: hotelJson.district,
            subDistrict: hotelJson.subDistrict,
            houseNumber: hotelJson.houseNumber,
            postalCode: hotelJson.postalCode,
            moo: hotelJson.moo,
            geo: {
              lat: hotelJson.lat,
              lng: hotelJson.lng,
            },
          },
          checkIn: hotelJson.checkIn,
          checkOut: hotelJson.checkOut,
          price: Number(hotelJson.price.replace(",", "")),
          guests: {
            adults: hotelJson.adults,
            children: hotelJson.children,
          },
          roomFeature: {
            size: hotelJson.size,
            bedType: hotelJson.bedType as RoomFeature["bedType"],
            generalItems: hotelJson.generalItems.split(" "),
            bathroomItems: hotelJson.bathroomItems.split(" "),
            bedroomItems: hotelJson.bedroomItems.split(" "),
            techItems: hotelJson.techItems.split(" "),
            internetItems: hotelJson.internetItems.split(" "),
            viewItems: hotelJson.viewItems.split(" "),
            kitchenItems: hotelJson.kitchenItems.split(" "),
            securityItems: hotelJson.securityItems.split(" "),
          },
          petsAllowed: hotelJson.petsAllowed,
          placeNameNearByArr: hotelJson.placeNameNearBy.split(" "),
          contact: {
            email: hotelJson.emailContract,
            tel: hotelJson.telContract,
          },
          partner: {
            isPartner: !!Math.floor(Math.random() * 2),
            voucherCode: Math.random().toString(20).substring(2, 8),
            discount: (Math.floor(Math.random() * 5) + 1) * 10,
          },
          services: {
            hasOwnParking: hotelJson.hasOwnParking,
            restaurantServiceTimes: hotelJson.restaurantServiceTimes,
            petsAllowed: hotelJson.petsAllowed,
          },
          rating: {
            stars: Math.floor(Math.random() * 5) + 1,
            reviews: [] as Review[],
          },
          imgUrls: randImage(5),
        };
      });
      this.hotels = initialHotelState;
      console.log("initial state!");
    },
    setSearchMode(isSearch: boolean) {
      this.searchMode = isSearch;
    },
    setLastSearchedHotelState(hotel: Hotel[], distances: number[]) {
      this.lastSearchHotelState = <HotelSearcher[]>hotel.map((h, index) => {
        return {
          ...h,
          formRefDistract: distances[index],
        };
      });
    },
    resetLastSearchedHotelState() {
      this.lastSearchHotelState = <HotelSearcher[]>[];
    },

    getNearestHotel(
      mainGeo: { lat: number; lng: number },
      limit: number,
      kiloRange: number,
      fromHotelSamples?: Hotel[]
    ) {
      const nearestHotels = [];
      const distances = [];
      let hotelsToCheck: Hotel[] = [];

      //- check from the hotel sample we provided, otherwise check all
      if (fromHotelSamples !== undefined) {
        hotelsToCheck = fromHotelSamples;
      } else {
        hotelsToCheck = this.hotels;
      }

      for (
        let i = 0;
        i < hotelsToCheck.length && nearestHotels.length < limit;
        i++
      ) {
        const h = hotelsToCheck[i];
        let theta = mainGeo.lng - h.address.geo.lng;
        let distance =
          60 *
          1.1515 *
          (180 / Math.PI) *
          Math.acos(
            Math.sin(mainGeo.lat * (Math.PI / 180)) *
              Math.sin(h.address.geo.lat * (Math.PI / 180)) +
              Math.cos(mainGeo.lat * (Math.PI / 180)) *
                Math.cos(h.address.geo.lat * (Math.PI / 180)) *
                Math.cos(theta * (Math.PI / 180))
          );
        let kilometers = Math.round(distance * 1.609344);
        if (kilometers < kiloRange) {
          nearestHotels.push(h);
          distances.push(kilometers);
        }
      }
      const [minDistance, maxDistance] = distances.reduce(
        ([min, max], distance) => [
          Math.min(min, distance),
          Math.max(max, distance),
        ],
        [Infinity, -Infinity]
      );
      return { nearestHotels, distances, minDistance, maxDistance };
    },
  },
});
