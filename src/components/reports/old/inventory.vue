<template>
    <v-container style="max-width:100vw;">
        <!-- Contenedor -->
        <v-data-table :headers="headers" :items="inventory" sort-by="date" class="elevation-0 px-6 py-4"></v-data-table>
    </v-container>
</template>

<script>
export default {
    computed: {
        headers(){ 
            return [
            { text: 'Cantidad', value: 'quantity' },
        ]},
        inventory(){
            return this.$store.state.inventory.inventories
        },
    }
}
</script>