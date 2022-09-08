

<template>       
    <v-data-table expand-icon :headers="headers" :items="modes" class="elevation-0">
        <template slot="no-data">
            No existen Medios de Contacto registrados.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editMode @closeDialogMode="closeDialogMode" v-bind:editedMode="editedItem"/>
            </v-dialog> 
        </template>
  </v-data-table>
</template>
<script>
import editMode from "../contact_mode/edit"
import axios from "axios";
export default {
    components: {
        'editMode':editMode,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Medio de Contacto', value: 'mode'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        modes:{
            get(){
                return this.$store.state.contact_mode.contact_modes;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este medio de cobntacto?')) {
                axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/contact_modes/"+id).then(response => {
                    this.$store.dispatch('contact_mode/getContactModes')
                });
            }
        },
        edit(item){
            this.editedItem = item
            this.dialog = true
        },
        closeDialogMode: function(params) {
            this.dialog = params;
            this.$store.dispatch('contact_mode/getContactModes')
        },
    },
    created(){
        this.$store.dispatch('contact_mode/getContactModes')
    },
}
</script>