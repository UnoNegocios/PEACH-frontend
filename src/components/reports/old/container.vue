<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <salesVsPast></salesVsPast>
        <br>
        <v-row>
            <v-col cols="12" md="6">
                <salesByUsers></salesByUsers>
            </v-col>
            <v-col cols="12" md="6">
                <clientsByPhase></clientsByPhase>
            </v-col>
        </v-row>
        <br>
        <v-row>
            <v-col cols="12" md="6">
                <salesAndQuotationsByOrigin></salesAndQuotationsByOrigin>
            </v-col>
            <v-col cols="12" md="6">
                <salesByOrigin></salesByOrigin>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import SalesByUsers from "../old/salesByUsers"
import SalesVsPast from "../old/salesVsPast"
import ClientsByPhase from "../old/clientsByPhase"
import SalesAndQuotationsByOrigin from "../old/salesAndQuotationsByOrigin"
import SalesByOrigin from "../old/salesByOrigin"
export default {
    components: {
        'salesByUsers':SalesByUsers,
        'salesVsPast':SalesVsPast,
        'clientsByPhase':ClientsByPhase,
        'salesAndQuotationsByOrigin':SalesAndQuotationsByOrigin,
        'salesByOrigin':SalesByOrigin
    },
}
</script>
<style>
    .apexcharts-toolbar{
        display:none!important;
    }
</style>