<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <v-card v-if="showReport" id="chart" class="pa-4 elevation-0 mx-4">
            <apexchart type="line" height="550" :options="chartOptions" :series="series"></apexchart>
        </v-card>
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
            showReport: false,
            series: [],
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'line',
                    stacked: false,
                },
                stroke: {
                    width: [0, 2, 5],//
                    curve: 'smooth'
                },
                plotOptions: {
                    bar: {
                        columnWidth: '50%'
                    }
                },
                
                fill: {
                    opacity: [0.85, 0.25, 1],
                    gradient: {
                        inverseColors: false,
                        shade: 'light',
                        type: "vertical",
                        opacityFrom: 0.85,
                        opacityTo: 0.55,
                        stops: [0, 100, 100, 100]
                    }
                },
                markers: {
                    size: 0
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (y) {
                            return y.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                        }
                    }
                },
                xaxis: {
                    type: 'string'
                },
                yaxis: {
                    labels: {
                        formatter: function (val) {
                            return val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                        },
                        style: {
                            fontSize: '13px',
                            fontWeight: 900,
                        },
                        
                    },
                },
            },
        }
    },
    created () {
        var promise_date_between = []
        var date = new Date()
        promise_date_between[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        promise_date_between[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/reports?subject=sales').then(server_resp=>{
            var response = server_resp.data.filter(r=>r.month!=null).sort(function(a,b){
                return (a.month*1) - (b.month*1)
            })
            this.series = [{
                name: 'Total',
                type: 'column',
                data: response.map(resp=>resp.total),
                //color:'black'
            }, {
                name: 'Peach',//peach_amount
                type: 'area',
                data: response.map(resp=>resp.peach_amount),
                //color:'#c67ce4'
            }, {
                name: 'Influencer',//influencer_amount
                type: 'line',
                data: response.map(resp=>resp.influencer_amount),
                //color:'#c67ce4'
            }]
            this.chartOptions.labels = response.map(resp=>this.month(resp.month))
            this.showReport = true
        })
    },
    methods:{
        month(number){
            var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return meses[(number.slice(4,6)*1)-1] + ' ' + number.slice(0,4)
        }
    }
}
</script>
