<script lang="ts">
import { DistrictCollection, useHotelState } from "../feature-store/hotelState";
import Swal from "sweetalert2";

export default {
  setup() {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    return {
      districtState: useHotelState().getDistrictState,
      hotelState: useHotelState().getHotelState,
      Toast,
    };
  },
  data: () => ({
    searchFilter: {
      district: <DistrictCollection>{},
      guests: {
        adults: 0,
        children: 0,
      },
    },
    loading: false,
    expand: false,
  }),

  methods: {
    onSearch() {
      this.loading = true;
      new Promise((r) => setTimeout(r, 1000)).then(() => {
        if (!this.searchFilter.district.district) {
          this.Toast.fire({
            icon: "error",
            title: "ได้โปรดกรอกอำเภอที่ต้องการไปของคุณ",
          });
          this.loading = false;
          return;
        } else {
          const districtSelected = this.districtState.find(
            (d) => d.district === this.searchFilter.district.district
          );

          if (districtSelected) {
            this.searchFilter = {
              ...this.searchFilter,
              district: { ...districtSelected! },
            };

            const hotelSearchFilter = this.hotelState.filter((h) => {
              if (
                h.address.district === this.searchFilter.district.district &&
                this.searchFilter.guests.adults <= h.guests.adults &&
                this.searchFilter.guests.children <= h.guests.children
              )
                return h;
            });

            if (hotelSearchFilter.length > 0) {
              console.log(hotelSearchFilter);
              const { nearestHotels, distances } =
                useHotelState().getNearestHotel(
                  {
                    lat: districtSelected.lat,
                    lng: districtSelected.lng,
                  },
                  40,
                  100,
                  hotelSearchFilter
                );
              useHotelState().setSearchMode(true);
              useHotelState().setLastSearchedHotelState(
                nearestHotels,
                distances
              );
              setTimeout(() => this.$router.push("/hotel-list"), 1000);
            } else {
              this.Toast.fire({
                icon: "warning",
                title: "ขออภัย เราไม่ค้นพบห้องพักตามเงื่อนไขของคุณโปรดลองใหม่",
              });
              this.loading = false;
              return;
            }
          }
        }
      });
    },
  },
};
</script>
<template>
  <div class="rounded-none">
    <v-btn
      translate="scroll-x-reverse-transition"
      variant="flat"
      rounded="0"
      class="fixed z-10 right-4 mt-4"
      color="primary"
      append-icon="mdi-magnify"
      @click="() => (expand = !expand)"
      >ค้นหาที่พัก</v-btn
    >
    <v-expand-transition
      translate="scroll-x-reverse-transition"
      v-show="expand"
      mode="out-in"
    >
      <form>
        <v-card-text
          :class="{
            '!opacity-100': expand,
            '!opacity-0': !expand,
          }"
          class="!w-full z-10 fixed mt-10 lg:!w-6/12 flex right-0"
        >
          <v-select
            class="bg-secondary !text-white"
            :loading="loading"
            density="comfortable"
            variant="filled"
            v-model="searchFilter.district.district"
            label="ที่พักหรืออำเภอ"
            :items="districtState.map((d) => d.district)"
            prepend-inner-icon="mdi-bed"
            hide-details
          ></v-select>
          <v-dialog transition="dialog-top-transition" width="auto">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                :value="`ผู้ใหญ่ ${searchFilter.guests.adults} เด็ก ${searchFilter.guests.children} `"
                class="!bg-primary !text-primary-content !cursor-pointer"
                readonly
                :loading="loading"
                density="comfortable"
                variant="filled"
                label="เลือกจำนวนผู้พัก"
                prepend-inner-icon="mdi-account-group"
                hide-details
              >
                <template v-slot:append-inner>
                  <div>
                    <v-tooltip location="bottom" text="ค้นหาห้อง">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          @click="() => onSearch()"
                          v-bind="props"
                          icon="mdi-home-search"
                          class="!cursor-pointer"
                        ></v-icon>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-text-field>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar
                  class="!bg-primary text-white"
                  title="โปรดเลือกจำนวนผู้พัก"
                ></v-toolbar>
                <v-card-text>
                  <div class="grid grid-cols-2">
                    <div class="place-self-center font-semibold">ผู้ใหญ่</div>
                    <div class="place-self-center">
                      <div class="place-self-center">
                        <FormKit
                          v-model="searchFilter.guests.adults"
                          type="number"
                        ></FormKit>
                      </div>
                    </div>
                    <div class="place-self-center font-semibold">เด็ก</div>
                    <div class="place-self-center">
                      <FormKit
                        v-model="searchFilter.guests.children"
                        type="number"
                      ></FormKit>
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    variant="text"
                    class="text-primary-focus"
                    color="text-success"
                    @click="isActive.value = false"
                    >บันทึก</v-btn
                  >
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-card-text>
      </form>
    </v-expand-transition>
  </div>
</template>
<style lang=""></style>
