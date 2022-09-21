<template>
    <v-container style="max-width:100vw;">
            <v-data-table 
            height="600"
            fixed-header
            :footer-props="{'items-per-page-options':[15, 30, 50, companiesLength]}"
            v-if="showTable"
            :headers="headers" 
            :items="companies"
            class="elevation-0 px-6 pb-4 pt-10"
            :options.sync="options"
            :server-items-length="totalCompanies"
            :loading="loading">
            <template v-slot:[`item.influencer`]="{ item }">
                <v-btn v-if="item.influencer!=undefined" class="btnText" :to="{ path: '/influencers/influencer/'+ item.influencer.id}">{{item.influencer.name}} {{item.influencer.last}}</v-btn>
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left v-if="permissions('editClients')==true || permissions('deleteClients')==true">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.editedItem)" v-show="permissions('editClients')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)" v-show="permissions('editClients')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- Etapa -->
            <template v-slot:[`item.agencies`]="{ item }">
                <span v-if="item.agencies.length>0">{{item.agencies[0].name}}</span>
            </template >
            <!-- Estatus -->
            <template v-slot:[`item.status`]="{ item }">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }" >
                        <v-chip  v-bind="attrs" v-on="on" class="pa-2" small :style="{'background':'linear-gradient(0deg, rgb(255 255 255 / 85%), rgb(255 255 255 / 85%)) rgb(0, 198, 255)', 'background-color':item.status.color, 'color':item.status.color}">{{item.status.name}}</v-chip>
                    </template>
                    <v-list>
                        <v-list-item v-for="(status,index) in statusesLists" :key="index" > <!--  -->
                            <v-list-item-content class="pa-0">
                                <v-list-item-title><v-btn @click="changeStatus(item.id, status.id)" small text>{{status.name}}</v-btn></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>   
                    </v-list>
                </v-menu>
            </template >
            <!-- Ver más -->
            <template v-slot:[`item.view`]="{ item }">
                <v-btn class="gato" icon :to="{ path: '/clients/brand/'+ item.id}"><v-icon small> mdi-eye</v-icon></v-btn>
            </template>
            <!-- Creación -->
            <template v-slot:[`item.created_at`]="{ item }">
                {{item.created_at.slice(0, 10)}}
            </template>
            <!-- Actualización -->
            <template v-slot:[`item.updated_at`]="{ item }">
                {{item.updated_at.slice(0, 10)}}
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de clientes aún
            </template>
        </v-data-table>
        <!-- Editar empresa -->
        <v-dialog v-model="editDialog" max-width="800px">
          <edit v-bind:editedCompany="company" @closeDialogEditCompany="closeDialogEditCompany"/>
        </v-dialog>
        <!-- Detalle empresa -->
        <v-dialog v-model="detailDialog" fullscreen hide-overlay transition="dialog-bottom-transition">            
            <detail v-bind:company="company" @closeDialogDetailCompany="closeDialogDetailCompany"/>
        </v-dialog>
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta empresa?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteCompany()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import Edit from "../edit"
//import Detail from "../detail"
export default {
    components: {
        'edit':Edit,
        //'detail':Detail
    }, 
    props:{
        refreshBrands:Boolean
    },
    data: () => ({
        options: {},
        showTable:true,
        sheet: false,
        editDialog: false,
        detailDialog:false,
        deleteId:'',
        companies:[],
        company:'',
        totalCompanies:0,
        loading:false,
        filterStorageLength:0,
        companiesLength:0,
    }),
    computed: {
        statusesLists(){
            return this.$store.state.status.statuses
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            return [
            { value: 'view', sortable: false, align: 'start', },
            { text: 'Cliente/Marca', value: 'name',},
            { text: 'Procedencia', value: 'origin', sortable: false, },
            { text: 'Estatus', value: 'status' },
            { text: 'Ciudad', value: 'city'},
            { text: 'Medio de Contacto', value: 'contact_medium'},
            { text: 'Clave', value: 'key' },
            { text: 'Cliente/Agencia', value: 'agencies',},
            { text: 'Responsable', value: 'agent'},
            { text: 'Creación', value: 'created_at' },
            { text: 'Actualización', value: 'updated_at' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        companiesLists(){
            
        },
    },
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
        refreshBrands: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
        currentUser: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods: {
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.companies = data.items
                this.totalCompanies = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                this.filterStorageLength = localStorage.getItem('filtersBrandsLength')
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                var link = this.$store.state.currentUser.client_filter
                if(localStorage.getItem('filtersBrands')!=null){
                    link = JSON.parse(localStorage.getItem('filtersBrands'))+'&'
                }
                /*if(sortBy.length === 1){
                    if(sortDesc[0]){
                        link = link + "sort=-" + sortBy[0] + '&'
                    }else{
                        link = link + "sort=" + sortBy[0] + '&'
                    }
                }*/
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/brands?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    this.companiesLength = response.data.meta.total
                    items = this.mapBrands(response.data.data)
                    total = response.data.meta.total
                    resolve({
                        items,
                        total,
                    })
                })
            })
        },
        mapBrands(brands){
            brands = brands.map(id=>{
                return{
                    id: id.id,
                    name: id.name,
                    origin: id.origin.name,
                    status: id.status,
                    created_at: id.created_at,
                    updated_at: id.updated_at,
                    agencies: id.agencies,
                    agent: id.agent.name + ' ' + id.agent.last,
                    city: id.city,
                    contact_medium: id.contact_medium,
                    email: id.email,
                    fiscal_address: id.fiscal_address,
                    phone: id.phone,
                    razon_social: id.razon_social,
                    rfc: id.rfc,
                    special_note: id.special_note,
                    user_id:id.agent.id,
                    agenciesId:this.perro(id.agencies),
                    user_id:id.agent.id,
                    origin_id:id.origin.id,
                    status_id:id.status.id,

                    key: id.agent.job_position.toUpperCase() + id.agent.name.slice(0,1).toUpperCase(),
                    editedItem: id
                }
            });
            return brands
        },
        perro(gato){
            return gato.map(agency=>agency.id)
        },
        changeStatus(company_id, status){
            var editedItem = {
                id: company_id,
                status_id: status,
            }
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/brands/" + company_id,Object.assign(editedItem)).then(response=>{})
        },
        openFilter(){
            if(this.filters == false){
                this.$emit("closeDrawer", false);
                this.filters = true
            }else{
                this.$emit("closeDrawer", true);
                this.filters = false
            }
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
        filtersCompany: function(params) {
            
        },
        closeDialogDetailCompany: function(params) {
            this.detailDialog = params;
        },
        closeDialogEditCompany: function(params) {
            this.editDialog = params;
            this.getDataFromApi()
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.companies)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Empresas'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteCompany(){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/brands/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.getDataFromApi()
            });
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
        },
        deleteItem (item) {
            this.deleteId = item.id
            this.sheet = true
        },
        editItem(item){
            this.company = [item].map(id=>{
                return{
                    id:id.id,
                    name:id.name,
                    phone:id.phone,
                    email:id.email,
                    user_id:id.agent.id,
                    origin_id:id.origin.id,
                    status_id:id.status.id,
                    contact_medium:id.contact_medium,
                    city:id.city,
                    special_note:id.special_note,
                    razon_social:id.razon_social,
                    rfc:id.rfc,
                    fiscal_address:id.fiscal_address,
                    agenciesId:this.perro(id.agencies),
                    agencies:id.agencies,
                    label:'brand'
                }
            })[0]
            this.editDialog = true
        },
    }
}
</script>

<style>
    @media(min-width: 980px){
        .gato{
            transform: translateX(14px);
        }
    }
    .btnText{
        padding: 0px!important;
        height: auto!important;
        background: white!important;
        box-shadow: none!important;
        text-transform: none;
        font-weight: 400;
        font-family: "Roboto", sans-serif;
        letter-spacing: 0;
    }
</style>