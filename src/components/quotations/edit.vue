<template>
    <v-card>
        <v-card-title class="pb-0 pt-1" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span >Editar {{quole}}</span>
            <v-spacer></v-spacer>
            <!--v-col cols="12" sm="6" md="2" class="pb-0 mb-0">
                <v-radio-group v-model="type" class="my-0">
                    <v-radio label="Agencia" color="primary" value="agency"></v-radio>
                    <v-radio label="Marca" color="primary" value="brand"></v-radio>
                </v-radio-group>
            </v-col-->
            <v-col cols="12" sm="6" md="3">
                <v-autocomplete  :rules="[v => !!v || 'Campo requerido']" v-if="permissions('assignSales')" clearable v-model="quotation.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
                <v-autocomplete v-else disabled v-model="quotation.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">                
                </v-autocomplete>
            </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0 mb-0">
            <v-container>
                <v-row class="pt-5 pb-0">
                    <v-col class="pt-0" cols="12" sm="6" md="9">
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-autocomplete v-model="quotation.agency_id" :items="agencyLists" :loading="isLoadingAgencies" :search-input.sync="searchAgencies" hide-no-data item-value="id" item-text="name" label="Agencia(s)" placeholder="Escribe para buscar">
                                    <template slot="no-data"><div class="px-4 py-1">No existen agencias relacionadas.</div></template>  
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-autocomplete v-model="quotation.brand_id" :items="brandLists" :loading="isLoadingBrands" :search-input.sync="searchBrands" hide-no-data item-value="id" item-text="name" label="Marca(s)" placeholder="Escribe para buscar">
                                    <template slot="no-data"><div class="px-4 py-1">No existen marcas relacionadas.</div></template>  
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-col> 
                    <v-col class="pt-0" cols="12" sm="6" md="3">
                        <v-autocomplete clearable v-model="quotation.sale_type" :items="series" label="Tipo de Venta">
                            <template slot="no-data" class="pa-2">No existen tipos de venta relacionados.</template>                      
                        </v-autocomplete>
                    </v-col>
                </v-row>  
                <v-row style="background-color: #94949417;" class="px-8 ma-0 pb-3 pt-0 mb-0">
                    <v-col cols="12" sm ="4" md="4" class="pl-0">
                        <v-autocomplete v-model="quotation.influencer_id" :items="influencerLists" :loading="isLoadingInfluencers" :search-input.sync="searchInfluencers" hide-no-data item-value="id" item-text="name" label="Influencer(s)" placeholder="Escribe para buscar">
                            <template slot="no-data"><div class="px-4 py-1">No existen influencers relacionadas.</div></template>  
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm ="8" md="4">
                        <v-text-field v-model="quotation.influencer_amount" prefix="$" :disabled="quotation.total==0" label="Comisión"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm ="8" md="4">
                        <v-text-field v-model="quotation.campaign" label="Campaña"></v-text-field>
                    </v-col>

                    

                    <v-row class="mb-2">
                        <v-col ols="12" sm ="8" md="4" class="py-1 my-0">
                            <v-text-field v-model="quotation.service_date" label="Fecha de Servicio"></v-text-field>
                        </v-col>
                        <v-col ols="12" sm ="8" md="4" class="py-1 my-0">
                            <v-text-field v-model="quotation.service" :disabled="quotation.influencer_id==''" label="Servicio"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm ="8" md="4" class="py-1 my-0">
                            <v-text-field v-model="quotation.total" :disabled="quotation.influencer_id==''" type="number" prefix="$" suffix="c/u" label="Precio (con IVA)"></v-text-field>
                        </v-col>
                    </v-row>
                </v-row>
                <v-row class="mt-0 px-6">
                    <v-col cols="12" sm="6" md="6" class="mt-0 pt-0">
                        <v-container fluid>
                            <v-textarea v-model="quotation.description" label="Descripcion"></v-textarea>
                        </v-container>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="mt-0 pt-0">
                        <v-text-field v-model="quotation.invoice" label="Factura"></v-text-field>
                        <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.invoice_date" label="Fecha de Facturación" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker color="primary" v-model="quotation.invoice_date" @input="datePicker = false"></v-date-picker>
                        </v-menu>
                        <v-menu v-model="datePicker2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" required v-model="quotation.payment_promise_date" label="Fecha Promesa de Pago" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker color="primary" v-model="quotation.payment_promise_date" @input="datePicker = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-row class="ma-0 pa-0 mt-0 pt-0">
            <v-col cols="12" sm="12" md="6" class="mt-0 pt-0">
                <v-menu top offset-x class="hidden-md-and-down">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn style="font-size:12px;" text v-bind="attrs" v-on="on">
                            <v-icon class="mr-2">mdi-attachment</v-icon> 
                        </v-btn>
                    </template>
                    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
                </v-menu>
            </v-col>
            <v-col cols="12" sm="12" md="6" class="mt-0 pt-0">
                <v-card-actions>
                    <v-spacer class="hidden-md-and-down"></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save" :disabled="gris || gris2">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show" style="text-align:center;">
            <strong>{{ snackbar.message }}</strong>
        </v-snackbar>
    </v-card>
</template>



<script>
const initialState = () => {
    return {
        quotation:{},
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris2:false,
        pause:false,
        company:'',
        status:'',
        datePicker:'',
        datePicker2:false,
        dropzoneOptions: {
            url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/files",
            addRemoveLinks: true,
            maxFiles: 1
        },
        series:[{text:'Con Factura', value:'Serie A'}, {text:'Sin Factura', value:'Serie B'}],
        rules: {
            required: value => !!value || 'Campo requerido',
        },
        valid: true,
        entriesAgencies:[],
        entriesBrands:[],
        entriesInfluencers:[],
        isLoadingAgencies: false,
        isLoadingBrands: false,
        isLoadingInfluencers: false,
        searchAgencies:'',
        searchBrands:'',
        searchInfluencers:''
    }
}

import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import CreateContact from "../clients/contacts/create"
import CreateCompany from "../clients/companies/create"
import axios from "axios";

    export default {
        props:{
            editedQuotation:Object
        }, 
        created(){
            this.quotation={
                brand_id:this.editedQuotation.brand_id,
                agency_id:this.editedQuotation.agency_id,
                user_id:this.editedQuotation.user_id,
                pdf:this.editedQuotation.pdf,
                description:this.editedQuotation.description,
                sale_status:this.editedQuotation.sale_status,
                sale_type:this.editedQuotation.sale_type,
                invoice:this.editedQuotation.invoice,
                created_by_user_id:this.editedQuotation.created_by_user_id,
                last_updated_by_user_id:this.editedQuotation.last_updated_by_user_id,
                influencer_id:this.editedQuotation.influencer_id,
                service_date:this.editedQuotation.service_date,
                service:this.editedQuotation.service,
                total:this.editedQuotation.total*1,
                influencer_amount:this.editedQuotation.influencer_amount*1,
                campaign:this.editedQuotation.campaign,
                invoice_date:this.editedQuotation.invoice_date,
                payment_promise_date:this.editedQuotation.payment_promise_date,

            }
        },
        components: {
            vueDropzone: vue2Dropzone,
            'createContact':CreateContact,
            'createCompany':CreateCompany,
        },   
        data: () => ( initialState() ),
        watch: {
            influencer:{
                handler: function (val, oldVal) {
                    if((val*1)!=(oldVal*1)){
                        var commission_percentage = this.entriesInfluencers.filter(influencer=>influencer.id == this.influencer).map(influencer=>influencer.commission_percentage)[0]*1
                        this.quotation.influencer_amount = (((this.quotation.total/1.16)/100)*commission_percentage).toFixed(2)
                    }
                },
                deep: true,
            },
            total:{
                handler: function (val, oldVal) {
                    if((val*1)!=(oldVal*1)){
                        var commission_percentage = this.entriesInfluencers.concat([this.editedQuotation.influencer]).filter(influencer=>influencer.id == this.influencer).map(influencer=>influencer.commission_percentage)[0]*1

                        if(commission_percentage!==0){
                            this.quotation.influencer_amount = (((this.quotation.total/1.16)/100)*commission_percentage).toFixed(2)
                        }
                    }
                    
                },
                deep: true,
            },
            editedQuotation:{
                handler(){
                    this.quotation = {
                        brand_id:this.editedQuotation.brand_id,
                        agency_id:this.editedQuotation.agency_id,
                        user_id:this.editedQuotation.user_id,
                        pdf:this.editedQuotation.pdf,
                        description:this.editedQuotation.description,
                        sale_status:this.editedQuotation.sale_status,
                        sale_type:this.editedQuotation.sale_type,
                        invoice:this.editedQuotation.invoice,
                        created_by_user_id:this.editedQuotation.created_by_user_id,
                        last_updated_by_user_id:this.editedQuotation.last_updated_by_user_id,
                        influencer_id:this.editedQuotation.influencer_id,
                        service_date:this.editedQuotation.service_date,
                        service:this.editedQuotation.service,
                        total:this.editedQuotation.total*1,
                        influencer_amount:this.editedQuotation.influencer_amount*1,
                        campaign:this.editedQuotation.campaign,
                        invoice_date:this.editedQuotation.invoice_date,
                        payment_promise_date:this.editedQuotation.payment_promise_date,

                    }
                    if(this.editedQuotation.influencer!=undefined){
                        this.entriesInfluencers = [this.editedQuotation.influencer]
                    }
                    if(this.editedQuotation.agency!=undefined){
                        this.entriesAgencies = [this.editedQuotation.agency]
                    }
                    if(this.editedQuotation.brand!=undefined){
                        this.entriesBrands = [this.editedQuotation.brand]
                    }
                }, deep:true,
            },
            searchInfluencers(val){
                if(val!=null){
                    var link = ''
                    if(this.currentUser.role == 'Talent Agent' || this.currentUser.role == 'Booking'){
                        link = '&filter[parent_id]=' + this.currentUser.id
                    }
                    //if (this.influencerLists.length > 0) return
                    if (this.isLoadingInfluencers) return
                    this.isLoadingInfluencers = true
                    axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/influencer/search?filter[social_networks]='+val+link)
                    .then(res => {
                        if(this.entriesInfluencers.length>0){
                            this.entriesInfluencers.concat(res.data.data)
                        }else{
                            this.entriesInfluencers = res.data.data
                        }
                    }).finally(() => (this.isLoadingInfluencers = false))
                }   
            },
            searchAgencies(val){
                if (this.isLoadingAgencies) return
                this.isLoadingAgencies = true
                //var filter = this.$store.state.currentUser.client_filter
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/agency/search?filter[name]='+val)//+filter)
                .then(res => {
                    console.log(this.entriesAgencies)
                    if(this.entriesAgencies.length>0){
                        this.entriesAgencies.concat(res.data.data)
                    }else{
                        this.entriesAgencies = res.data.data
                    }
                }).finally(() => (this.isLoadingAgencies = false))
            },
            searchBrands(val){
                if (this.isLoadingBrand) return
                this.isLoadingBrand = true
                var filter = ''
                if(this.quotation.agency_id!=null){
                    filter = '?filter[agencies.id]=' + this.quotation.agency_id + '&'
                }
                //var filter2 = this.$store.state.currentUser.client_filter
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/brand/search?' + filter + "filter[name]=" + val)// + filter2
                .then(res => {
                    if(this.entriesBrands.length>0){
                        this.entriesBrands.concat(res.data.data)
                    }else{
                        this.entriesBrands = res.data.data
                    }
                }).finally(() => (this.isLoadingBrand = false))
            },
        },
        computed: {
            influencer(){
                return this.quotation.influencer_id
            },
            total(){
                return this.quotation.total
            },
            gris(){
                if(this.quotation.influencer_id==''||(this.quotation.brand_id==null&&this.quotation.agency_id==null)||this.quotation.payment_promise_date==''){
                    return true
                }else{
                    return false
                }
            },
            influencerLists(){
                var perro = this.entriesInfluencers.map(id=>{
                    return{
                        id:id.id,
                        name: id.social_networks.instagram,
                        is_booking: id.is_booking
                    }
                })/*.concat([this.editedQuotation.influencer].map(id=>{
                    return{
                        id:id.id,
                        name: id.social_networks.instagram,
                        is_booking: id.is_booking
                    }
                }))*/
                return perro 
            },
            agencyLists(){
                this.pause = true
                return this.entriesAgencies.map(id => {
                    return{
                        id:id.id,
                        name:id.name
                    }
                })/*.concat(this.editedQuotation.agency).map(id => {
                    return{
                        id:id.id,
                        name:id.name
                    }
                })*/
            },
            brandLists(){
                return this.entriesBrands.map(id => {
                    return{
                        id:id.id,
                        name:id.name
                    }
                })//.concat(this.editedQuotation.brand)
            },
            usersLists(){
                return this.$store.state.user.salesman;
            }, 
            currentUser:{
                get(){
                    return this.$store.state.currentUser.user
                }
            },
            quole(){
                if(this.status=='vendido'){
                    return 'Venta'
                }else if(this.status=='quotation'){
                    return 'Cotización'
                } 
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
            uploadSuccess(file, response) {
                console.log('File Successfully Uploaded with file name: ' + response.file);
                this.fileName = response.file;
                this.quotation.pdf = this.fileName;
            },
            uploadError(file, message) {
                console.log('An Error Occurred');
            },
            fileRemoved() {
                
            },
            close () {
                Object.assign(this.$data, initialState());
                this.$nextTick(() => {
                    this.$emit("closeDialogEditQuotation", false);
                })
            },
            save(){
                this.gris2 = true
                this.quotation.last_updated_by_user_id = this.currentUser.id
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/sales/"+this.editedQuotation.id, this.quotation).then(response=>{
                    this.close()
                    this.snackbar = {
                        message: 'Venta editada con éxito!',
                        color: 'successful',
                        show: true
                    }
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            },
        },
}
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
</style>
<style>
.v-input__icon--prepend-inner i::before {
    font-size: 18px!important;
    color:#1976D2;
}
.v-text-field input, .v-label {
    font-size: 14px;
}
.v-picker__title.primary{
    display:none;
}
</style>