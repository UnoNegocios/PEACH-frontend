<template>
    <v-container>  
        <v-card style="background:white;" class="elevation-0 pa-4">
            <v-card-title>
                Influencers 
                <v-btn icon @click="openFilter=!openFilter">
                    <v-icon>mdi-filter</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <div class="ma-0">
                    <v-row class="ma-0" style="min-width:40vw;">
                        <v-text-field class="pt-0 pb-2" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
                    </v-row>
                    <v-row class="ma-0 pb-0" v-if="openFilter">
                        <v-col cols="4" class="mb-0 pb-0">
                            <v-autocomplete class="mb-0 pb-0" v-model="searchbyCategory" small-chips :items="categories" item-value="id" item-text="name" label="Categoría(s)" multiple chips></v-autocomplete>
                        </v-col>
                        <v-col cols="3" class="mb-0 pb-0">
                            <v-autocomplete class="mb-0 pb-0" v-model="searchbyState" :items="statesList" item-value="id" item-text="name" label="Estado"></v-autocomplete>
                        </v-col>
                        <v-col cols="3" class="mb-0 pb-0">
                            <v-autocomplete class="mb-0 pb-0" v-model="searchbyCity" :disabled="searchbyState==''" :items="citiesList" item-value="id" item-text="name" label="Ciudad"></v-autocomplete>
                        </v-col>
                        <v-col cols="1" class="mb-0 pb-0">
                            <v-spacer/>
                            <v-btn class="elevation-0 mt-4 mb-0 pb-0" color="primary" rounded small @click="getDataFromApi()">Filtrar</v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-card-title>
            <v-data-table 
            height="600"
            fixed-header
            :footer-props="{'items-per-page-options':[15, 30, 50, totalInfluencers]}"
            v-if="showTable"
            :headers="headers" 
            :items="influencers"
            class="elevation-0 px-6 pb-4 pt-6"
            :options.sync="options"
            :server-items-length="totalInfluencers"
            :loading="loading">
                <template v-slot:[`item.photo`]="{ item }">
                    <v-avatar class="my-2">
                        <img :src="item.photo">
                    </v-avatar>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                    <v-btn class="btnText" :to="{ path: '/influencers/influencer/'+ item.id}">{{item.name}}</v-btn>
                </template>
                <template v-slot:[`item.categories`]="{ item }">
                    <v-chip-group>
                        <v-chip x-small color="primary" v-for="category in item.categories" :key="category.id">{{category.name}}</v-chip>
                    </v-chip-group>
                </template>
                <template v-slot:[`item.is_booking`]="{ item }">
                    <span v-if="item.is_booking">Booking</span>
                    <span v-else>Mgmt</span>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" v-show="permissions('editInfluencers')" @click="edit(item.editedItem)">mdi-pencil</v-icon>
                    <v-icon small v-show="permissions('deleteInfluencers')" @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>
            <v-dialog v-model="editDialog" max-width="800px">
                <editItem @closeDialogItem="closeDialogItem" v-bind:editedItem="editedItem"/>
            </v-dialog> 
            <!-- Crear empresa -->
            <v-dialog v-model="createDialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn bottom color="#58c6ef" dark fab fixed right v-bind="attrs" v-on="on">
                    <v-icon color="white">  mdi-plus </v-icon>
                </v-btn> 
            </template>
                <createItem @closeDialogItem="closeDialogItem"/>
            </v-dialog>
        </v-card>
    </v-container>
</template>
<script>
import axios from "axios";
import editItem from "../influencers/edit"
import createItem from "../influencers/create"
export default {
    components: {
        'editItem':editItem,
        'createItem':createItem,
    },
    mounted(){
        this.$store.dispatch('state/getStates')
        this.$store.dispatch('category/getCategories')
    },
    data:()=>({ 
        openFilter:false, 
        options: {},
        showTable:true,
        influencers:[],
        influencer:'',
        totalInfluencers:0,
        loading:false,
        filterStorageLength:0,
        influencersLength:0,
        citiesList:[],
        sheet: false,
        search: '',
        editDialog:false,
        createDialog:false,
        info:true,
        editedItem:'',
        headers:[
            {text: '', value: 'photo'},
            {text: 'Nombre', value: 'name'},
            {text: 'Email', value: 'email'},
            {text: 'Teléfono', value: 'phone'},
            {text:'Comisión', value:'commission_percentage'},
            {text: 'Tipo', value: 'is_booking'},
            {text: 'Ubicación', value: 'location'},
            {text: 'Categoría(s)', value: 'categories'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
        searchbyCategory:'',
        searchbyState:'',
        searchbyCity:''
    }),
    //18,19,38,144,239,433
    computed:{
        currentUser(){
            return this.$store.state.currentUser.user
        },
        statesList(){
            return this.$store.state.state.states
        },
        categories(){
            return this.$store.state.category.categories
        }
    },
    watch: {
        searchbyState: {
            handler () {
                this.getCitiesFromApi()
            },
            deep: true,
        },
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
        search: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods:{
        getCitiesFromApi(){
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/cities?state_id=" + this.searchbyState).then(response => {
                this.citiesList = response.data
            })
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
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.influencers = data.items
                this.totalInfluencers = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                this.filterStorageLength = localStorage.getItem('filtersInfluencersLength')
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                var link = ''
                if(localStorage.getItem('filtersInfluencers')!=null){
                    link = JSON.parse(localStorage.getItem('filtersInfluencers'))+'&'
                }
                if(this.search!=''){
                    link = link + '&filter[name]=' + this.search + '&'
                }
                if(this.currentUser.role == 'Talent Agent' || this.currentUser.role == 'Booking'){
                    link = link + '&filter[parent_id]=' + this.currentUser.id + '&'
                }else if(this.currentUser.role == 'Talent Agent Manager'){
                    link = link + '&filter[is_booking]=' + 0 + '&'
                }else if(this.currentUser.role == 'Booking Manager'){
                    link = link + '&filter[is_booking]=' + 1 + '&'
                }

                if(this.searchbyCategory!=''){
                    link = link + '&filter[categories]=' + this.searchbyCategory
                }
                if(this.searchbyState!=''){
                    link = link + '&filter[state]=' + this.searchbyState
                }
                if(this.searchbyCity!=''){
                    link = link + '&filter[city]=' + this.searchbyCity
                }


                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencers?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    this.companiesLength = response.data.meta.total
                    items = this.mapInfluencers(response.data.data)
                    total = response.data.meta.total
                    if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            axios
                            .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencers?" + link + "page=" + page + "&sort=-" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapInfluencers(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }else{
                            axios
                            .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencers?" + link + "page=" + page + "&sort=" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapInfluencers(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }
                    }else{
                        resolve({
                            items,
                            total,
                        })
                    }
                })
            })
        },
        mapInfluencers(influencers){
            influencers =  influencers.map(id=>{
                return{
                    id: id.id,
                    email: id.email,
                    name: id.name + " " + id.last,
                    phone: id.phone,
                    photo: id.photo,
                    commission_percentage:(id.commission_percentage*1)+'%',
                    is_booking:id.is_booking,
                    location:this.existName(id.city) + ', ' + this.existName(id.state),
                    categories:id.categories,
                    editedItem:[id].map(id=>{
                        return{
                            id:id.id,
                            parent_id:id.agent.id,
                            name:id.name,
                            last:id.last,
                            email:id.email,
                            phone:id.phone,
                            status:id.status,
                            state:this.existId(id.state),
                            city:this.existId(id.city),
                            is_booking:id.is_booking,
                            social_networks:id.social_networks,
                            bank_account_details:id.bank_account_details,
                            commission_percentage:id.commission_percentage,
                            role:'Influencer',
                            category_ids:id.categories.map(id=>id.id)
                        }
                    })[0]
                }
            });
            return influencers
        },
        existName(item){
            if(item!=undefined){
                return item.name
            }else{
                return ''
            }
        },
        existId(item){
            if(item!=undefined){
                return item.id*1
            }else{
                return ''
            }
        },
        status(status){
            if(status==1){
                return 'Activo'
            }else{
                return 'Inactivo'
            }
        },
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas eliminar esta influencer?')) {
                axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users/"+id).then(response => {
                    this.getDataFromApi()
                });
            }
        },
        edit(item){
            this.editedItem = item
            this.editDialog = true
        },
        closeDialogItem: function(params) {
            this.editDialog = params;
            this.createDialog = params;
            this.getDataFromApi()
        },
    },
}
</script>
<style scoped>
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