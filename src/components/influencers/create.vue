<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Añadir Influencer
            <v-spacer></v-spacer>
            <v-select class="mr-6 ml-12" v-show="permissions('assignInfluencers')" v-model="editedItem.parent_id" :items="talentsAgentList" item-value="id" item-text="name" label="Talent Agent"></v-select>
            <v-select class="mr-6" v-model="editedItem.is_booking" :items="bookingList" label="Tipo"></v-select>
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <!--v-stepper v-model="e1" class="elevation-0">
                <v-stepper-header class="elevation-0">
                    <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 1" step="1"></v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step style="font-weight:bolder!important;" step="2"></v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                    <v-stepper-content step="1" class="pt-0"-->
                        <v-row class="py-3 px-6"> 
                            <v-col cols="12" sm="6" md="6" class="py-0">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="py-0">
                                <v-text-field v-model="editedItem.last" label="Apellido"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="6" class="py-0">
                                <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="py-0">
                                <v-text-field v-model="editedItem.phone" label="Teléfono"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="py-0">
                                <v-select v-model="state" :items="statesList" item-value="id" item-text="name" label="Estado"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="py-0">
                                <v-select :disabled="state==undefined || state=='' || state==null" v-model="editedItem.city" :items="citiesList" item-value="id" item-text="name" label="Ciudad"></v-select>
                            </v-col>
                            <!--v-col cols="12" sm="6" md="6" class="py-0">
                                <v-text-field prefix="@" v-model="editedItem.social_networks.facebook" label="Facebook"></v-text-field>
                            </v-col-->
                            <v-col cols="12" sm="6" md="6" class="py-0">
                                <v-text-field prefix="@" v-model="editedItem.social_networks.instagram" label="Instagram"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="py-0">
                                <v-text-field prefix="@" v-model="editedItem.social_networks.tiktok" label="TikTok"></v-text-field>
                            </v-col>
                            <!--v-col cols="12" sm="6" md="6" class="py-0">
                                <v-text-field prefix="@" v-model="editedItem.social_networks.twitter" label="Twitter"></v-text-field>
                            </v-col-->
                            <v-col cols="12" sm="4" md="3" class="py-0">
                                <v-text-field v-model="editedItem.bank_account_details.bank" label="Banco"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="3" class="py-0">
                                <v-text-field v-model="editedItem.bank_account_details.account" label="Numero de Cuenta"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="3" class="py-0">
                                <v-text-field v-model="editedItem.bank_account_details.clabe" label="Clabe Interbancaria"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="3" class="py-0">
                                <v-text-field v-model="editedItem.bank_account_details.tarejta" label="Tarjeta"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="4" md="6" class="py-0">
                                <v-text-field v-model="editedItem.commission_percentage" suffix="%" label="Porcentaje Comisión" v-if="!editedItem.is_booking"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="4" md="6" class="py-0">
                                <v-autocomplete class="mb-0 pb-0" v-model="editedItem.categories" small-chips :items="categories" item-value="id" item-text="name" label="Categoría(s)" multiple chips></v-autocomplete>
                            </v-col>


                        </v-row>
                    <!--/v-stepper-content>
                    <v-stepper-content step="2" class="pt-0">
                        Servicios
                        <v-row style="background-color: #94949417;" class="px-2 ma-0 py-2 mt-2" v-for="(service,k) in editedItem.services" :key="k">
                            <v-col ols="12" sm ="8" md="6" class="py-0 my-0">
                                <v-text-field v-model="service.service" label="Servicio"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm ="8" md="4" class="py-0 my-0">
                                <v-text-field v-model="service.price" prefix="$" suffix="c/u" label="Precio"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm ="4" md="2">
                                <v-icon @click="remove(k)" v-show="k || ( !k && editedItem.services.length > 1)" color="red">mdi-close</v-icon>
                                <v-icon @click="add(k)" v-show="k == editedItem.services.length-1" color="primary">mdi-plus</v-icon>
                            </v-col>
                        </v-row>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper-->
        </v-form>
        

        <v-card-actions class="pt-4">
            
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <!--v-btn color="blue darken-1" text  v-if="e1>1" @click="e1 = e1-1">
                <v-icon v-if="!isMobile()">mdi-chevron-left</v-icon>
                Regresar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1!=2" @click="e1 = e1+1">
                Siguiente
                <v-icon v-if="!isMobile()">mdi-chevron-right</v-icon>
            </v-btn-->
            <v-btn color="blue darken-1" text :disabled="valid" @click="save">
                Guardar
            </v-btn>
        </v-card-actions>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show" style="text-align:center;">
            <strong>{{ snackbar.message }}</strong>
        </v-snackbar>

    </v-card>
</template>
<script>
import axios from "axios";
export default {
    data:()=>({ 
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        bookingList:[{text:'Booking', value:true},{text:'Mgmt', value:false}], 
        //e1: 1,
        disable:'',
        editedItem: {
            categories:[],
            parent_id:'',
            name:'',
            last:'',
            email:'',
            phone:'',
            status:'',
            state:'',
            city:'',
            password:'',
            is_booking:false,
            social_networks:{
                instagram:'',
                tiktok:'',
            },
            bank_account_details:{
                bank:'',
                account:'',
                clabe:'',
                card:''
            },
        },
        state:'',
        citiesList:[]
    }),
    mounted(){
        this.$store.dispatch('state/getStates')
    },
    watch: {
        state: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    computed:{
        categories(){
            return this.$store.state.category.categories
        },
        valid(){
            if(this.editedItem.name!=''){
                return false
            }else{
                return true
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        statesList(){
            return this.$store.state.state.states
        },
        talentsAgentList(){
            if(this.editedItem.is_booking){
                return this.$store.state.user.users.filter(user=>user.role == 'Booking' || user.role == 'Booking Manager')
            }else{
                return this.$store.state.user.users.filter(user=>user.role == 'Talent Agent' || user.role == 'Talent Agent Manager')
            }
        },
    },
    methods:{
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
        getDataFromApi(){
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/cities?state_id=" + this.state).then(response => {
                this.citiesList = response.data
            })
        },
        isMobile() {
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true
            } else {
                return false
            }
        },
        close () {
            this.gris = false
            
            this.editedItem.parent_id=''
            this.editedItem.name=''
            this.editedItem.last=''
            this.editedItem.email=''
            this.editedItem.job_position=''
            this.editedItem.phone=''
            this.editedItem.status=''
            this.editedItem.state=''
            this.editedItem.city=''
            this.editedItem.password=''
            this.editedItem.avatar=''
            this.editedItem.categories=''

            this.editedItem.is_booking=false

            this.editedItem.social_networks={
                instagram:'',
                tiktok:''
            }
            this.editedItem.bank_account_details={
                bank:'',
                account:'',
                clabe:'',
                card:''
            }
            /*
            this.editedItem.services={
                service:'',
                value:'',
            }
            */
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {
            if(this.editedItem.parent_id==''){
                this.editedItem.parent_id = this.currentUser.id
            }
            this.editedItem.state = this.state
            this.editedItem.role = 'Influencer'
            this.editedItem.status=1
            this.gris = true
            this.$nextTick(() => {
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencers",Object.assign(this.editedItem)).then(response=>{
                    this.snackbar = {
                        message: 'Influencer creado(a) con éxito!',
                        color: 'successful',
                        show: true
                    }
                    this.close()
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.errors.email[0],
                        color: 'error',
                        show: true
                    }
                })
            })
        },
    }
}
</script>