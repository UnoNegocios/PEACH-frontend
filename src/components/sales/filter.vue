<template>
    <v-container class="ma-0 pa-0 pb-8">
        <v-row class="pt-10 px-8 pb-12">
            <strong>Filtros</strong>
            <v-spacer></v-spacer>
            <v-btn @click="removeFilter()" small class="elevation-0" style="border:solid 1px #dddddd;">
                <v-icon small class="mr-1">mdi-filter-off</v-icon>Limpiar
            </v-btn>

            <v-text-field label="Folio" v-model="quotation.id"></v-text-field>
            <v-text-field label="Factura" v-model="quotation.invoice"></v-text-field>

            <v-autocomplete v-model="quotation.agency" :items="agencyLists" multiple chips :loading="isLoadingAgencies" :search-input.sync="searchAgencies" hide-no-data item-value="id" item-text="name" label="Agencia(s)" placeholder="Escribe para buscar">
                <template slot="no-data"><div class="px-4 py-1">No existen agencias relacionadas.</div></template>  
            </v-autocomplete>
            
            <v-autocomplete v-model="quotation.brand" :items="brandLists" multiple chips :loading="isLoadingBrands" :search-input.sync="searchBrands" hide-no-data item-value="id" item-text="name" label="Marca(s)" placeholder="Escribe para buscar">
                <template slot="no-data"><div class="px-4 py-1">No existen marcas relacionadas.</div></template>  
            </v-autocomplete>
            <v-autocomplete v-model="quotation.influencer" :items="influencerLists" multiple chips :loading="isLoadingInfluencers" :search-input.sync="searchInfluencers" hide-no-data item-value="id" item-text="name" label="Influencer" placeholder="Escribe para buscar">
                <template slot="no-data"><div class="px-4 py-1">No existen influencers relacionadas.</div></template>  
            </v-autocomplete>

            <v-autocomplete v-model="quotation.user_id" :items="userList" hide-no-data item-value="id" item-text="name" label="Responsable(s)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>

            <v-select label="Departamento" v-model="quotation.area" item-value="value" item-text="text" :items="areas"></v-select>

            <!--v-select label="Color" v-model="quotation.color" :items="colors"></v-select-->

            <v-text-field label="Servicio" v-model="quotation.service"></v-text-field>

            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.promise_date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field clearable v-model="quotation.promise_date" label="Fecha Promesa" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.promise_date" range></v-date-picker>
            </v-menu>
            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.pay_date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field clearable v-model="quotation.pay_date" label="Fecha Pago" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.pay_date" range></v-date-picker>
            </v-menu>
            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.invoice_date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field clearable v-model="quotation.invoice_date" label="Fecha Factura" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.invoice_date" range></v-date-picker>
            </v-menu>
            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.influencer_payment_date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field clearable v-model="quotation.influencer_payment_date" label="Fecha Pago Influencer" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.influencer_payment_date" range></v-date-picker>
            </v-menu>

            <v-text-field label="Fecha de servicio" v-model="quotation.service_date"></v-text-field>

        </v-row>
        <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary">
            <v-list-item link @click="filter()" dark>
                <v-list-item-content>
                    <strong>Filtrar (0)</strong>
                </v-list-item-content>
            </v-list-item>    
        </v-card>
    </v-container>
</template>

<script>
import axios from "axios"
export default {
    data: () => ({
        areas:[{text:'Mgmt', value:false}, {text:'Booking', value:true}],
        colors:['Verde', 'Amarillo', 'Celeste'],
        quotation:{
            id:'',
            area:'',
            influencer:'',
            agency:'',
            brand:'',
            service:'',
            service_date:'',
            influencer_payment_date:[],
            invoice:'',
            invoice_date:[],
            promise_date:[],
            pay_date:[],
            user_id:''
        },
        entries:{agencies:[], brands:[], influencers:[]},
        isLoadingAgencies: false,
        isLoadingBrands: false,
        isLoadingInfluencers: false,
        searchAgencies:'',
        searchBrands:'',
        searchInfluencers:''
    }),
    watch: {
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
                        if(this.entries.influencers.length>0){
                            this.entries.influencers = res.data.data
                        }else{
                            this.entries.influencers = res.data.data
                        }
                    }).finally(() => (this.isLoadingInfluencers = false))
                }   
            },
        searchAgencies(val){
            //if (this.agencyLists.length > 0) return
            if (this.isLoadingAgencies) return
            this.isLoadingAgencies = true
            //var filter = this.$store.state.currentUser.client_filter
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/agency/search?filter[name]='+val)//+filter)
            .then(res => {
                if(this.entries.agencies.length>0){
                    this.entries.agencies.concat(res.data.data)
                }else{
                    this.entries.agencies = res.data.data
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
                if(this.entries.brands.length>0){
                    this.entries.brands.concat(res.data.data)
                }else{
                    this.entries.brands = res.data.data
                }
            }).finally(() => (this.isLoadingBrand = false))
        },
    },
    computed:{
        currentUser(){
                return this.$store.state.currentUser.user;
            },
        userList(){
            return this.$store.state.user.salesman.map(id => {
                return{
                    id:id.id,
                    name:id.name + ' ' + id.last,
                }
            })
        },
        influencerLists(){
            return this.entries.influencers.map(id => {
                return{
                    id:id.id,
                    name: id.social_networks.instagram
                }
            })
        },
        agencyLists(){
            return this.entries.agencies.map(id => {
                return{
                    id:id.id,
                    name:id.name
                }
            })
        },
        brandLists(){
            return this.entries.brands.map(id => {
                return{
                    id:id.id,
                    name:id.name
                }
            })
        },
    },
    created(){
        if(localStorage.getItem('selectorFiltersSales')!=undefined){
            this.quotation = JSON.parse(localStorage.getItem('selectorFiltersSales'))
            this.entries = JSON.parse(localStorage.getItem('entriesFiltersSales'))
            console.log(this.quotation)
        }
    },
    methods:{
        closeDatePicker(dates){
            if(dates!=null && dates.length==2){
                return true
            }else{
                return false
            }
        },
        removeFilter(){
            this.quotation={
                id:'',
                area:'',
                influencer:[],
                agency:[],
                brand:[],
                service:'',
                service_date:[],
                influencer_payment_date:[],
                invoice:'',
                invoice_date:[],
                promise_date:[],
                pay_date:[],
                user_id:'',
                color:''
            }
            this.$nextTick(() => {
                this.$emit("filtersQuotation", this.quotation);
            })
            this.entries.gencies = []
            this.entries.brands = []
            this.entries.influencers = []
            localStorage.removeItem("selectorFiltersSales")
            localStorage.removeItem("filtersSales")
            localStorage.removeItem("entriesFiltersSales")
            localStorage.removeItem("filtersSalesLength")
            this.$nextTick(() => {
                this.$store.dispatch('quotation/getTotals')
                this.$emit("filtersSale", false);
            })
        },
        filter(){
            var count = 0
            var filter = ''
            //abierto
            if(this.quotation.id!=''){
                count = count+1
                filter = filter + '&filter[id]='+this.quotation.id
            }
            if(this.quotation.invoice!=''){
                count = count+1
                filter = filter + '&filter[invoice]='+this.quotation.invoice
            }
            if(this.quotation.service!=''){
                count = count+1
                filter = filter + '&filter[services]='+this.quotation.service
            }
            if(this.quotation.service_date!=''){
                count = count+1
                filter = filter + '&filter[service_date]=' + this.quotation.service_date
            }
            //multiples
            if(this.quotation.user_id.length>0){
                count = count+1
                filter = filter + '&filter[user_id]='
                var length = this.quotation.user_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.user_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            
            if(this.quotation.influencer.length>0){
                count = count+1
                filter = filter + '&filter[influencer_id]='
                var length = this.quotation.influencer.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.influencer[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.quotation.agency.length>0){
                count = count+1
                filter = filter + '&filter[agency_id]='
                var length = this.quotation.agency.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.agency[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.quotation.brand.length>0){
                count = count+1
                filter = filter + '&filter[brand_id]='
                var length = this.quotation.brand.length
                for(var i=0; i<length; i++){
                    filter = filter + this.quotation.brand[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            //select
            if(this.quotation.area!==''){
                count = count+1
                filter = filter + '&filter[influencer.is_booking]='+this.quotation.area
            }
            /*
            if(this.quotation.color!==''){
                count = count+1
                filter = filter + '&filter[]='+this.quotation.color
            }
            */
            //date
            if(this.quotation.influencer_payment_date.length==2){
                count = count+1
                filter = filter + '&filter[influencer_payment_date_between]=' + this.quotation.influencer_payment_date[0] + ',' + this.quotation.influencer_payment_date[1]
            }
            if(this.quotation.invoice_date.length==2){
                count = count+1
                filter = filter + '&filter[invoice_date_between]=' + this.quotation.invoice_date[0] + ',' + this.quotation.invoice_date[1]
            }
            if(this.quotation.promise_date.length==2){
                count = count+1
                filter = filter + '&filter[promise_date_between]=' + this.quotation.promise_date[0] + ',' + this.quotation.promise_date[1]
            }
            if(this.quotation.pay_date.length==2){
                count = count+1
                filter = filter + '&filter[pay_date_between]=' + this.quotation.pay_date[0] + ',' + this.quotation.pay_date[1]
            }
            //save
            localStorage.setItem('selectorFiltersSales', JSON.stringify(this.quotation));
            localStorage.setItem('entriesFiltersSales', JSON.stringify(this.entries));
            localStorage.setItem('filtersSales', JSON.stringify(filter.slice(1,filter.length)));
            localStorage.setItem('filtersSalesLength', count)

            this.$nextTick(() => {
                this.$emit("filtersQuotation", false);
                this.$store.dispatch('quotation/getTotals')
            })
        }
    }
}
</script>

<style>
.v-text-field {
    padding-top: 10px;
    margin-top: 0px;
}
</style>



