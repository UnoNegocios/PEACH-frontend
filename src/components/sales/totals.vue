<template>
    <v-row class="ma-0 mb-4" v-if="loading">
        <v-col md="2" sm="6" class="px-2" v-for="(loader, index) in loaders" v-bind:key="index">
            <v-card class="pb-2 pt-3 px-4 elevation-0">
                <v-skeleton-loader type="text" width="40%"></v-skeleton-loader>
                <v-skeleton-loader type="text" width="80%"></v-skeleton-loader>
                <v-skeleton-loader type="text" width="80%"></v-skeleton-loader>
            </v-card>
        </v-col>
    </v-row>
    <v-row class="ma-0" v-else>
        <v-col md="2" sm="6" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#47bdc6" class="mr-1">mdi-record</v-icon> 
                <span style="font-size:12px;"><strong>Subtotal</strong></span>
                <br/>{{(totals.sum_subtotal*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.subtotal_avg*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </v-col>
        <v-col md="2" sm="6" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#ff6d00" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>IVA</strong></span>
                <br/>{{(totals.sum_iva*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.iva_avg*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </v-col>
        <v-col md="2" sm="6" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#4385f3" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Total</strong></span>
                <br/>{{(totals.sum_total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.total_avg*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </v-col>
        <v-col md="2" sm="6" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#33a952" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Peach</strong></span>
                <br/>{{(totals.sum_peach_revenue*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.peach_revenue_avg*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </v-col>
        <v-col md="2" sm="6" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#fbbc04" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Influencer(s)</strong></span>
                <br/>{{(totals.sum_inlfuencer_payments*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.inlfuencer_payments_avg*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </v-col>
                


        <!--v-col md="2" sm="6" class="px-2">
            <v-card class="py-2 px-4 elevation-0">
                <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                <span style="font-size:12px;"><strong>Cobranza Vencida</strong></span>
                <br/>{{(totals.sum_past_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_past_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
            </v-card>
        </v-col-->
    </v-row>
</template>

<script>
import axios from "axios"
export default {
    props:{
        totalsFilters:Object,
    },
    data: () => ({
        loaders:['loader-1', 'loader-2', 'loader-3', 'loader-4', 'loader-5', 'loader-6'],
        count:0,
        more:'',
        loading:true,
        totals:[]
    }),
    computed:{
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        }
    },
    watch: {
        totalsFilters: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods:{
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.totals = data
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                var startDate = []
                var date = new Date()
                startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                var link = this.$store.state.currentUser.sale_filter
                if(this.totalsFilters.selectedStatus!=undefined&&this.totalsFilters.selectedStatus!='all'){
                    link = link + 'filter[' + this.totalsFilters.selectedStatus + ']=1&'
                }
                if(this.$route.params.brand_id){
                    link = link + 'filter[brand_id]=' + this.$route.params.brand_id + '&'
                }
                if(this.$route.params.agency_id){
                    link = link + 'filter[agency_id]=' + this.$route.params.agency_id + '&'
                }
                if(this.$route.params.influencer_id){
                    link = link + 'filter[influencer_id]=' + this.$route.params.influencer_id + '&'
                }
                if(localStorage.getItem('filtersSales')==undefined&&localStorage.getItem('filtersSales')==null){
                    axios
                    .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/totals/sales?"+link)//+'?filter[date_between]='+startDate)
                    .then(response => {
                        resolve(response.data)
                    });
                }else{
                    axios
                    .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/totals/sales?"+ JSON.parse(localStorage.getItem('filtersSales'))+'&'+link)
                    .then(response=>{
                        resolve(response.data)
                    })
                }
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
            }else{
                return false
            }
        },      
    }
}
</script>
<style>
.botonPerron {
    background: white;
    border-radius: 5px;
    height: 25px!important;
    margin-bottom: -17px;
    width: 90px!important;
}
.hover-size{
    height:72px;
}
.hover-size:hover{
    height:168px;
}
</style>