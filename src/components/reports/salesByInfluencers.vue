<template>
        <v-card v-if="showReport" id="chart" class="pa-4 elevation-0 mx-4">
            <apexchart type="bar" :height="height" :options="chartOptions" :series="series"></apexchart>
        </v-card>
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
                    text: 'Ventas por Influencer'
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
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/reports').then(response=>{
            var reports = response.data.sort(function(a,b){
                return ((b.peach_amount*1) + (b.influencer_amount*1)) - ((a.peach_amount*1) + (a.influencer_amount*1))
            })
            this.series[0].data = reports.map(influencer=>influencer.peach_amount*1)
            this.series[1].data = reports.map(influencer=>influencer.influencer_amount*1)
            this.chartOptions.xaxis.categories = reports.map(influencer=>influencer.influencer.social_networks.instagram)
            this.showReport = true
        })
    },
    computed: {
        height(){
            return (40 * this.chartOptions.xaxis.categories.length) + 'px'
        }
    },
    methods:{
        
    },
}
</script>
<style>