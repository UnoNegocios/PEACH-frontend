

<template>       
    <v-data-table expand-icon :headers="headers" :items="rejections" class="elevation-0">
        <template slot="no-data">
            No existen motivos de rechazo registrados.
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editRejection @closeDialogRejection="closeDialogRejection" v-bind:editedRejection="editedItem"/>
            </v-dialog> 
        </template>
  </v-data-table>
</template>
<script>
import editRejection from "../rejections/edit"
import axios from "axios";
export default {
    components: {
        'editRejection':editRejection,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Motivo de Rechazo', value: 'name'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        rejections:{
            get(){
                return this.$store.state.rejection.rejections;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este motivo de rechazo?')) {
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/rejections/"+id).then(response => {
                this.$store.dispatch('rejection/getRejections')
            });
            }
        },
        edit(item){
            this.editedItem = item
            this.dialog = true
        },
        closeDialogRejection: function(params) {
            this.dialog = params;
            this.$store.dispatch('rejection/getRejections')
        },
    },
    created(){
        this.$store.dispatch('rejection/getRejections')
    },
}
</script>