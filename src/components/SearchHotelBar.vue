<script lang="ts">
export default {
  data: () => ({
    loaded: false,
    loading: false,
    expand: false,
  }),

  methods: {
    onClick() {
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.loaded = true;
      }, 2000);
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
          <v-text-field
            class="bg-secondary"
            color="primary"
            :loading="loading"
            density="comfortable"
            variant="filled"
            label="ที่พักหรืออำเภอ"
            prepend-inner-icon="mdi-bed"
            hide-details
          ></v-text-field>
          <v-dialog transition="dialog-top-transition" width="auto">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                class="!bg-primary !text-primary-content !cursor-pointer"
                readonly
                :loading="loading"
                density="comfortable"
                variant="filled"
                label="เลือกจำนวนผู้พัก"
                prepend-inner-icon="mdi-account-group"
                hide-details
                @click:append-inner="onClick"
              >
                <template v-slot:append-inner>
                  <div>
                    <v-tooltip location="bottom"  text="ค้นหาห้อง">
                      <template v-slot:activator="{ props }">
                        <v-icon
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
                        <FormKit type="number"></FormKit>
                      </div>
                    </div>
                    <div class="place-self-center font-semibold">เด็ก</div>
                    <div class="place-self-center">
                      <FormKit type="number"></FormKit>
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
