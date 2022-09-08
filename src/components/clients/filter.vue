<template>
    <v-container class="ma-0 pa-0">
        <v-row class="py-10 px-8 pb-12">
            <strong>Filtros</strong>

            <v-menu offset-y :close-on-content-click="closeDatePicker(company.created_at)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="company.created_at" label="Fecha Creación" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="company.created_at" range></v-date-picker>
            </v-menu>

            <v-menu offset-y :close-on-content-click="closeDatePicker(company.updated_at)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="company.updated_at" label="Fecha Edición" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="company.updated_at" range></v-date-picker>
            </v-menu>

            <v-autocomplete class="pb-0" v-model="company.agencies" :items="agencyLists" :loading="isLoadingAgencies" :search-input.sync="searchAgencies" hide-no-data item-value="id" item-text="name" label="Agencia(s)" placeholder="Escribe para buscar">
                <template slot="no-data"><div class="px-4 py-1">No existen agencias relacionadas.</div></template>  
            </v-autocomplete>

            <v-text-field @keydown.enter="filter()" v-model="company.name" label="Nombre"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.fiscal_address" label="Dirección"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.phone" label="Teléfono"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.email" label="Correo Electrónico"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.rfc" label="RFC"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.razon_social" label="Razón Social"></v-text-field>

            <v-select @keydown.enter="filter()" v-model="company.origins" :items="originLists" item-text="name" item-value="id" attach chips label="Procedencia" multiple>
            </v-select>

            <v-select @keydown.enter="filter()" v-model="company.statuses" :items="statusLists" item-text="name" item-value="id" attach chips label="Estatus" multiple>
            </v-select>

            <v-select @keydown.enter="filter()" v-model="company.users" :items="usersLists" item-text="name" item-value="id" attach chips label="Responsable" multiple>
            </v-select>

        </v-row>
        <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary"><!-- # d71182 -->
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
        company:{
            name:'',
            agencies:[],
            users:[],
            cities:[],
            origins:[],
            statuses:[],
            name:'',
            fiscal_address:'',
            phone:'',
            email:'',
            rfc:'',
            special_note:'',
            razon_social:'',
            created_at:[],
            updated_at:[],
        },
        entriesAgencies:[],
        isLoadingAgencies: false,
        searchAgencies:''
    }),
    watch: {
        searchAgencies(val){
            //if (this.agencyLists.length > 0) return
            if (this.isLoadingAgencies) return
            this.isLoadingAgencies = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/agency/search?filter[name]='+val)
            .then(res => {
                if(this.entriesAgencies.length>0){
                    this.entriesAgencies.concat(res.data.data)
                }else{
                    this.entriesAgencies = res.data.data
                }
            }).finally(() => (this.isLoadingAgencies = false))
        }
    },
    computed: {
        agencyLists(){
            return this.entriesAgencies.map(id => {
                return{
                    id:id.id,
                    name:id.name
                }
            })
        },
        usersLists(){
            return this.$store.state.user.users;
        },
        originLists(){
            return this.$store.state.origin.origins;
        },
        statusLists(){
            return this.$store.state.status.statuses;
        },
    },
    methods: {
        closeDatePicker(dates){
            if(dates!=null && dates.length==2){
                return true
            }else{
                return false
            }
        },
        removeFilter(){
            this.company = {
                name:'',
                agencies:[],
                users:[],
                cities:[],
                origins:[],
                statuses:[],
                fiscal_address:'',
                phone:'',
                email:'',
                rfc:'',
                special_note:'',
                razon_social:'',
                created_at:[],
                updated_at:[],
            },
            this.entriesAgencies = []
            localStorage.removeItem("selectorFiltersBrands")
            localStorage.removeItem("filtersBrands")
            localStorage.removeItem("entriesFiltersBrands")
            localStorage.removeItem("filtersBrandsLength")
            this.$nextTick(() => {
                this.$emit("filtersClients", false);
            })
        },
        filter(){
            var count = 0
            var filter = ''
            //abierto
            if(this.company.name!=''){
                count = count+1
                filter = filter + '&filter[name]='+this.company.name
            }
            if(this.company.fiscal_address!=''){
                count = count+1
                filter = filter + '&filter[fiscal_address]='+this.company.fiscal_address
            }
            if(this.company.phone!=''){
                count = count+1
                filter = filter + '&filter[phone]='+this.company.phone
            }
            if(this.company.email!=''){
                count = count+1
                filter = filter + '&filter[email]='+this.company.email
            }
            if(this.company.rfc!=''){
                count = count+1
                filter = filter + '&filter[rfc]='+this.company.rfc
            }
            if(this.company.razon_social!=''){
                count = count+1
                filter = filter + '&filter[razon_social]='+this.company.razon_social
            }
            //multiples
            if(this.company.user_id.length>0){
                count = count+1
                filter = filter + '&filter[user_id]='
                var length = this.company.user_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.company.user_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.company.agency>0){
                count = count+1
                filter = filter + '&filter[agency_id]='
                var length = this.company.agency.length
                for(var i=0; i<length; i++){
                    filter = filter + this.company.agency[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.company.cities.length>0){
                count = count+1
                filter = filter + '&filter[city_id]='
                var length = this.company.city_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.company.city_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.company.origins.length>0){
                count = count+1
                filter = filter + '&filter[origin_id]='
                var length = this.company.origin_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.company.origin_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            if(this.company.statuses.length>0){
                count = count+1
                filter = filter + '&filter[status_id]='
                var length = this.company.status_id.length
                for(var i=0; i<length; i++){
                    filter = filter + this.company.status_id[i]
                    if(length>1 && i<length-1){
                        filter = filter + ','
                    }
                }
            }
            //date
            if(this.company.created_at.length==2){
                count = count+1
                filter = filter + '&filter[created_at_between]=' + this.company.created_at[0] + ',' + this.company.created_at[1]
            }
            if(this.company.updated_at.length==2){
                count = count+1
                filter = filter + '&filter[updated_at_between]=' + this.company.updated_at[0] + ',' + this.company.updated_at[1]
            }

            //save
            localStorage.setItem('selectorFiltersBrands', JSON.stringify(this.company));
            localStorage.setItem('entriesFiltersBrands', JSON.stringify(this.entries));
            localStorage.setItem('filtersBrands', JSON.stringify(filter.slice(1,filter.length)));
            localStorage.setItem('filtersBrandsLength', count)

            this.$nextTick(() => {
                this.$emit("filterBrands", false);
            })
        }
    }
  }
</script>