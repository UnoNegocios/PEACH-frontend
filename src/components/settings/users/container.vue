

<template>
    <div class="padding1" style="background:#f4f5fa; min-height:80vh;">  
        <v-card v-if="info==true" style="background:transparent;" class="elevation-0 pb-6 px-7">
            <v-card-text class="py-3 px-6" style="background:#1976d1; color:white; border-radius: 5px;">
                <v-icon color="white" small class="mr-2">mdi-information-outline</v-icon>
                Lorem ipsum dolor sit amet consectetur adipiscing elit massa imperdiet, mauris tortor platea fringilla sodales ac magna sociosqu, natoque non rutrum nec auctor vestibulum congue eget. 
                <v-icon style="position:absolute!important; top:7px; right:30px;" color="white" @click="info=false" small class="mr-2">mdi-close</v-icon>
            </v-card-text>
        </v-card> 
        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;">Usuarios
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="createDialog=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <v-data-table expand-icon :headers="headers" :items="users" class="elevation-0">
                <template slot="no-data">
                    No existen procedencias registradas.
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                    <strong :style="'color:'+item.color+';'"> {{item.name}} {{item.last}}</strong>
                </template>
                <template v-slot:[`item.status`]="{ item }">
                    {{status(item.status)}}
                </template>
                <template v-slot:[`item.permissions`]="{ item }">
                    <div style="min-width:200px!important;">
                        <v-chip x-small v-for="(permission,i) in item.permissions" :key="i" class="my-0 mx-1 px-1" color="primary" text-color="white">
                            {{permissionText(permission)}}
                        </v-chip>
                    </div>
                </template>
            </v-data-table>
            <v-dialog v-model="editDialog" max-width="600px">
                <editItem @closeDialogItem="closeDialogItem" v-bind:editedItem="editedItem"/>
            </v-dialog> 
            <v-dialog v-model="createDialog" max-width="600px">
                <createItem @closeDialogItem="closeDialogItem"/>
            </v-dialog> 

        </v-card>
    </div>
</template>
<script>
import axios from "axios";
import editItem from "../users/edit"
import createItem from "../users/create"
export default {
    components: {
        'editItem':editItem,
        'createItem':createItem,
    },
    data:()=>({  
        editDialog:false,
        createDialog:false,
        info:true,
        editedItem:'',
        headers:[
            {text: 'Nombre', value: 'name'},
            {text: 'Permisos', value: 'permissions'},
            {text: 'Puesto', value: 'role'},
            {text: 'Email', value: 'email'},
            {text: 'Teléfono', value: 'phone'},
            {text: 'Status', value: 'status'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        currentUser(){
            return this.$store.state.currentUser.user
        },
        users:{
            get(){
                return this.$store.state.user.users;
            }
        },
        permissions(){
            return [
                {text: 'Acceso a Influencers', value: 'influencers'},
                {text: 'Editar Influencers', value: 'editInfluencers'},
                {text: 'Eliminar Influencers', value: 'deleteInfluencers'},
                {text: 'Asignar Influencers', value: 'assignInfluencers'},

                {text: 'Acceso a Clientes', value: 'clients'},
                {text: 'Editar Clientes', value: 'editClients'},
                {text: 'Eliminar Clientes', value: 'deleteClients'},
                {text: 'Asignar Clientes', value: 'assignClients'},

                {text: 'Acceso Pagos a Influencers', value: 'influencerPayments'},

                {text: 'Acceso a Cancelaciónes', value: 'cancelations'},
                {text: 'Retomar Cancelaciónes', value: 'editCancelations'},
                {text: 'Eliminar Cancelaciónes', value: 'deleteCancelations'},

                {text: 'Acceso a Ventas', value: 'sales'},
                {text: 'Editar Ventas', value: 'editSales'},
                {text: 'Eliminar Ventas', value: 'deleteSales'},
                {text: 'Asignar Ventas', value: 'assignSales'},

                {text: 'Acceso a Catálogos', value: 'catalogs'},
                {text: 'Acceso a Usuarios', value: 'users'},
                {text: 'Acceso a Bitacoras', value: 'activityLog'},
                {text: 'Acceso a Reportes', value: 'reports'},
                {text: 'Descargar Excel', value: 'download'}
            ]
        }
    },
    methods:{
        permissionText(value){
            return this.permissions.filter(permission=>permission.value==value).map(permission=>permission.text)[0]
        },
        status(status){
            if(status==1){
                return 'Activo'
            }else{
                return 'Inactivo'
            }
        },
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este usuario?')) {
                axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users/" + id).then(response => {
                    this.$store.dispatch('user/getUsers')
                });
            }
        },
        edit(item){
            this.editedItem = item
            this.editDialog = true
        },
        closeDialogItem: function(params) {
            this.editDialog = params;
            this.createDialog = params;
            this.$store.dispatch('user/getUsers')
        },
    },
    created(){
        
    },
}
</script>