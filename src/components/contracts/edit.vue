<template>
    <v-card>
        <v-card-title class="pb-0 pt-1" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span >Editar {{quole}}</span>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="2" class="pb-0 mb-0">
                <v-radio-group v-model="type" class="my-0">
                    <v-radio label="Agencia" color="primary" value="agency"></v-radio>
                    <v-radio label="Marca" color="primary" value="brand"></v-radio>
                </v-radio-group>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-autocomplete  :rules="[v => !!v || 'Campo requerido']" v-if="permissions('assignSales')" clearable v-model="quotation.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
                <v-autocomplete v-else-if="quotation.user_id=currentUser.id" disabled v-model="quotation.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">                
                </v-autocomplete>
            </v-col>
            <!--v-col cols="12" sm="6" md="2" class="pb-0 mb-0">
                <v-checkbox v-model="quotation.bar" label="Mostrador"></v-checkbox>
            </v-col-->
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row class="py-6">

                    <v-col class="pt-0" cols="12" sm="6" md="7">
                        <v-row v-if="type=='brand'">
                            <v-col cols="12" sm="6" md="6">
                                <v-autocomplete clearable v-model="quotation.brand_id" :items="brandLists" label="Marca" item-text="name" item-value="id">
                                    <template slot="no-data"><div class="px-4 py-1">No existen marcas relacionadas. <v-btn rounded class="mx-3" color="primary" @click="createCompanyDialog=true" x-small>Crear</v-btn></div></template>                      
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-autocomplete :disabled="quotation.brand_id==null" clearable v-model="quotation.contact_id" :items="contactLists" label="Contacto" item-text="name" item-value="id">
                                    <template slot="no-data"><div class="px-4 py-1">No existen contactos relacionados. <v-btn rounded class="mx-3" color="primary" @click="createContactDialog=true" x-small>Crear</v-btn></div></template>                      
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row v-if="type=='agency'">
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete clearable v-model="quotation.agency_id" :items="agencyLists" label="Agencia" item-text="name" item-value="id">
                                    <template slot="no-data"><div class="px-4 py-1">No existen agencias relacionadas. <v-btn rounded class="mx-3" color="primary" @click="createCompanyDialog=true" x-small>Crear</v-btn></div></template>                      
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete clearable v-model="quotation.brand_id" :items="brandLists" label="Marca" item-text="name" item-value="id">
                                    <template slot="no-data"><div class="px-4 py-1">No existen marcas relacionadas. <v-btn rounded class="mx-3" color="primary" @click="createCompanyDialog=true" x-small>Crear</v-btn></div></template>                      
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete :disabled="quotation.agency_id==null" clearable v-model="quotation.contact_id" :items="contactLists" label="Contacto" item-text="name" item-value="id">
                                    <template slot="no-data"><div class="px-4 py-1">No existen contactos relacionados. <v-btn rounded class="mx-3" color="primary" @click="createContactDialog=true" x-small>Crear</v-btn></div></template>                      
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-col> 

                    <v-col class="pt-0" cols="12" sm="6" md="2">
                        <v-autocomplete clearable v-model="quotation.type" :items="series" label="Tipo de Venta">
                            <template slot="no-data" class="pa-2">No existen tipos de venta relacionados.</template>                      
                        </v-autocomplete>
                    </v-col>
                    <v-col class="pt-0" cols="12" sm="6" md="3" v-if="quole=='Venta'">
                        <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.date" label="Fecha" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker color="primary" v-model="quotation.date" @input="datePicker = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col class="pt-0" cols="12" sm="6" md="3" v-if="quole=='Cotización'">
                        <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.due_date" label="Fecha de Vencimiento" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker color="primary" v-model="quotation.due_date" @input="datePicker = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>  


                <v-row v-for="(item,k) in detail" :key="k" style="background-color: #94949417;" class="px-8 ma-0 pb-3 pt-0 mb-4">
                    <v-col ols="12" sm ="4" md="4" class="px-0">
                        <v-autocomplete v-model="detail[k].influencer_id" :items="influencerLists" label="Influencer" item-text="name" item-value="id">                
                        </v-autocomplete>
                    </v-col>
                    <v-col ols="12" sm ="4" md="2" class="pt-8">
                        <v-icon @click="remove(k)" v-show="k || ( !k && detail.length > 1)" color="red">mdi-close</v-icon>
                        <v-icon @click="add(k)" v-show="k == detail.length-1" color="primary">mdi-plus</v-icon>
                    </v-col>
                
                    <v-row v-for="(item,j) in detail[k].items" :key="j" class="mb-2">
                        <v-col ols="12" sm ="4" md="1" class="py-1 my-0">
                            <v-text-field type=number v-model="item.quantity" label="Cantidad"></v-text-field><!--:disabled="yanohay(item.quantity, item.item, k)" -->
                        </v-col>
                        <div v-if="item.index=j"></div>
                        <v-col ols="12" sm ="8" md="6" class="py-1 my-0">
                            <v-autocomplete item-text="detail"  v-model="item.item" :items="itemLists(k)" item-value="id" label="Servicio" clearable>
                                <template slot="no-data" class="pa-2">No existen servicios relacionados.</template>  
                                <template v-slot:item="{item, attrs, on}">
                                    <v-list-item v-on="on" v-bind="attrs">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{item.service}} | {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                                <!--div>
                                                    <span style="font-size:12px;">Categoría(s):</span>
                                                    <template v-for="(category, index) in item.categories">
                                                        <v-chip  v-bind:key="index" small class="ml-2"  style="font-size:8px;">{{categoryName(category)}}</v-chip>
                                                    </template>
                                                </div-->
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template> 
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm ="8" md="4" class="py-1 my-0" v-if="item.item!=''">
                            <v-text-field v-model="item.price" prefix="$" suffix="c/u" label="Precio Ajustado"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm ="4" md="1">
                            <v-icon @click="remove2(j, k)" v-show="j || ( !j && detail[k].items.length > 1)" color="red">mdi-close</v-icon>
                            <v-icon @click="add2(j, k)" v-show="j == detail[k].items.length-1" color="primary">mdi-plus</v-icon>
                        </v-col>
                    </v-row>

                </v-row>

                
                <v-row class="mt-1 px-6">
                    <v-col cols="12" sm="6" md="6">
                        <v-container fluid>
                            <v-textarea v-model="quotation.note" label="Descripcion"></v-textarea>
                        </v-container>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <!--strong>Subtotal Sugerido = {{totalQuotation.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong-->
                        <v-text-field class="my-4" disabled v-if="quotation.subtotal=totalQuotation" v-model="quotation.subtotal" prefix="$" label="Monto en Pesos"></v-text-field>
                        <div v-if="quotation.type=='Serie B'">
                            <strong>IVA = {{(quotation.subtotal*.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                            <br>
                            <strong>Total = {{(quotation.subtotal*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                        </div>
                        <div v-if="quotation.type=='Serie A'">
                            <strong>IVA = {{(quotation.subtotal*.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                            <br>
                            <strong>Total = {{(quotation.subtotal*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                        </div>

                        <v-menu v-if="quole=='Venta' && quotation.type=='Serie A'" v-model="datePicker2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.invoice_date" label="Fecha de Facturación" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker color="primary" v-model="quotation.invoice_date" @input="datePicker2 = false"></v-date-picker>
                        </v-menu>

                    </v-col>
                </v-row>
                
            </v-container>
        </v-card-text>
        <v-row class="ma-0 pa-0">
            <v-col cols="12" sm="12" md="6">
                <v-menu top offset-x class="hidden-md-and-down">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn style="font-size:12px;" text v-bind="attrs" v-on="on">
                            <v-icon class="mr-2">mdi-attachment</v-icon> 
                        </v-btn>
                    </template>
                    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
                </v-menu>
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-card-actions>
                    <v-spacer class="hidden-md-and-down"></v-spacer>

                    <v-btn color="blue darken-1" text @click="close">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
        <!-- Crear Contacto -->
        <v-dialog v-model="createContactDialog" max-width="600px">
            <createContact v-bind:company="quotation.company_id" @closeCreateDialogContact="closeCreateDialogContact"/>
        </v-dialog>
        <!-- Crear empresa -->
        <v-dialog v-model="createCompanyDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#58c6ef" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <createCompany @closeCreateDialogCompany="closeCreateDialogCompany"/>
        </v-dialog>
    </v-card>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import CreateContact from "../clients/contacts/create"
import CreateCompany from "../clients/companies/create"
import axios from "axios";
    export default {
        components: {
            vueDropzone: vue2Dropzone,
            'createContact':CreateContact,
            'createCompany':CreateCompany,
        },  
        props:{
            quotation:Object
        }, 
        data: () => ({
            type:'',
            detail:'',
            datePicker:'',
            datePicker2:'',
            createContactDialog: false,
            createCompanyDialog: false,
            dropzoneOptions: {
                url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/files/"+'hola',
                addRemoveLinks: true,
                maxFiles: 1
            },
            series:[{text:'Con Factura', value:'Serie A'}, {text:'Sin Factura', value:'Serie B'}],
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
        }),
    computed: {
        agencyLists(){
            return this.$store.state.company.companies.filter(company=>company.client_type == 'agency');
        },
        brandLists(){
            return this.$store.state.company.companies.filter(company=>company.client_type == 'brand');
        },
        contactLists(){
            if(this.quotation.agency_id!=null || this.quotation.brand_id!=null){
                if(this.type=='brand'){
                    return this.$store.state.contact.contacts.filter(contact=>contact.company_id == this.quotation.brand_id);
                }else if(this.type=='agency'){
                    return this.$store.state.contact.contacts.filter(contact=>contact.company_id == this.quotation.agency_id);
                }
            }
        }, 
        usersLists(){
            return this.$store.state.user.salesman;
        }, 
        influencerLists(){
            return this.$store.state.user.users.filter(user=>user.job_position == 'Influencer');
        }, 
        totalQuotation(){
            var total=0
            for(var j=0; j<this.detail.length; j++){
                if(this.detail[j].items.length!=0){
                    for(var i=0; i<this.detail[j].items.length; i++){
                        if(this.detail[j].items[i].price!=undefined){
                            total = total+(this.detail[j].items[i].price*this.detail[j].items[i].quantity)
                        }
                    }
                }
            }
            return total
        }, 
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        }, 
        quole(){
            if(this.quotation.status=='vendido'){
                return 'Venta'
            }else if(this.quotation.status=='quotation'){
                return 'Cotización'
            } 
        }  
    },
    created(){
        this.detail = this.quotation.items
        if(this.quotation.agency_id!=undefined && this.quotation.agency_id!=null && this.quotation.agency_id!=''){
            this.type = 'agency'
        }else{
            this.type = 'brand'
        }
    },
    watch: {
    
    },
    methods: {
        itemLists(i){
            var perro = this.$store.state.user.users.filter(user=>user.id == this.detail[i].influencer_id).map(user=>user.services)[0]
            if(perro!=undefined){
                return perro.map(id=>{
                    return{
                        id:id.id,
                        service:id.service,
                        detail: id.service + ' | ' + (id.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                        price:id.price,
                    }
                });
            }
        },
        closeCreateDialogContact: function(params) {
            this.createContactDialog = params;
            this.$store.dispatch('contact/getContacts')
        },
        closeCreateDialogCompany: function(params) {
            this.createCompanyDialog = params;
            this.$store.dispatch('company/getCompanies')
        },
        permissions(permission){
        if(this.currentUser.id==1){
          return true
        }else if(this.currentUser.permissions!=undefined){
          if(this.currentUser.permissions.includes(permission)){
            return true
          }else{
            return false
          }
        }else{
          return false
        }
      },
        uploadSuccess(file, response) {
            console.log('File Successfully Uploaded with file name: ' + response.file);
            this.fileName = response.file;
            this.quotation.pdf = this.fileName;
        },
        uploadError(file, message) {
            console.log('An Error Occurred');
        },
        fileRemoved() {
            
        },
        add(index) {
            this.detail.push({ 
                inluencer_id: 1, 
                items:[{
                    index:'',
                    pay:false,
                    quantity:1,
                    item:'',
                    value:'',
                    price:'',
                    date:'',
                }], 
                quotation_id:'' 
            });
        },
        remove(index) {
            this.detail.splice(index, 1);
        },
        add2(index, a) {
            this.detail[a].items.push({
                quantity:1,
                item:'',
                value:'',
                price:'',
                date:''
            });
        },
        remove2(index, a) {
            this.detail[a].items.splice(index, 1);
        },
        close () {
            this.$nextTick(() => {
                this.$emit("closeDialogEditQuotation", false);
            })
        },
        save(){
            this.quotation.items = this.detail
            this.quotation.last_updated_by_user_id = this.currentUser.id
            //if(this.quotation.type = 'Serie A'){
                this.quotation.iva = this.quotation.subtotal*.16
                this.quotation.total = this.quotation.subtotal*1.16
            /*}else if(this.quotation.type = 'Serie B'){
                this.quotation.iva = this.quotation.subtotal*.08
                this.quotation.total = this.quotation.subtotal*1.08
            }*/
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/update",Object.assign(this.quotation)).then(response=>{
                this.$store.dispatch('quotation/getQuotations')
                this.close()
            })
        },
    },
}
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
</style>
<style>
.v-input__icon--prepend-inner i::before {
    font-size: 18px!important;
    color:#1976D2;
}
.v-text-field input, .v-label {
    font-size: 14px;
}
.v-picker__title.primary{
    display:none;
}
</style>