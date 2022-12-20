<template>
<!--000043   fb360-->
  <v-app id="inspire">
    <!-- sidebar -->
    <v-navigation-drawer expand-on-hover color="#f4f5fa" v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app> <!--style="box-shadow: 0px 13px 5px 0px rgb(112 112 115 / 30%)!important;z-index: 9;"-->
      <!-- sidebar-menu -->
      <v-list class="pl-0 pr-4 pt-3 sidebar" dense> 

        <!-- dashboard -->
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>Pantalla de inicio</span>
        </v-tooltip>

        <!-- Reportes -->
        <v-expansion-panels class="sinsombra">
          <v-expansion-panel style="background:transparent!important;">
            <v-expansion-panel-header style="font-weight:500; font-size:0.8125rem; color:#202020; padding:0px!important;">
              <div v-show="permissions('reports')">
                <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item v-bind="attrs" v-on="on">
                      <v-list-item-action class="mr-3">
                        <v-icon> mdi-chart-bar</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Reportes</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  <span>Reportes de ventas por categorías</span>
                </v-tooltip>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item to="/total-report" v-bind="attrs" v-on="on">
                      
                      <v-list-item-content>
                        <v-list-item-title>Ventas por Mes</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  <span>Reporte de ventas general mensual con ganancia</span>
                </v-tooltip>
                <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item to="/influencers-reports" v-bind="attrs" v-on="on">
                      
                      <v-list-item-content>
                        <v-list-item-title>Ventas por Influencer</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  <span>Reporte de ventas por influencer con ganancia</span>
                </v-tooltip>
                <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item to="/agencies-reports" v-bind="attrs" v-on="on">
                      
                      <v-list-item-content>
                        <v-list-item-title>Ventas por Agencia</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  <span>Reporte de ventas por Agencia con ganancia</span>
                </v-tooltip>
                <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item to="/department-reports" v-bind="attrs" v-on="on">
                      
                      <v-list-item-content>
                        <v-list-item-title>Ventas por Departamento</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  <span>Reporte de ventas por departamento con ganancia</span>
                </v-tooltip>
                <v-tooltip right open-delay="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item to="/users-reports" v-bind="attrs" v-on="on">
                      
                      <v-list-item-content>
                        <v-list-item-title>Ventas por Responsable</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  <span>Reporte de ventas por responsable con ganancia</span>
                </v-tooltip>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>


        <!-- empresas -->
        <div v-show="permissions('clients')">
        <v-divider class="ma-4"></v-divider>
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/clients" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon> mdi-account-multiple</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Clientes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Lista de empresas a las que se les ha cotizado/vendido</span>
        </v-tooltip>
        </div>

        <!-- pagos influencer -->
        <div v-show="permissions('influencers')">
        <v-divider class="ma-4"></v-divider>
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/influencers" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon> mdi-account-group</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Influencers</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Lista de influencers</span>
        </v-tooltip>
        </div>

        <!-- ventas -->
        <v-divider class="ma-4"></v-divider>
        <div v-show="permissions('sales')">
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/sales" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>mdi-currency-usd</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Ventas</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Lista de ventas cerradas</span>
        </v-tooltip>
        </div>

        <!-- cancelaciones -->
        <div v-show="permissions('cancelations')">
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/canceled" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>mdi-close-circle-outline</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Cancelaciones</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Cotizaciones que no se cerraron por algun motivo</span>
        </v-tooltip>
        </div>
      </v-list>
      <template v-slot:append>
        <div style="color:#9ca3a5; font-size: 12px;" class="pa-2">
          UNOCRM | v4.0.66 <v-icon> mdi-settings</v-icon>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- header -->
    <v-app-bar class="elevation-0 px-0" :clipped-left="$vuetify.breakpoint.lgAndUp" app  color="#f4f5fa" dark><!-- box-shadow: 0px 0px 5px 0px rgb(112 112 115 / 30%)!important; -->
        <v-icon @click.stop="drawer = !drawer"  class="mr-5" color="grey"> mdi-menu</v-icon>
        <img style="height: 40px;" src="/logo.png">
        <v-spacer></v-spacer>  
        <v-btn class="hidden-sm-and-down pa-0" icon to="/" link>
          <v-icon color="#707073">mdi-apps</v-icon>
        </v-btn>
        <!-- notification button>
        <v-menu bottom left offset-y origin="top right" transition="scale-transition">
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon class="ml-2 mr-1" min-width="0" text v-bind="attrs" v-on="on">
              <v-badge overlap color="#e25104">
                <template v-slot:badge>
                  {{notes.length}}
                </template>
                <v-icon color="#707073">mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item to="/notes" link>
                <v-list-item-action>
                  <v-icon> mdi-clipboard-text</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Notas ({{notes.length}})</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu-->
        <!-- account button -->
        <v-menu bottom left offset-y origin="top right" transition="scale-transition">
          <template v-slot:activator="{ attrs, on }">
            <v-btn class="ml-2 mr-1" text v-bind="attrs" v-on="on">
                <v-avatar size="32px">
                  <img src="/avatar.png" >
                </v-avatar>
                <span class="hidden-sm-and-down" style="color:#707073; margin-left:10px; text-transform: initial; letter-spacing: 0px; font-size:16px; font-weight: 400;"> {{currentUser.name}} {{currentUser.last}}</span> <v-icon color="#707073">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <!-- dropdown account -->
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item link to="/settings">
                <v-list-item-action>
                  <v-icon> mdi-cog</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Ajustes</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="logout">
                <v-list-item-action>
                  <v-icon>mdi-power</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Cerrar Sesión</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
            </v-list-item-group>
          </v-list>
        </v-menu>
    </v-app-bar>
    <!-- content -->
    <v-main class="pa-0" style="background-color:#f4f5fa;">
      <v-container class="pa-0" fluid>
        <router-view @closeDrawer="closeDrawer"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<!----------------------- Scripts ----------------------->
<script>
  export default {
    name: 'AppContainer',
    data: () => ({
      drawer: true,
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
    }),
    methods:{
      closeDrawer: function(params) {
        this.drawer = params;
      },
      logout(){
        this.$store.dispatch('currentUser/logoutUser')
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
        }else{
          return false
        }
      },
    },
    computed:{
      notes(){
        return this.$store.state.note.notes.filter(note=>note.seen == false);
      },
      currentUser:{
        get(){
          return this.$store.state.currentUser.user;
        }
      }
    },
    created(){
      this.$store.dispatch('currentUser/getUser')
      this.$store.dispatch('origin/getOrigins')
      this.$store.dispatch('status/getStatuses')
      this.$store.dispatch('user/getUsers') 
      this.$store.dispatch('user/getSalesman') 
      //this.$store.dispatch('user/getInfluencer') 
      this.$store.dispatch('state/getStates')
      this.$store.dispatch('contact_mode/getContactModes')
      this.$store.dispatch('category/getCategories')
      /*
      this.$store.dispatch('note/getNotes')
      this.$store.dispatch('company/getCompanies')
      this.$store.dispatch('contact/getContacts')   
      this.$store.dispatch('log/getLogs')
	    this.$store.dispatch('rejection/getRejections') 
      this.$store.dispatch('quotation/getSales')
      this.$store.dispatch('quotation/getQuotations')
      this.$store.dispatch('quotation/getCancellations')

      this.$store.dispatch('state/getStates')
      this.$store.dispatch('city/getCities')
      */
    },
  }
</script>


<!-- Styles -->      
<style>
  .v-navigation-drawer__border{
    display:none!important;
  }
  .sidebar .v-list-item.v-list-item--link.theme--light:hover{
    background-color:#e9edf8!important; 
    border-radius: 0px 20px 20px 0px!important;
  }
  .sidebar .v-list-item.v-list-item--link.theme--light:hover i::before{
    color: #c57de4!important;
  }
  .sidebar .v-list-item--active{
    background-color:#e9edf8!important; 
    border-radius: 0px 20px 20px 0px!important;
  }
  .sidebar .v-list-item--active i::before{
    color: #c57de4!important;
  }
  .sidebar .theme--light.v-list-item--active:hover::before, .theme--light.v-list-item--active::before {
    opacity: 0!important;
  }
  .sidebar .theme--light.v-list-item:hover::before {
    opacity: 0;
  }
  .v-window__prev, .v-window__next {
    background: transparent!important;;
  }
  .v-carousel__controls{
    display:none!important;
  }
  .v-application--wrap {
    min-height: calc(100vh - 65px)!important;
  }
  .sinsombra .v-expansion-panel::before{
    box-shadow: none!important;
  }
</style>