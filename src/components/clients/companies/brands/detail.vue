<template>
      <v-card>{{apiCall}}
        <!-- header -->
        <v-app-bar v-if="companyDetail!=null && show" class="elevation-0" dark color="#c57de4">
          <v-avatar size="32px" class="mr-4">
            <img :src="'https://logo.clearbit.com/'+logito(companyDetail.email)" >
          </v-avatar>
          <v-toolbar-title >{{companyDetail.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- botones contacto pc -->
          <div class="hidden-md-and-down">
            <v-btn v-bind:href="'tel:'+companyDetail.phone" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-phone-outline</v-icon>
                </template>
                <span>Llamar al {{companyDetail.phone}}</span>
              </v-tooltip>
            </v-btn>
            <v-btn @click="whatsapp()" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-whatsapp</v-icon>
                </template>
                <span>WhatsApp {{companyDetail.phone}}</span>
              </v-tooltip>
            </v-btn>
            <v-btn v-bind:href="'mailto:'+companyDetail.email" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-email-outline</v-icon>
                </template>
                <span>{{companyDetail.email}}</span>
              </v-tooltip>
            </v-btn>
            <v-btn v-bind:href="'https://www.google.com.mx/maps/place/' + companyDetail.fiscal_address + '/@'" target="_blank" icon class="mx-3">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-map-marker-outline</v-icon>
                </template>
                <span>{{companyDetail.fiscal_address}}</span>
              </v-tooltip>
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="back()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <!-- container -->
        <v-sheet v-if="companyDetail!=null && show" id="scrolling-techniques-6" class="overflow-y-auto" max-height="calc(100vh - 64px)" min-height="calc(100vh - 64px)" style="max-width: 100vw; margin:auto; background:#f4f5fa;">
          <v-row style="max-width: 100vw; margin:auto;">
            <!-- sidebar -->
            <v-col class="px-4 py-7" cols="12" md="3" >
              <v-card outlined>
                <contacts v-bind:client="companyDetail"/>
              </v-card>
              <v-card class="px-6 pa-6 mt-4" outlined>
                <div class="overline mb-2">
                  Recordatorio/Nota Especial
                </div>
                <v-textarea class="space" background-color="amber lighten-4" v-model="companyDetail.special_note"></v-textarea>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-btn @click="saveNote()" text :loading="gris" :disabled="gris">
                    GUARDAR
                  </v-btn>
                </v-row>
              </v-card>
              <v-card class="px-6 pa-6 mt-4" outlined>
                <div class="overline mb-2">
                  Datos Fiscales
                </div>
                <div>
                  <span style="font-size:16px;" class="my-2">
                    <strong>RFC: </strong> 
                    {{companyDetail.rfc}}
                  </span>
                </div>
                <div>
                  <span style="font-size:16px;" class="my-2">
                    <strong>Razón Social: </strong> 
                    {{companyDetail.razon_social}}
                  </span>
                </div>
                <div>
                  <span style="font-size:16px;" class="my-2">
                    <strong>Dirección: </strong> 
                    {{companyDetail.fiscal_address}}
                  </span>
                </div>
              </v-card>
            </v-col>
            <!-- tabs -->
            <v-col style="background:#f4f5fa;" class="py-6 px-4 mt-2" cols="12" md="9">
                <v-tabs grow class="paddingtab">
                  <v-tab background-color="transparent" color="basil" grow>
                    Ventas
                  </v-tab>
                  <v-tab-item>
                    <sales v-bind:prop_brand_id="companyDetail.id"/>
                  </v-tab-item>
                  <v-tab background-color="transparent" color="basil" grow>
                    Cancelaciones
                  </v-tab>
                  <v-tab-item>
                    <canceled v-bind:prop_brand_id="companyDetail.id"/>
                  </v-tab-item>
                  <!--v-tab background-color="transparent" color="basil" grow>
                    Notas
                  </v-tab>
                  <v-tab-item>
                    <notes v-bind:prop_brand_id="companyDetail.id"/>
                  </v-tab-item>
                  <v-tab v-show="permissions('activityLog')" background-color="transparent" color="basil" grow>
                    Bitacora
                  </v-tab>
                  <v-tab-item v-show="permissions('activityLog')">
                    <activitylog v-bind:prop_brand_id="companyDetail.id"/>
                  </v-tab-item-->
                </v-tabs>
            </v-col>
          </v-row>
        </v-sheet>
        <!-- botones contacto movil -->
        <v-bottom-navigation v-if="companyDetail!=null && show" style="background:#2b2b2b;" class="hidden-md-and-up" fixed bottom>
          <v-btn v-bind:href="'tel:'+companyDetail.phone" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-phone-outline</v-icon>
              </template>
              <span>Llamar al {{companyDetail.phone}}</span>
            </v-tooltip>
          </v-btn>
          <v-btn @click="whatsapp()" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-whatsapp</v-icon>
              </template>
              <span>WhatsApp {{companyDetail.phone}}</span>
            </v-tooltip>
          </v-btn>
          <v-btn v-bind:href="'mailto:'+companyDetail.email" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-email-outline</v-icon>
              </template>
              <span>{{companyDetail.email}}</span>
            </v-tooltip>
          </v-btn>
          <!--v-btn v-bind:href="'https://www.google.com.mx/maps/place/' + company.delivery_address + '/@'" target="_blank" icon class="mx-3">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-map-marker-outline</v-icon>
              </template>
              <span>{{company.delivery_address}}</span>
            </v-tooltip>
          </v-btn-->
        </v-bottom-navigation>
      </v-card>
</template>
<script>
import axios from "axios";
import Contacts from "../../contacts/container"
import Quotations from "../../../quotations/table"
import Sales from "../../../sales/table"
import Canceled from "../../../canceled/table"
import Notes from "../../../notes/container"
import ActivityLog from "../../../activitylog/container"
  export default {
    components: {
      'contacts':Contacts,
      'quotations':Quotations,
      'sales':Sales,
      'canceled':Canceled,
      'notes':Notes,
      'activitylog':ActivityLog,
    }, 
    data () {
      return {
        gris:false,
        show:false,
        companyDetail:null
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
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/brands/" + this.$route.params.brand_id)
        .then(response=>{
            this.companyDetail = response.data.data
            this.show = true
        })
      }
    },
    methods: {
      logito(mail){
        if(mail!=undefined){
          var indiceArroba = mail.indexOf("@")+1;
          var logo = mail.slice(indiceArroba, mail.length)
          if(logo=='gmail.com'||logo=='hotmail.com'||logo=='yahoo.com'||logo=='icloud.com'){
            return 'unonegocios.com'
          }
          return logo
        }else{
          return 'unonegocios.com'
        }
      },
      saveNote(){
        this.gris = true
        this.$nextTick(() => {
          axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/company/update",Object.assign(this.companyDetail)).then(response=>{
            this.$store.dispatch('company/getCompanies')
          })
        })
      },
      back(){
        this.$emit("closeDrawer", true);
        window.history.back();
      },
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
      close () {
        this.$nextTick(() => {
          this.$emit("closeDialogDetailCompany", false);
        })
      },
      whatsapp(){
        if( /Android|iPhone|BlackBerry/i.test(navigator.userAgent) ) {
          var link = "https://wa.me/521"+this.companyDetail.phone
          location.replace(link, '_blank')
        }else if(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){
          var link = "https://web.whatsapp.com/send?phone=521"+this.companyDetail.phone
          location.replace(link, '_blank')
        }else{
          var link = "https://web.whatsapp.com/send?phone=521"+this.companyDetail.phone
          window.open(link, '_blank')
        }
      }
    }
  }
</script>

<style>
.v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev {
    display: none!important;
}

@media (max-width: 980px){
  .paddingtab .v-data-table {
      padding-right: 0px !important;
      padding-left: 0px !important;
  }
  .paddingtab .detail{
    display: none!important;
  }
}

.space .theme--light.v-input input, .theme--light.v-input textarea {
    padding: 15px 20px;
}
</style>