<script lang="ts">
export default {
  props: {
    delay: Number,
  },
  mounted() {
    this.fakeLoader().then((res) => {
      this.$emit("loadedAsync", res);
    });
  },
  methods: {
    async fakeLoader() {
      const res = new Promise((r) => setTimeout(r, this.delay || 500)).then(
        () => {
          return false;
        }
      );
      return res;
    },
  },
};
</script>

<template>
  <div class="w-full">
    <div class="grid h-[70vh]">
      <v-img
        class="place-self-center animate-spin"
        width="82"
        src="https://v.fastcdn.co/u/430e104e/57579327-0-Loaders-3.svg"
      ></v-img>
    </div>
  </div>
</template>
