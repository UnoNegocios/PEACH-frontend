<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <v-row v-if="showReport" id="chart" style="background:white;" class="pa-12 elevation-0 mx-4">
            <apexchart type="pie" width="500" :options="chartOptions" :series="series"></apexchart>
            
            <v-card v-for="(card, index) in cards" :key="index" class="ml-12 px-4 elevation-0" style="border:solid 2px #d6d7dd;">
                <v-card-subtitle style="color:black;">
                    <v-icon x-small :color="chartOptions.colors[index]" class="mr-1">mdi-record</v-icon> 
                    <storng>{{chartOptions.labels[index]}}</storng>
                </v-card-subtitle>
                <v-card-subtitle class="pb-0">PEACH</v-card-subtitle>
                <v-card-title class="pt-0 mb-6">
                    {{card.peach_amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                </v-card-title>
                
                <v-card-subtitle class="pb-0">Influencer</v-card-subtitle>
                <v-card-title class="pt-0 mb-6">
                    {{card.influencer_amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                </v-card-title>
                
                <v-card-subtitle class="pb-0">Total</v-card-subtitle>
                <v-card-title class="pt-0">
                    {{(card.peach_amount+card.influencer_amount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                </v-card-title>
            </v-card>
        </v-row>
        <v-row class="ma-0 pt-12 mt-12" v-else>
            <v-spacer/>
                <div style="text-align:center;">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    <br/>
                    <v-card-title>Cargando...</v-card-title>
                </div>
            <v-spacer/>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios"
export default {
    data: function () {
        return {
            cards:[],
            showReport:false,
            series: [],
            chartOptions: {
                colors: ['black', '#c67ce4'],
                yaxis: {
                    categories: [],
                    labels: {
                        formatter: function (val) {
                            return val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                        },
                        style: {
                            fontSize: '21px',
                            fontWeight: 900,
                        },
                        
                    },
                    tickPlacement: 'on'
                },
                labels: ['Managment', 'Booking'],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                        width: 200
                        },
                        legend: {
                        position: 'bottom'
                        }
                    }
                }]
            }
        }
    },
    created () {
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/reports?subject=departments').then(response=>{
            console.log(response)
            this.series = [(response.data.management.influencer_amount+response.data.management.peach_amount),(response.data.booking.influencer_amount+response.data.booking.peach_amount)]
            this.cards = [
                response.data.management,
                response.data.booking
            ]
            this.showReport = true
        })
    },
    
}
</script>