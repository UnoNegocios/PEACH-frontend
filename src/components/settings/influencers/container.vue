

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
            <v-card-title style="background:white;" class="px-6">Influencers
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-text-field class="pt-0 pb-2" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
                <v-select label="Status" clearable class="ml-6" style="max-width:150px;" :items="status" v-model="search" item-text="label" item-value="value"></v-select>
            </v-card-title>
            <v-data-table :search="search" expand-icon :headers="headers" :items="users" class="elevation-0 px-8">
                <template slot="no-data">
                    No existen influencers registrados.
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-menu bottom right>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list style="font-size:13px;">
                            <v-list-item @click="sendNotification(item.id)">
                                <v-icon small class="mr-2">
                                    mdi-email
                                </v-icon>
                                Enviar invitación a APP
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                    {{item.name}} {{item.last}}
                </template>
                <template v-slot:[`item.is_active`]="{ item }">
                    <v-chip x-small color="success" style="background:#4caf5026!important;" outlined v-if="item.is_active=='Activo'">Activo</v-chip>
                    <v-chip x-small color="error" style="background:#ff52521f!important;" outlined v-else-if="item.is_active=='Inactive'">Inactivo</v-chip>
                </template>
            </v-data-table>
        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show" bottom style="margin-bottom:30px;">
            {{snackbar.message}}
        </v-snackbar>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data:()=>({  
        snackbar:{
            color:'',
            show:false,
            message:'',
        },
        status:[{label:'Activo', value:'Activo'},{label:'Inactivo', value:'Inactive'}],
        search:'',
        search2:'',
        info:true,
        headers:[
            {text: 'Nombre', value: 'name'},
            {text: 'Instagram', value: 'instagram'},
            {text: 'Status', value: 'is_active'},
            {text: 'Email', value: 'email'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    watch:{
        search2:{
            handler(){
                this.search = this.search2
            },deep:true
        }
    },
    computed:{
        users:{
            get(){
                return this.$store.state.user.influencers.map(id=>{return{
                    id:id.id,
                    name:id.name,
                    instagram:id.social_networks.instagram,
                    is_active:this.isActive(id.is_active),
                    email:id.email,
                }})
            }
        },
    },
    methods:{
        sendNotification(influencer_id){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/influencer/send_app_invite/'+influencer_id).then(resp=>{
                this.snackbar = {
                    color:'success',
                    show:true,
                    message:'Invitación enviada con éxito',
                }
            }).catch(error=>{
                this.snackbar = {
                    color:'error',
                    show:true,
                    message:'No se pudo enviar la invitación',
                }
            })
        },
        isActive(is_active){
            if(is_active){
                return 'Activo'
            }else{
                return 'Inactive'
            }
        }
    }
}
</script>