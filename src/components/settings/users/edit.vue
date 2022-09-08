<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title class="py-0" >
            Crear Usuario
            <v-spacer></v-spacer>
            <v-select v-model="editedItem.role" :items="positions" item-value="job_position" label="Puesto"></v-select>
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="6">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre"></v-text-field>
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.email" label="Email"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.last" label="Apellido"></v-text-field>
                    <v-text-field v-model="editedItem.phone" label="Teléfono"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" class="pt-0">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" type="password" v-model="editedItem.password" label="Contraseña"></v-text-field>
                </v-col>
                <v-col v-if="editedItem.role == 'Talent Agent' || editedItem.role == 'Key Account Management' || editedItem.role == 'Booking'" cols="12" sm="6" md="6" class="pt-0">
                    <v-select v-model="editedItem.parent_id" :items="managers" item-text="name" item-value="id"  label="Manager"></v-select>
                </v-col>

                
            </v-row>
        </v-form>
        <v-card-actions class="pt-4">
            <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                <template v-slot:activator="{ on }">
                    <v-chip class="ma-2 mt-0" :color="editedItem.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color Calendario</v-chip>
                </template>
                <v-color-picker :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.color" class="ma-2"></v-color-picker>
            </v-menu> 
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text :disabled="!valid" @click="save">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
    data:()=>({  
        disable:'',
        valid: true,
        positions:[
            'Administrador',
            'Key Account Management Manager', 
            'Key Account Management', 
            'Talent Agent Manager', 
            'Talent Agent', 
            'Booking Manager',
            'Booking'
        ],
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    props:{
        editedItem:Object
    },
    computed:{
        managers(){
            var users = this.$store.state.user.users
            switch(this.editedItem.role){
                case 'Key Account Management' : return users.filter(user=>user.role == 'Key Account Management Manager')
                case 'Talent Agent' : return users.filter(user=>user.role == 'Talent Agent Manager')
                case 'Booking' : return users.filter(user=>user.role == 'Booking Manager')
            }
        },
        permissions(){
            return [
                {text: 'Crear Influencers', value: 'createInfluencers'},
                {text: 'Acceso a Influencers', value: 'influencers'},
                {text: 'Editar Influencers', value: 'editInfluencers'},
                {text: 'Eliminar Influencers', value: 'deleteInfluencers'},
                {text: 'Asignar Influencers', value: 'assignInfluencers'},

                {text: 'Crear Clientes', value: 'createClients'},
                {text: 'Acceso a Clientes', value: 'clients'},
                {text: 'Editar Clientes', value: 'editClients'},
                {text: 'Eliminar Clientes', value: 'deleteClients'},
                {text: 'Asignar Clientes', value: 'assignClients'},

                {text: 'Acceso Pagos a Influencers', value: 'influencerPayments'},

                {text: 'Acceso a Cancelaciónes', value: 'cancelations'},
                {text: 'Retomar Cancelaciónes', value: 'editCancelations'},
                {text: 'Eliminar Cancelaciónes', value: 'deleteCancelations'},

                {text: 'Crear Ventas', value: 'createSales'},
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
        },
    },
    methods:{
        close () {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users/" + this.editedItem.id, this.editedItem).then(response=>{
                this.close()
            })  
        },
    }
}
</script>