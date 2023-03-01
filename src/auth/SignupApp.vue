<script lang="ts">
import { useAuthState, Account } from "./authState";
import Swal from "sweetalert2";

export default {
  data: () => ({
    accountData: {
      email: "",
      password: "",
    },
  }),

  mounted() {
    this.accountData = {
      email: "",
      password: "",
    };
  },

  methods: {
    async submitHandler() {
      const onLoaded = new Promise((r) => setTimeout(r, 1000));
      onLoaded.then(() => {
        useAuthState()
          .onSignUp(this.accountData.email, this.accountData.password)
          .then((isAuthValid) => {
            if (isAuthValid) {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast: any) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });

              Toast.fire({
                icon: "success",
                title: "ล็อกอินเสร็จสิ้น",
              });
              this.accountData = {
                email: "",
                password: "",
              };
            } else {
              Swal.fire({
                icon: "error",
                title: "การเข้าสูระบบผิดผลาด",
                text: `เราไม่ตรวจพบบัญชีที่คุณกรอกไว้ ได้โปรดลองกรอกดูอีกครั้ง`,
              });
            }
          })
          .catch(async (err) => {
            console.error(err);
          });
      });
    },
  },
};
</script>
<template>
  <v-container>
    <div class="mx-auto grid grid-cols-2 place-items-center h-screen">
      <div class="">
        <v-avatar size="500">
          <v-img
            cover
            width="500"
            src="https://img.freepik.com/free-photo/copy-space-airplane-with-arow-direction_23-2148436338.jpg?w=1380&t=st=1677701332~exp=1677701932~hmac=9a4d4eb09526a565e27e7a318648fac0faead895ee3f565276bd748cba41e645"
            alt=""
          />
        </v-avatar>
      </div>
      <div class="">
        <v-card class="mx-auto thai-font" max-width="600" width="500">
          <v-card-title
            class="text-h6 font-weight-regular justify-space-between"
          >
            <span class="mr-2">เข้าสู่ระบบ</span>
            <v-avatar class="!bg-primary text-white" size="32">
              <v-icon icon="mdi-account" size="26"></v-icon>
            </v-avatar>
          </v-card-title>

          <FormKit
            messages-class="text-center mb-3"
            type="form"
            id="registration-example"
            submit-label="Register"
            @submit="submitHandler"
            :actions="false"
            #default="{ value }"
          >
            <v-window>
              <v-window-item>
                <v-card-text>
                  <FormKit
                    v-model="accountData.email"
                    label="Email"
                    type="email"
                    input-class="w-full"
                    validation="required|email"
                    value=""
                  />
                  <FormKit
                    v-model="accountData.password"
                    label="Password"
                    type="password"
                    input-class="w-full"
                    validation="required|length:6"
                    value=""
                  />
                  <span class="text-caption text-grey-darken-1">
                    ยังไม่มีบัชชีใช่ไหม?
                    <v-btn
                      size="small"
                      class="!btn-secondary"
                      @click="() => $router.push('/sign-up')"
                      >สมัครสมาชิก</v-btn
                    >
                  </span>
                </v-card-text>
              </v-window-item>
            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <div class="mt-5">
                <FormKit
                  input-class="!btn-accent"
                  message-class="text-center"
                  type="submit"
                  label="เข้าสู่ระบบ"
                />
              </div>
            </v-card-actions>
          </FormKit>
        </v-card>
      </div>
    </div>
  </v-container>
</template>
<style scoped></style>
