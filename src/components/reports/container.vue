<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <salesByInfluencers></salesByInfluencers>
        <br>
        <v-row>
            <v-col cols="12" md="6">
                
            </v-col>
            <v-col cols="12" md="6">
                
            </v-col>
        </v-row>
        <br>
        <v-row>
            <v-col cols="12" md="6">
                
            </v-col>
            <v-col cols="12" md="6">
                
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import SalesByInfluencers from "../reports/salesByInfluencers"
export default {
    components: {
        'salesByInfluencers':SalesByInfluencers,
    },
}
</script>
