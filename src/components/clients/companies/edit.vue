<template>
    <v-card>
        <v-card-title class="pb-0 pt-3 pb-2" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-domain</v-icon>
            <span >Editar Cliente</span>
            <v-spacer></v-spacer>
            <v-col v-if="client_type=='brand'" cols="12" sm="6" md="4" class="pb-0 mb-0">
                <v-autocomplete v-model="company.agenciesId" :items="agencyLists" :loading="isLoadingAgencies" :search-input.sync="searchAgencies" hide-no-data item-value="id" item-text="name" label="Agencia(s)" placeholder="Escribe para buscar" attach chips multiple>
                    <template slot="no-data"><div class="px-4 py-1">No existen agencias relacionadas.</div></template>  
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="2" class="pb-0 mb-0">
                <v-radio-group v-model="client_type" class="my-0">
                    <v-radio label="Agencia" color="primary" value="agency"></v-radio>
                    <v-radio label="Marca" color="primary" value="brand"></v-radio>
                </v-radio-group>
            </v-col>

        </v-card-title>
        
        <v-divider></v-divider>
        <v-stepper v-model="e1" class="elevation-0">
            <v-stepper-header class="elevation-0">
                <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 1" step="1"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 2" step="2"></v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <v-container>
                            <v-row>
                                <v-col cols="12" class="py-0" sm="6" md="6">
                                    <v-text-field prepend-inner-icon="mdi-domain" :rules="[v => !!v || 'Campo requerido']" v-model="company.name" label="Nombre de Empresa*"></v-text-field>
                                </v-col>
                                <v-col cols="12" class="py-0" sm="6" md="6">
                                    <vue-tel-input-vuetify type="number" v-model="company.phone" label="Tel??fono"></vue-tel-input-vuetify>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="6" md="6">
                                    <v-text-field prepend-inner-icon="mdi-email" v-model="company.email" label="Correo Electr??nico"></v-text-field>
                                </v-col>
                                <v-col class="py-0" cols="12" sm="6" md="6">
                                    <v-autocomplete outlined class="mt-3" dense rounded filled :rules="[v => !!v || 'Campo requerido']" clearable v-model="company.origin_id" :items="originLists" label="Procedencia*" item-text="name" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen procedencias relacionadas.</template>                      
                                    </v-autocomplete>
                                </v-col>
                                <!--v-col class="py-0" cols="12" sm="6" md="6">
                                    <v-autocomplete outlined class="mt-3" dense rounded filled :rules="[v => !!v || 'Campo requerido']" clearable v-model="company.status_id" :items="statusLists" label="Estatus*" item-text="name" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen estatus relacionados.</template>                      
                                    </v-autocomplete>
                                </v-col-->
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
                <v-stepper-content step="2" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <v-container>
                            <v-row class="mt-0">
                                <v-col class="pt-0" cols="12" sm="6" md="6">
                                    <strong>Condiciones Comerciales</strong>
                                     <v-autocomplete  outlined class="mt-3" dense clearable v-model="company.contact_medium" :items="mediumLists" label="Medio de Contacto Preferido" item-text="mode" item-value="mode">
                                        <template slot="no-data" class="pa-2">No existen medios relacionados.</template>                      
                                    </v-autocomplete>
                                    <v-autocomplete outlined class="mt-3" dense clearable v-model="company.city" :items="cityLists" label="Ciudad" placeholder="Escribe para buscar"  item-text="name" item-value="name" :loading="isLoadingCities" :search-input.sync="searchCities" hide-no-data>
                                        <template slot="no-data" class="pa-2">No existen ciudades relacionadas.</template>                      
                                    </v-autocomplete>
                                    <v-textarea filled class="mt-4" v-model="company.special_note" label="Nota Especial"></v-textarea>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="6" md="6">
                                    <strong>Datos Fiscales</strong>
                                    <v-text-field v-model="company.razon_social" label="Razon Social"></v-text-field>
                                    <v-text-field v-model="company.rfc" label="RFC"></v-text-field>
                                    <v-text-field prepend-inner-icon="mdi-map-marker" v-model="company.fiscal_address" label="Direcci??n Fiscal"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
        <v-card-actions class="pr-6 pb-6">
            <v-col cols="12" sm="6" md="4">
                <v-autocomplete  :rules="[v => !!v || 'Campo requerido']" v-if="permissions('assignClients')" clearable v-model="company.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
                <v-autocomplete v-else-if="company.user_id=currentUser.id" disabled v-model="company.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">                
                </v-autocomplete>
            </v-col>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-2" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1>1" @click="e1 = e1-1">
                <v-icon>mdi-chevron-left</v-icon>
                Regresar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1!=2" @click="e1 = e1+1" :disabled="grey">
                Siguiente
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn color="primary" class="px-3" @click="save" :loading="gris" :disabled="gris || grey">
                Guardar
            </v-btn>
        </v-card-actions>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show" style="text-align:center;">
            <strong>{{ snackbar.message }}</strong>
        </v-snackbar>
    </v-card>
</template>

<script>
const initialState = () => {
    return {
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        company:{
            name:'',
            phone:'',
            email:'',
            origin_id:'',
            status_id:'',
            user_id:'',
            contact_medium:'',
            city:'',
            special_note:'',
            razon_social:'',
            rfc:'',
            fiscal_address:'',
            agenciesId:''
        },
        client_type:'',
        e1: 1,
        gris:false,
        rules: {
            required: value => !!value || 'Campo requerido',
        },
        valid: true,
        entriesAgencies:[],
        isLoadingAgencies: false,
        searchAgencies:'',
        entriesCities:[],
        isLoadingCities: false,
        searchCities:'',
    }
}
import axios from "axios";
    export default {
    props:{
        editedCompany:Object
    },
    data: () => ( initialState() ),
    computed: {
        name(){
            return this.company.name
        },
        agencyLists(){
            return this.entriesAgencies.map(id => {
                return{
                    id:id.id,
                    name:id.name
                }
            })
        },
        cityLists(){
            return this.entriesCities
        },
        grey(){
            if( this.client_type==''||this.client_type==null||this.client_type==undefined||
                this.company.origin_id==''||this.company.origin_id==null||this.company.origin_id==undefined||
                this.company.status_id==''||this.company.status_id==null||this.company.status_id==undefined||
                this.company.name==''||this.company.name==null||this.company.name==undefined){
                    return true
            }else{
                return false
            }
        },
        mediumLists(){
            return this.$store.state.contact_mode.contact_modes;
        },
        usersLists(){
            return this.$store.state.user.salesman;
        },
        originLists(){
            return this.$store.state.origin.origins;
        },
        statusLists(){
            return this.$store.state.status.statuses;
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
    },
    created(){
        this.company.name = this.editedCompany.name
        this.company.phone = this.editedCompany.phone
        this.company.email = this.editedCompany.email
        this.company.origin_id = this.editedCompany.origin_id
        this.company.status_id = this.editedCompany.status_id
        this.company.user_id = this.editedCompany.user_id
        this.company.contact_medium = this.editedCompany.contact_medium
        this.company.city = this.editedCompany.city
        this.company.special_note = this.editedCompany.special_note
        this.company.razon_social = this.editedCompany.razon_social
        this.company.rfc = this.editedCompany.rfc
        this.company.fiscal_address = this.editedCompany.fiscal_address
        this.company.agenciesId = this.editedCompany.agenciesId
        if(this.company.agenciesId!=''){
            this.client_type = 'brand'
        }else{
            this.client_type = 'agency'
        }
        if(this.company.agencies!=undefined){
            if(this.entriesAgencies!=undefined && this.entriesAgencies.length>0){
                this.entriesAgencies.concat(this.company.agencies)
            }else{
                this.entriesAgencies = this.company.agencies
            }
        }
        if(this.entriesCities!=undefined && this.entriesCities.length>0){
            this.entriesCities.concat([this.company.city])
        }else{
            this.entriesCities = [this.company.city]
        }

        if(this.company.city==null||this.company.city==undefined||this.company.city==''){
            this.entriesCities = []
        }
    },
    watch: {
        name:{
            handler(){
                this.company.name = this.company.name.toUpperCase()
            }, deep:true
        },
        editedCompany:{
            handler(){
                this.e1 = 1
                this.company.name = this.editedCompany.name
                this.company.phone = this.editedCompany.phone
                this.company.email = this.editedCompany.email
                this.company.origin_id = this.editedCompany.origin_id
                this.company.status_id = this.editedCompany.status_id
                this.company.user_id = this.editedCompany.user_id
                this.company.contact_medium = this.editedCompany.contact_medium
                this.company.city = this.editedCompany.city
                this.company.special_note = this.editedCompany.special_note
                this.company.razon_social = this.editedCompany.razon_social
                this.company.rfc = this.editedCompany.rfc
                this.company.fiscal_address = this.editedCompany.fiscal_address
                this.company.agenciesId = this.editedCompany.agenciesId
                
                this.client_type = this.editedCompany.label
                
                if(this.entriesAgencies!=undefined && this.entriesAgencies.length>0){
                    this.entriesAgencies.concat(this.editedCompany.agencies)
                }else{
                    this.entriesAgencies = this.editedCompany.agencies
                }
                if(this.entriesCities!=undefined && this.entriesCities.length>0){
                    this.entriesCities.concat([this.editedCompany].map(id=>{
                        return{
                            name:id.city
                        }
                    }))
                }else{
                    this.entriesCities = [this.editedCompany].map(id=>{
                        return{
                            name:id.city
                        }
                    })
                }
            }, deep:true,
        },
        searchAgencies(val){
            //if (this.agencyLists.length > 0) return
            if (this.isLoadingAgencies) return
            this.isLoadingAgencies = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/agency/search?' + 'filter[name]='+val)// + this.$store.state.currentUser.client_filter
            .then(res => {
                if(this.entriesAgencies.length>0){
                    this.entriesAgencies.concat(res.data.data)
                }else{
                    this.entriesAgencies = res.data.data
                }
            }).finally(() => (this.isLoadingAgencies = false))
        },
        searchCities(val){
            //if (this.cityLists.length > 0) return
            if (this.isLoadingCities) return
            this.isLoadingCities = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/city/search?filter[name]='+val)
            .then(res => {
                if(res.data!=undefined){
                    if(this.entriesCities.length>0){

                        var perro = JSON.parse(JSON.stringify(this.entriesCities))
                        this.entriesCities = perro
                        console.log(perro)
                        var response = perro.concat(res.data.map(id => {return {name:id.name}}))
                        console.log(response)
                        this.entriesCities = response
                        console.log(this.entriesCities)
                    }else{
                        this.entriesCities = res.data.map(id => {return {name:id.name}})
                    }
                }
            }).finally(() => (this.isLoadingCities = false))
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
            }else{
                return false
            }
        },
        close () {
            Object.assign(this.$data, initialState());
            this.$nextTick(() => {
                this.$emit("closeDialogEditCompany", false);
            })
        },
        save () {
            if(this.company.user_id==''||this.company.user_id==undefined||this.company.user_id==null){
                this.company.user_id = this.currentUser.id
            }
            this.company.last_updated_by_user_id = this.currentUser.id
            this.company.phone = (Number(this.company.phone.replace(/\s/g, ''))).toString()
            this.gris = true
            this.$nextTick(() => {
                if(this.client_type == 'brand'){
                    axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/brands/" + this.editedCompany.id,Object.assign(this.company)).then(response=>{
                        this.close()
                        this.snackbar = {
                            message: 'Marca editada con ??xito!',
                            color: 'successful',
                            show: true
                        }
                    }).catch(error => {
                        this.gris = false
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                    })
                }else if(this.client_type == 'agency'){
                    axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/agencies/" + this.editedCompany.id,Object.assign(this.company)).then(response=>{
                        this.close()
                        this.snackbar = {
                            message: 'Agencia editada con ??xito!',
                            color: 'successful',
                            show: true
                        }
                    }).catch(error => {
                        this.gris = false
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                    })
                }
            })
            
        },
    },
}
</script>
<style lang="css" scoped>s
    .v-text-field >>> label{
        font-size: 14px!important;
    }
    .v-input__icon--prepend-inner i::before {
        font-size: 18px!important;
        color:#1976D2;
    }
    .v-text-field input, .v-label {
        font-size: 14px;
    }
    .v-text-field__details{
        display: none !important;
    }
</style>