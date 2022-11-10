<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <v-card v-if="showReport" id="chart" class="pa-4 elevation-0 mx-4">
            <apexchart type="bar" height="600" :options="chartOptions" :series="series"></apexchart>
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
                        horizontal: false,
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
                colors: ['black', '#c67ce4'],
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
                    text: 'Ventas por Responsable'
                },
                yaxis: {
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
                xaxis: {
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
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/reports?subject=agents&include=agent').then(response=>{
            var reports = response.data.sort(function(a,b){
                return ((b.peach_amount*1) + (b.influencer_amount*1)) - ((a.peach_amount*1) + (a.influencer_amount*1))
            })
            this.series[0].data = reports.map(user=>user.peach_amount*1)
            this.series[1].data = reports.map(user=>user.influencer_amount*1)
            this.chartOptions.xaxis.categories = reports.map(user=>this.name(user.agent))
            this.showReport = true
        })
    },
    methods:{
        name(user){
            if(user.last!=undefined){
                return user.name + ' ' + user.last
            }else{
                return user.name
            }
        }
    },
}
</script>
<style>