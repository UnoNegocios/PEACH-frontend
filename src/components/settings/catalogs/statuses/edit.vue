<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Editar Estatus
        </v-card-title>
        <v-divider></v-divider>
        <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedStatus.name" label="Estatus"></v-text-field>
                </v-col>
                <v-col class="pt-5" cols="12" sm="6" md="3">
                    <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                        <template v-slot:activator="{ on }">
                            <v-chip class="ma-2" :color="editedStatus.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color</v-chip>
                        </template>
                        <v-color-picker :rules="[v => !!v || 'Campo requerido']" v-model="editedStatus.color" class="ma-2"></v-color-picker>
                    </v-menu> 
                </v-col>
                <v-col cols="12" sm="6" md="5">
                    <v-card-actions class="pt-4">
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text :disabled="!valid" @click="save">Guardar</v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-form>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
    props:{
        editedStatus:Object
    },
    data:()=>({  
        valid: true,
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    methods:{
        close () {
            this.$nextTick(() => {
                this.$emit("closeDialogStatus", false);
            })
        },
        save () {
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/statuses",Object.assign(this.editedStatus)).then(response=>{
                this.close()
            })
            
        },
    }
}
</script>