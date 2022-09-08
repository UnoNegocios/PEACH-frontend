<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <brandFilter @filterBrands="filterBrands" v-if="tab=='brand'"/>
            <agencyFilter @filterAgencies="filterAgencies" v-if="tab=='agency'"/>
        </v-navigation-drawer>
        <!-- Contenedor -->

            <v-toolbar flat>
                <v-toolbar flat >
                    <v-toolbar-title>Clientes</v-toolbar-title>
                    <v-btn icon v-if="filterStorageLength==0" @click="openFilter()">
                        <v-icon>mdi-filter</v-icon>
                    </v-btn>

                    <v-btn icon v-else @click="openFilter()">
                        <v-badge overlap color="primary">
                            <template v-slot:badge>
                                {{filterStorageLength}}
                            </template>
                            <v-icon>mdi-filter</v-icon>
                        </v-badge>
                    </v-btn>

                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-spacer></v-spacer>
                
                <v-tabs v-model="tab" right class="mr-4">
                    <v-tab @click="refreshBrands=!refreshBrands" href="#brand">
                        Marcas
                    </v-tab>
                    <v-tab @click="refreshAgencies=!refreshAgencies" href="#agency">
                        Agencias
                    </v-tab>
                    <v-tabs-slider color="yellow"></v-tabs-slider>
                </v-tabs>

            </v-toolbar>

            <v-tabs-items v-model="tab">
                <v-tab-item :value="'brand'">
                    <brands  v-bind:refreshBrands="refreshBrands"/>
                </v-tab-item>

                <v-tab-item :value="'agency'">
                      <agencies v-bind:refreshAgencies="refreshAgencies" />
                </v-tab-item>
            </v-tabs-items>

        <!-- Crear empresa -->
        <v-dialog v-model="createDialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#58c6ef" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create @closeCreateDialogCompany="closeCreateDialogCompany" v-bind:client_type="tab"/>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from "axios";
import BrandFilter from "../clients/companies/brands/filter"
import AgencyFilter from "../clients/companies/agencies/filter"
import Create from "../clients/companies/create"
import Brads from "../clients/companies/brands/table"
import Agencies from "../clients/companies/agencies/table"
export default {
    components: {
        'agencies':Agencies,
        'create':Create,
        'brands':Brads,
        'brandFilter':BrandFilter,
        'agencyFilter':AgencyFilter
    }, 
    data: () => ({
        tab: 'agency',
        filters: false,
        createDialog: false,
        refreshBrands:false,
        refreshAgencies:false,
    }),
    created(){
        if(this.tab=='agency'){
            this.filterStorageLength = localStorage.getItem("filtersAgenciesLength")*1
        }else if(this.tab=='brand'){
            this.filterStorageLength = localStorage.getItem("filtersBrandsLength")*1
        }
    },
    watch:{
        refreshBrands:{
            handler(){
                if(this.tab=='agency'){
                    this.filterStorageLength = localStorage.getItem("filtersAgenciesLength")*1
                }else if(this.tab=='brand'){
                    this.filterStorageLength = localStorage.getItem("filtersBrandsLength")*1
                }
            },
            deep: true
        },
        refreshAgencies:{
            handler(){
                if(this.tab=='agency'){
                    this.filterStorageLength = localStorage.getItem("filtersAgenciesLength")*1
                }else if(this.tab=='brand'){
                    this.filterStorageLength = localStorage.getItem("filtersBrandsLength")*1
                }
            },
            deep: true
        }
    },
    methods: {
        openFilter(){
            if(this.filters == false){
                this.$emit("closeDrawer", false);
                this.filters = true
            }else{
                this.$emit("closeDrawer", true);
                this.filters = false
            }
        },
        closeCreateDialogCompany: function(params) {
            location.reload();
        },
        filterBrands: function(params) {
            this.filters = params;
            this.refreshBrands = !this.refreshBrands
        },
        filterAgencies: function(params) {
            this.filters = params;
            this.refreshAgencies = !this.refreshAgencies
        },
    }
}
</script>