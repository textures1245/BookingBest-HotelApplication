<script lang="ts">
type Discount = {
  id: number;
  discount: number;
  outdated: Date;
  colorTheme: string;
};

export default {
  data: () => ({
    voucherCodes: <Discount[]>[],
    model: null,
    rating: 3.5,
  }),
  mounted() {
    this.genVoucherCode(5);
  },
  methods: {
    randomDate(start: Date, end: Date) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    },
    genVoucherCode(amount: number) {
      let colorTheme = [
        "!bg-primary",
        "!bg-secondary",
        "!bg-accent",
        "!bg-success",
        "!bg-info",
      ];
      let vouchers: Discount[] = [];
      for (let i = 0; i < amount; i++) {
        let randNum = Math.floor(Math.random() * 5) + 1;
        vouchers.push(<Discount>{
          id: i,
          discount: randNum * 10,
          colorTheme: colorTheme[randNum],
          outdated: this.randomDate(new Date(), new Date(2023, 2, 4)),
        });
      }
      this.voucherCodes = vouchers;
    },
  },
};
</script>
<template>
  <v-sheet class="mx-auto py-6 bg-base-100" elevation="0">
    <article
      class="prose prose-blockquote:text-2xl prose-blockquote:text-primary-focus"
    >
      <blockquote class="w-8/12 lg:w-10/12 mx-auto">ส่วนลดโปรโมชั่น</blockquote>
    </article>
    <v-slide-group v-model="model" class="pa-4" start-active show-arrows>
      <v-slide-group-item
        v-for="vc in voucherCodes"
        v-slot="{ isSelected, toggle }"
      >
        <div class="grid grid-rows-2 gap-4">
          <div @click="toggle" class="cursor-pointer flex mx-2 h-full">
            <div class="bg-white p-6 rounded-2xl border-2">
              <div class="flex flex-col">
                <div>
                  <h2 class="font-bold text-gray-600 text-center">ส่วนลด</h2>
                </div>
                <div class="my-6">
                  <div class="flex flex-row space-x-4 items-center">
                    <div id="icon">
                      <v-btn
                        :class="vc.colorTheme"
                        icon="mdi-ticket-percent"
                        size="x-large"
                      ></v-btn>
                    </div>
                    <div id="temp">
                      <h4 class="text-4xl">{{ vc.discount }} %</h4>
                      <p class="text-xs text-gray-500">
                        ส่วนลดสูงสุด {{ vc.discount }} %C
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="w-full place-items-end text-right border-t-2 border-gray-100 mt-2"
                >
                  <a href="#" class="text-indigo-600 text-xs font-medium"
                    >วันหมดอายุ {{ vc.outdated.toDateString() }}</a
                  >
                  <div class="flex justify-end mt-1">
                    <v-chip
                      class="!bg-primary !text-primary-content !cursor-pointer"
                      size="small"
                      text="Redeem"
                    ></v-chip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div @click="toggle" class="cursor-pointer flex mx-2 h-full">
            <div class="bg-white p-6 rounded-2xl border-2">
              <div class="flex flex-col">
                <div>
                  <h2 class="font-bold text-gray-600 text-center">ส่วนลด</h2>
                </div>
                <div class="my-6">
                  <div class="flex flex-row space-x-4 items-center">
                    <div id="icon">
                      <v-btn
                        :class="vc.colorTheme"
                        icon="mdi-ticket-percent"
                        size="x-large"
                      ></v-btn>
                    </div>
                    <div id="temp">
                      <h4 class="text-4xl">{{ vc.discount }} %</h4>
                      <p class="text-xs text-gray-500">
                        ส่วนลดสูงสุด {{ vc.discount }} %C
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="w-full place-items-end text-right border-t-2 border-gray-100 mt-2"
                >
                  <a href="#" class="text-indigo-600 text-xs font-medium"
                    >วันหมดอายุ {{ vc.outdated.toDateString() }}</a
                  >
                  <div class="flex justify-end mt-1">
                    <v-chip
                      class="!bg-primary !text-primary-content !cursor-pointer"
                      size="small"
                      text="Redeem"
                    ></v-chip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>
<style lang=""></style>
