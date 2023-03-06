<template>
  <!--- animation icon script  -->
  <Script
    async
    src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
  ></Script>
  <div
    class="h-[60vh] -mt-10 justify-center items-center mx-auto w-full flex flex-col gap-4"
  >
    <lottie-player
      src="https://assets1.lottiefiles.com/packages/lf20_oguf0mw4.json"
      background="transparent"
      speed="1"
      style="width: 300px; height: 300px"
      loop
      autoplay
    ></lottie-player>
    <hr class="w-2/4" />
    <h1 class="uppercase tracking-wider text-xl text-accent">
      โพสต์ฟอรัมว่างอยู่ในขณะนี้
    </h1>
    <p class="text-sm text-accent-focus">
      ลองเขียนโพสต์ซักหน่อยซิเพื่อดูผลลัพธืที่เกิดขึ้น
    </p>
  </div>
</template>
