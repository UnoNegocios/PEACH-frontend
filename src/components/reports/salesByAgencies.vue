<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <v-row class="my-0 mx-4 px-12 pt-4" style="background:white;">
            <v-card-title>Ventas por Agencia</v-card-title>
            <v-spacer/>
            <v-menu offset-y :close-on-content-click="closeDatePicker(date_filter)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field style="max-width:280px;" class="mt-5" outlined dense clearable v-model="date_filter" label="Fecha Promesa" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="date_filter" range></v-date-picker>
            </v-menu>
        </v-row>
        <v-card v-if="showReport" id="chart" class="pa-4 elevation-0 mx-4">
            <apexchart type="bar" :height="height" :options="chartOptions" :series="series"></apexchart>
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
            date_filter:[],
            showReport: false,
            series: [{
                name: 'Monto Peach',
                data: []
            }, {
                name: 'Monto Influencer',
                data: []
            }],
            chartOptions: {
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                    zoom: {
                        enabled: true,
                        type: 'x',  
                        autoScaleYaxis: false,  
                        zoomedArea: {
                            fill: {
                                color: '#90CAF9',
                                opacity: 0.4
                            },
                            stroke: {
                                color: '#0D47A1',
                                opacity: 0.4,
                                width: 1
                            }
                        }
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels: {
                            total: {
                                enabled: true,
                                offsetX: 50,
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 900,
                                }
                            }
                        }
                    },
                },
                //colors: ['black', '#c67ce4'],
                dataLabels: {
                    formatter: function (val) {
                        return val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                    },
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                title: {
                    text: ''
                },
                xaxis: {
                    categories: [],
                    labels: {
                        formatter: function (val) {
                            return val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                        },
                        style: {
                            fontSize: '13px',
                            fontWeight: 900,
                        },
                        
                    },
                    tickPlacement: 'on'
                },
                yaxis: {
                    title: {
                        text: undefined
                    },
                    labels:{
                        style: {
                            fontSize: '13px',
                            fontWeight: 900,
                        }
                    }
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40
                }
            }

        }
    },
    created () {
        var promise_date_between = []
        var date = new Date()
        promise_date_between[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        promise_date_between[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        this.date_filter = promise_date_between
    },
    computed: {
        height(){
            return (40 * this.chartOptions.xaxis.categories.length) + 'px'
        }
    },
    watch:{
        date_filter:{
            handler(){
                if(this.date_filter!=null && this.date_filter.length==2){
                    this.showReport = false
                    axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/reports?subject=agencies&include=agency&filter[promise_date_between]='+this.date_filter).then(response=>{
                        var reports = response.data.sort(function(a,b){
                            return ((b.peach_amount*1) + (b.influencer_amount*1)) - ((a.peach_amount*1) + (a.influencer_amount*1))
                        }).filter(report=>report.agency_id != null)
                        this.series[0].data = reports.map(agency=>agency.peach_amount*1)
                        this.series[1].data = reports.map(agency=>agency.influencer_amount*1)
                        this.chartOptions.xaxis.categories = reports.map(agency=>agency.agency.name)
                        this.showReport = true
                    })
                }
            },deep:true
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
    },
}
</script>
<style>