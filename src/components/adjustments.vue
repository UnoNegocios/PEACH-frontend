<template>
    <v-container>
        <v-btn @click="save()">save</v-btn>
        <v-data-table
        :items="records" 
        :headers="header"
        :options.sync="options"
        :loading="loading">
        </v-data-table>
        <!--v-menu v-model="show" offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" color="#25D366" rounded class="elevation-0" dark style="font-size:16px; letter-spacing: 0; text-transform: none!important; padding:25px 20px;">
                    <img width="24px" class="mr-2" src="https://cdn.usbrandcolors.com/images/logos/whatsapp-logo.svg"/>
                    Envía un WhatsApp
                </v-btn>
            </template>
            <v-card style="padding-bottom:28px!important;">
                <v-card-title class="py-2 px-5" style="background:#25D366; ">
                    <img width="30" class="mr-2" src="https://cdn.usbrandcolors.com/images/logos/whatsapp-logo.svg"/>
                    <span style="color:white;">WhatsApp</span>
                    <v-spacer/>
                    <v-btn @click="show = !show" icon><v-icon color="white">mdi-close</v-icon></v-btn>
                    </v-card-title>
                <v-card-subtitle class="ma-0 mt-4 pa-0" style="font-size:23px; font-weight:600; color:black; padding:0px 24px!important; margin-top:17px!important; margin-bottom:8px!important;">Completa con tus datos</v-card-subtitle>
                <v-card-text class="pa-0" style="font-size:14px; color:black; padding:0px 24px!important; margin-bottom:16px;"> Bríndanos tus datos y te contactamos de inmediato</v-card-text>
                <v-form style="padding:0px 24px;">
                    <v-text-field label="Tu nombre"></v-text-field>
                    <v-text-field label="Tu WhatsApp"></v-text-field>
                    <v-textarea label="En qué podemos ayudarte"></v-textarea>
                </v-form>
                <v-card-actions class="pa-0" style="padding:0px 24px!important;">
                    <v-btn color="#25D366" rounded class="elevation-0 py-6" dark width="100%" style="font-size:20px; letter-spacing: 0; text-transform: none!important;">Iniciar Chat</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu-->
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    data: () => ({
        show:false,
        totalCollections: 0,
        records: [],
        loading: true,
        options: {},
    }),
    computed:{
        header(){ return [
            {text: 'id', value: 'id'},
            {text: 'total', value: 'total'},
            {text: 'influencer_amount', value: 'influencer_amount'},
            {text: 'influencer_percentage', value: 'influencer_percentage'},
            {text: 'peach_percentage', value: 'peach_percentage'},
            {text: 'peach_amount', value: 'peach_amount'},
            {text: 'influencer', value: 'influencer'}
        ]},
    },
    watch: {
        options: {
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
                this.records = data.collections
                this.totalCollections = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var collections = []
                var total = 0
                var link = ''
                if(sortBy.length === 1){
                    if(sortDesc[0]){
                        link = link + "sort=-" + sortBy[0] + '&'
                    }else{
                        link = link + "sort=" + sortBy[0] + '&'
                    }
                }
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/sales" + "?itemsPerPage=186").then(response => {// + link + "page=" + page + "&itemsPerPage=" + itemsPerPage
                    collections = response.data.data.filter(id=>
                    //id.iva==0.00
                    id.influencer_amount==0.00
                    || id.influencer_amount==null
                    || id.influencer_percentage==null
                    || id.influencer_percentage===0
                    || id.peach_percentage==100
                    || ((id.peach_percentage*1)+(id.influencer_percentage*1))!=100
                    //|| ((id.subtotal*1)+(id.iva*1))!=id.total
                    ).map(id=>{
                        return{
                            id:id.id,
                            total:id.total,
                            //subtotal:id.subtotal,
                            //iva:id.iva
                            influencer_amount:id.influencer_amount,
                            influencer_percentage:id.influencer_percentage,
                            peach_percentage:id.peach_percentage,
                            peach_amount:id.peach_amount,
                            influencer:id.influencer.is_booking
                        }
                    })
                    total = response.data.meta.total
                    resolve({
                        collections,
                        total,
                    })
                })
            })
        },
        save(){
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/pez", this.records).then(resp=>{
                /*this.apiCall().then(data => {
                    this.records = data.collections
                    this.$nextTick(() => {
                        if(this.records.length>0){
                            this.save()
                        }
                    })
                })*/
            })
        }
    },
}
</script>





<!--
x no aparecen ventas de las kams en usuario de caro
x ventas aparece en 0
x jacky no le deja guardar porque no le salen agencias ni marcas
ventas de booking al poner comision y monto influencer se pone 100% peach 
saber cuanto se les ha pagado a las influencers
-->