<template>
  <v-app>
    <v-main v-if="printed!=null">
      <print></print>
    </v-main>
    <v-main v-else>
      <app v-if="token!=null"></app>
      <login v-else></login>
    </v-main>
  </v-app>
</template>
<script>
import axios from"axios"
import App from "../src/views/App"
import Login from "../src/views/Login"
import Print from "../src/components/quotations/viewPdf"
export default {
  name: 'App',
  data: () => ({
    token:localStorage.getItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg"),
    printed: localStorage.getItem("print") 
  }),
  mounted(){
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current").catch(error => {
      localStorage.removeItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg");
      this.token = null
    });
  },
  components:{ 
    'app':App, 
    'login':Login,
    'print':Print
  },
};
</script>
