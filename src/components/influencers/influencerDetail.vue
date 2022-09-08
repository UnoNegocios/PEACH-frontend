<template>
      <v-card>{{apiCall}}
        <!-- header -->
        <v-app-bar v-if="influencer!=null && show" class="elevation-0" dark color="#c57de4">
          <v-spacer></v-spacer>
          <!-- botones contacto pc -->
          <div class="hidden-md-and-down">
            <v-btn v-bind:href="'tel:'+influencerDetail.phone" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-phone-outline</v-icon>
                </template>
                <span>Llamar al {{influencerDetail.phone}}</span>
              </v-tooltip>
            </v-btn>
            <v-btn @click="whatsapp()" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-whatsapp</v-icon>
                </template>
                <span>WhatsApp {{influencerDetail.phone}}</span>
              </v-tooltip>
            </v-btn>
            <v-btn v-bind:href="'mailto:'+influencerDetail.email" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-email-outline</v-icon>
                </template>
                <span>{{influencerDetail.email}}</span>
              </v-tooltip>
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="back()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <!-- container -->
        <v-sheet id="scrolling-techniques-6" class="overflow-y-auto" max-height="calc(100vh - 128px)" min-height="calc(100vh - 64px)" style="max-width: 100vw; margin:auto; background:#f4f5fa;">
          <v-row style="max-width: 100vw; margin:auto;">
            <!-- sidebar -->
            <v-col class="px-4 py-7" cols="12" md="3">
                <v-card outlined>
                  <v-card-title>
                      <v-avatar size="80" class="mb-2 mr-5">
                          <img src="/default.jpeg">
                      </v-avatar>
                      {{influencerDetail.name}}
                  </v-card-title>
                  <v-card-text>
                      <v-icon color="primary" small class="mr-2">mdi-phone</v-icon><span>{{influencerDetail.phone}}</span>
                      <br/>
                      <v-icon color="primary" small class="mr-2">mdi-email</v-icon><span>{{influencerDetail.email}}</span>
                      <div class="pt-4">
                        <!--div v-show="influencerDetail.social_networks.facebook!='' && influencerDetail.social_networks.facebook!=undefined && influencerDetail.social_networks.facebook!=null" class="boxIcon" style="background:#1877F2; cursor:pointer;" @click="liga('https://facebook.com/', influencerDetail.social_networks.facebook)">
                          <img src="/facebook.svg" class="icons">
                        </div-->
                        <div v-show="influencerDetail.social_networks.instagram!='' && influencerDetail.social_networks.instagram!=undefined && influencerDetail.social_networks.instagram!=null" class="boxIcon" style="background:#E4405F; cursor:pointer;" @click="liga('https://instagram.com/', influencerDetail.social_networks.instagram)">
                          <img src="/instagram.svg" class="icons">
                        </div>
                        <!--div v-show="influencerDetail.social_networks.twitter!='' && influencerDetail.social_networks.twitter!=undefined && influencerDetail.social_networks.twitter!=null" class="boxIcon" style="background:#1DA1F2; cursor:pointer;" @click="liga('https://twitter.com/', influencerDetail.social_networks.twitter)">
                          <img src="/twitter.svg" class="icons">
                        </div-->
                        <div v-show="influencerDetail.social_networks.tiktok!='' && influencerDetail.social_networks.tiktok!=undefined && influencerDetail.social_networks.tiktok!=null" class="boxIcon" style="background:black; cursor:pointer;" @click="liga('https://tiktok.com/@', influencerDetail.social_networks.tiktok)">
                          <img src="/tiktok.svg" class="icons">
                        </div>
                      </div>
                  </v-card-text>
                </v-card>

                <v-card outlined class="mt-6">
                  <v-card-title>
                      Datos Bancarios
                  </v-card-title>
                  <v-card-text>
                      <strong>Banco: </strong>{{influencerDetail.bank_account_details.bank}}
                      <br>
                      <strong>Cuenta: </strong>{{influencerDetail.bank_account_details.account}}
                      <br>
                      <strong>Clabe: </strong>{{influencerDetail.bank_account_details.clabe}}
                      <br>
                      <strong>Tarjeta: </strong>{{influencerDetail.bank_account_details.card}}
                  </v-card-text>
                </v-card>

                <!--v-card outlined class="mt-6 pb-6">
                  <v-card-title>
                      Servicios
                  </v-card-title>
                  <v-card-text class="pb-0" v-for="(service, index) in influencerDetail.services" v-bind:key="index">
                    - {{service.service}} | {{(service.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                  </v-card-text>
                </v-card-->

            </v-col>
            <!-- detail -->
            <v-col style="background:#f4f5fa;" class="py-6 px-4 mt-2" cols="12" md="9">
                <v-tabs grow class="paddingtab">
                  <v-tab background-color="transparent" color="basil" grow>
                    Ventas
                  </v-tab>
                  <v-tab-item>
                    <sales v-bind:influencer="influencer"/>
                  </v-tab-item>
                  <v-tab v-show="permissions('influencerPayments')" background-color="transparent" color="basil" grow>
                    Pagos
                  </v-tab>
                  <v-tab-item v-show="permissions('influencerPayments')">
                    <payments v-bind:influencer="influencer"/>
                  </v-tab-item>
                </v-tabs>
            </v-col>
          </v-row>
        </v-sheet>
        <!-- botones contacto movil -->
        <v-bottom-navigation style="background:#2b2b2b;" class="hidden-md-and-up" fixed bottom>
          <v-btn v-bind:href="'tel:'+influencerDetail.phone" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-phone-outline</v-icon>
              </template>
              <span>Llamar al {{influencerDetail.phone}}</span>
            </v-tooltip>
          </v-btn>
          <v-btn @click="whatsapp()" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-whatsapp</v-icon>
              </template>
              <span>WhatsApp {{influencerDetail.phone}}</span>
            </v-tooltip>
          </v-btn>
          <v-btn v-bind:href="'mailto:'+influencerDetail.email" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-email-outline</v-icon>
              </template>
              <span>{{influencerDetail.email}}</span>
            </v-tooltip>
          </v-btn>
        </v-bottom-navigation>
      </v-card>
</template>
<script>
import axios from "axios";
import Payments from "../influencers_payments/table"
import Sales from "../sales/table"
  export default {
    components: {
      'payments':Payments,
      'sales':Sales,
    }, 
    data () {
      return {
        influencer: this.$route.params.influencer_id,
        influencerDetail:null,
        show:false
      }
    },
    created(){
      this.$emit("closeDrawer", false);
    },
    computed:{
      currentUser:{
        get(){
          return this.$store.state.currentUser.user
        }
      },
      apiCall(){
        this.show = false
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencers?filter[id]=" + this.influencer)
        .then(response=>{
            this.influencerDetail = response.data.data[0]
            this.show = true
        })
      }
    },
    methods: {
      permissions(permission){
            if(this.currentUser.id==1){
                return true
            }else if(this.currentUser.permissions!=undefined){
                if(this.currentUser.permissions.includes(permission)){
                    return true
                }else{
                    return false
                }
            }else {
                return false
            }
        },
      liga(red, cuenta){
        window.open(red+''+cuenta)
      },
      back(){
        this.$emit("closeDrawer", true);
        window.history.back();
      },
      close () {
        this.$nextTick(() => {
          this.$emit("closeDialogDetailCompany", false);
        })
      },
      whatsapp(){
        if( /Android|iPhone|BlackBerry/i.test(navigator.userAgent) ) {
          var link = "https://wa.me/521"+this.company.phone
          location.replace(link, '_blank')
        }else if(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){
          var link = "https://web.whatsapp.com/send?phone=521"+this.company.phone
          location.replace(link, '_blank')
        }else{
          var link = "https://web.whatsapp.com/send?phone=521"+this.company.phone
          window.open(link, '_blank')
        }
      }
    }
  }
</script>
<style>
  .icons{
    filter:invert(1);
    height:16px;
    width: 16px;
  }
  .boxIcon{
    border-radius:5px; 
    width:26px; 
    margin-right:10px; 
    padding:5px; 
    height:26px;
    display: inline-block;
  }
</style>
