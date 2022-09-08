<template>
    <div class="padding1" style="background:#f4f5fa;">
        <v-card v-if="info==true" style="background:transparent;" class="elevation-0 pb-6 px-7">
            <v-card-text class="py-3 px-6" style="background:#1976d1; color:white; border-radius: 5px;">
                <v-icon color="white" small class="mr-2">mdi-information-outline</v-icon>
                Lorem ipsum dolor sit amet consectetur adipiscing elit massa imperdiet, mauris tortor platea fringilla sodales ac magna sociosqu, natoque non rutrum nec auctor vestibulum congue eget. 
                <v-icon style="position:absolute!important; top:7px; right:30px;" color="white" @click="info=false" small class="mr-2">mdi-close</v-icon>
            </v-card-text>
        </v-card>

        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;"> 
                <v-icon class="mr-4">mdi-account</v-icon>
                Mi Cuenta
            </v-card-title>

            <v-card-subtitle style="background:white;" class="py-5 pl-6" >Es posible que otros usuarios puedan ver parte de la información al usar los servicios de <strong>UNO CRM</strong>.</v-card-subtitle>
            
            <div style="background:white;" class="px-6 pb-5">
                <v-row class="p-4">
                    <v-col cols="3" class="pb-6 pt-7">Foto</v-col>
                    <v-col cols="7" class="pb-6 pt-7">Puedes personalizar tu cuenta con una foto</v-col>
                    <v-col cols="2">
                        <v-avatar elevation="2" size="50px">
                            <v-img alt="user" src="https://unocrm.mx/wp-content/uploads/2020/04/cropped-Recurso-1.png"></v-img>
                        </v-avatar>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Nombre</v-col>
                    <v-col cols="7">
                        <span v-if="editName==false">{{currentUser.name}} {{currentUser.last}}</span>
                        <v-text-field v-else v-model="currentUser.name"  @click:append="save" append-icon="mdi-content-save" label="Nombre" placeholder="Nombre" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editName==false" @click="editName=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editName==true" @click="editName=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Correo Electrónico</v-col>
                    <v-col cols="7">
                        <span v-if="editEmail==false">{{currentUser.email}}</span>
                        <v-text-field v-model="currentUser.email" @click:append="save" append-icon="mdi-content-save" v-else label="Correo Electrónico" placeholder="Correo Electrónico" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editEmail==false" @click="editEmail=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editEmail==true" @click="editEmail=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Contraseña</v-col>
                    <v-col cols="7">
                        <span v-if="editPassword==false">* * * * * * * *</span>
                        <v-text-field v-model="editedPassword.password" @click:append="savePassword" append-icon="mdi-content-save" v-else label="Contraseña" placeholder="Contraseña" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editPassword==false" @click="editPassword=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editPassword==true" @click="editPassword=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Teléfono</v-col>
                    <v-col cols="7">
                        <span v-if="editPhone==false">{{currentUser.phone}}</span>
                        <v-text-field v-model="currentUser.phone" @click:append="save" append-icon="mdi-content-save" v-else label="Teléfono" placeholder="Teléfono" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editPhone==false" @click="editPhone=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editPhone==true" @click="editPhone=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
            </div>
        </v-card>
  
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        data () {
            return {
                info:true,
                editName:false,
                editPhoto:false,
                editEmail:false,
                editPassword:false,
                editPhone:false,
                editedPassword:{
                    password:''
                }
            }
        },
        methods:{
            save(){
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users/" + this.currentUser.id,Object.assign(this.currentUser)).then(response=>{
                    this.$store.dispatch('currentUser/getUser')
                    this.editName=false
                    this.editPhoto=false
                    this.editEmail=false
                    this.editPhone=false

                })
            },
            savePassword(){
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/password", this.editedPassword).then(response=>{
                    this.editedPassword=''
                    this.editPassword=false
                })
            }
        },
        computed:{
          currentUser:{
            get(){
              return this.$store.state.currentUser.user
            }
          }
        },
        created(){
          
        },
    }
</script>

<style>
@media (min-width: 980px){
    .padding1{
        padding-left: 24px !important;
        padding-right: 48px !important;
    }
    .padding3{
        padding-right: 36px !important;
        padding-left: 36px !important;
    }
}
@media (max-width: 980px){
    .padding1{
        padding-top:20px!important;
    }
}
.v-sheet--offset {
    top: -50px;
    position: relative;
    margin: auto;
    display: block;
    border-radius: 50%!important;
    margin-bottom: -30px;
  }
</style>