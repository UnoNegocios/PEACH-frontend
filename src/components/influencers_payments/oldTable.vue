<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterCollections v-bind:influencer="influencer" @filtersCollection="filtersCollection"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table show-expand :headers="headers" :items="paymentsLists" sort-by="date" class="elevation-0 px-6 py-4" :search="search">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Pagos a Influencers</v-toolbar-title>
                    <!--v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn-->
                    <v-spacer></v-spacer>
                    <v-text-field class="pt-0 pb-4" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
                </v-toolbar>
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left v-if="permissions('editInfluencerPayments')==true || permissions('deleteInfluencerPayments')==true">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <!--v-list-item @click="editItem(item.id)"  v-show="permissions('editInfluencerPayments')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item-->
                        <v-list-item @click="deleteItem(item)"  v-show="permissions('deleteInfluencerPayments')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- Macro >
            <template v-slot:[`item.macro`]="{ item }">
                <v-icon v-if="item.macro==true">mdi-check</v-icon>
                <v-icon v-else>mdi-close</v-icon>
            </template-->
            <!-- Creación -->
            <template v-slot:[`item.created_at`]="{ item }">
                {{item.created_at.slice(0, 10)}}
            </template>
            <!-- Actualización -->
            <template v-slot:[`item.updated_at`]="{ item }">
                {{item.updated_at.slice(0, 10)}}
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de cobranza aún
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company}}</v-list-item>
            </template>
            <!-- Detalle PC -->
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <v-data-table :headers="headers2" :items="item.salesID" class="elevation-0" style="background: #f7f7f7;!important" dense>
                    </v-data-table>
                </td>
            </template>
            <!-- Monto -->
            <template v-slot:[`item.amount`]="{ item }">
                {{item.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
        </v-data-table>
        <!-- Crear actividad -->
        <v-dialog v-model="createDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#58c6ef" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:influencer="influencer" @closeCreateDialogCollection="closeCreateDialogCollection"/>
        </v-dialog>
        <!-- Editar actividad -->
        <v-dialog v-model="editDialog" max-width="700px">
          <edit v-bind:collection="collection" @closeEditDialogCollection="closeEditDialogCollection"/>
        </v-dialog>
        <!-- Dialogo confirmación de eliminación -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta cobranza?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteCollection()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../influencers_payments/filter"
import Create from "../influencers_payments/create"
import Edit from "../influencers_payments/edit"
export default {
    props:{
        influencer:String
    },
    components: {
        'filterCollections':Filter,
        'create':Create,
        'edit':Edit,
    }, 
    data: () => ({
        search: '',
        statusData:'',
        statusId:'',
        collection:'',
        sheet2: false,
        sheet: false,
        filters: false,
        editDialog: false,
        createDialog: false,
        detailDialog:false,
        rejectionDialog:false,
        deleteId:'',
        rejectionData:'',
        rejectionId:'',
        collections: '',
        headers2:[
            { text: 'Venta', value: 'sale_id',},
            { text: 'Cantidad', value: 'quantity'},
            { text: 'Servicio', value: 'item',},
            { text: 'Valor', value: 'price',},
            //{ text: 'Total', value: 'total',},
        ]
    }),
    computed: {
        showInfluencer(){
            if(this.influencer == null){
                return { text: 'Inluencer', value: 'influencer_id',}
            }else{
                return false
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            this.collections = this.collectionsLists
            return [
            { text: '', value: 'data-table-expand' },
            this.showInfluencer,
            //{ text: 'Venta', value: 'quotation_id'},
            //{ text: 'Macro', value: 'macro'},
            { text: 'Fecha', value: 'date'},
            //{ text: 'Metodo de Pago', value: 'payment_method_id'},
            { text: 'Monto', value: 'amount'},
            //{ text: 'Factura', value: 'invoice'},
            { text: 'Referencia', value: 'note'},
            { text: 'PDF', value: 'pdf'},
            //{ text: 'Responsable', value: 'user_id'},
            { text: 'Creación', value: 'created_at' },
            { text: 'Creador', value: 'created_by_user_id'},
            { text: 'Edición', value: 'updated_at' },
            { text: 'Editor', value: 'last_updated_by_user_id'},
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        paymentsList(){
            return this.$store.state.influencer_payment.influencer_payments
        },
        paymentsLists(){
            var payments = this.$store.state.influencer_payment.influencer_payments
            if(this.influencer!='' && this.influencer!=undefined && this.influencer!=null){
                payments = payments.filter(payment=>payment.influencer_id == this.influencer)
            }
            payments = payments.map(id=>{
                return{
                    id:id.id,
                    //macro:id.macro,
                    date:id.date,
                    //payment_method_id:this.paymentMethod(id.payment_method_id),
                    amount:id.amount,
                    //invoice:id.invoice,
                    note:id.note,
                    pdf:id.pdf,
                    created_by_user_id:this.salesman(id.created_by_user_id),
                    last_updated_by_user_id:this.salesman(id.last_updated_by_user_id),
                    influencer_id:this.salesman(id.influencer_id),
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                    salesID:this.detail(id.salesID)
                }
            });
            return payments
        },
    },
    mounted() {
        Echo.channel('test').listen('Test', (e) => {
            //console.log('test')
        })
    },
    methods: {
        detail(salesID){
            var salesDetail = []
            for(var i=0; i<salesID.length; i++){
                salesDetail = salesDetail.concat(salesID[i].details)
            }
            return salesDetail.map(id=>{
                return{
                    item:id.item, 
                    price:id.price, 
                    quantity:id.quantity, 
                    sale_id:this.saleName(id.sale_id), 
                    total:(id.price*1)*(id.quantity*1), 
                }
            });
        },
        saleName(id){
            if(id!=undefined){
                var sale = this.$store.state.quotation.sales.filter(quotation=>quotation.id == id)[0]
                return 'id:' + sale.id + ' | ' + this.companyName(sale.brand_id) + ' | ' + this.contact(sale.contact_id)
            }
        },
        companyName(id){
            if(id!=null && id!=undefined && id!=''){
                return this.$store.state.company.companies.filter(company=>company.id == id).map(company=>company.name)[0]
            }
        },
        contact(id){
            if(id!=null && id!=undefined && id!=''){
                return this.$store.state.contact.contacts.filter(contact=>contact.id == id).map(contact=>contact.name)[0]
            }
        },
        openFilter(){
            if(this.filters == false){
                this.$emit("closeDrawer", false);
                this.filters = true
            }else{
                this.$emit("closeDrawer", true);
                this.filters = false
            }
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
        removeDuplicates(originalArray, prop) {
            var newArray = [];
            var lookupObject  = {};
            for(var i in originalArray) {
                lookupObject[originalArray[i][prop]] = originalArray[i];
            }
            for(i in lookupObject) {
                newArray.push(lookupObject[i]);
            }
            return newArray;
        },
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
        },
        filtersCollection: function(params) {
            this.collections = ''
            if(this.company!='' && this.company!=undefined && this.company!=null){
                var filterCollection = this.$store.state.collection.collections.filter(collection=>collection.status == 'collection').filter(collection=>collection.company_id == this.company)
            }else{
                var filterCollection = this.$store.state.collection.collections.filter(collection=>collection.status == 'collection')
            }
            if(params.company_id!=''&&params.company_id!=undefined&&params.company_id!=null){
                var cuatro = filterCollection.filter(company=>company.company_id == params.company_id[0])
                for(var i=1; i<params.company_id.length; i++){
                    cuatro=cuatro.concat(filterCollection.filter(company=>company.company_id == params.company_id[i]))   
                }
                filterCollection = this.removeDuplicates(cuatro, "id");
            }
            if(params.contact_id!=''&&params.contact_id!=undefined&&params.contact_id!=null){
                var cuatro = filterCollection.filter(company=>company.contact_id == params.contact_id[0])
                for(var i=1; i<params.contact_id.length; i++){
                    cuatro=cuatro.concat(filterCollection.filter(company=>company.contact_id == params.contact_id[i]))   
                }
                filterCollection = this.removeDuplicates(cuatro, "id");
            }
            if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
                var cuatro = filterCollection.filter(company=>company.user_id == params.user_id[0])
                for(var i=1; i<params.user_id.length; i++){
                    cuatro=cuatro.concat(filterCollection.filter(company=>company.user_id == params.user_id[i]))   
                }
                filterCollection = this.removeDuplicates(cuatro, "id");
            }
            if(params.items!=''&&params.items!=undefined&&params.items!=null){
                var cinco = filterCollection.filter(collection=>this.check(collection.items, params.items[0]) == 'contain')
                for(var i=1; i<params.items.length; i++){
                    cinco=cinco.concat(filterCollection.filter(collection=>this.check(collection.items, params.items[0]) == 'contain'))   
                }
                filterCollection = this.removeDuplicates(cinco, "id");
            }
            /* text fields */
            if(params.description!=''&&params.description!=undefined&&params.description!=null){
                filterCollection=filterCollection.filter(collection=>this.lowerCase(collection.description).includes(params.description.toLowerCase()))
            }


            /* Fecha creación */
            if(params.dateCreateFrom!='' && params.dateCreateFrom!=null && params.dateCreateFrom!=undefined){
                filterCollection=filterCollection.filter(collection=>new Date(collection.created_at) > new Date(params.dateCreateFrom))
            }
            if(params.dateCreateTo!='' && params.dateCreateTo!=null && params.dateCreateTo!=undefined){
                var dateTwo = new Date(new Date(params.dateCreateTo).setDate(new Date(params.dateCreateTo).getDate() + 1))
                filterCollection=filterCollection.filter(collection=>new Date(collection.created_at) <= dateTwo)
            }

            /* Fecha actualización */
            if(params.dateUpdateFrom!='' && params.dateUpdateFrom!=null && params.dateUpdateFrom!=undefined){
                filterCollection = filterCollection.filter(collection=>new Date(collection.updated_at) > new Date(params.dateUpdateFrom))
            }
            if(params.dateUpdateTo!='' && params.dateUpdateTo!=null && params.dateUpdateTo!=undefined){
                var dateFour = new Date(new Date(params.dateUpdateTo).setDate(new Date(params.dateUpdateTo).getDate() + 1))
                filterCollection=filterCollection.filter(collection=>new Date(collection.updated_at) <= dateFour)
            }


            this.collections = filterCollection.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
                    amount:id.amount,
                    pdf:id.pdf,
                    note:id.note,
                    items:id.items,
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                }
            });
        },
        check(items, param){
            if(items!=undefined&&items!=''&&items!=null){
                for(var i=0; i<items.length; i++){
                    if(items[i].item == param){
                        return 'contain'
                    }
                }  
            }
        },
        closeEditDialogCollection: function(params) {
            this.editDialog = false;
            this.$store.dispatch('collection/getCollections')
        },
        closeCreateDialogCollection: function(params) {
            this.createDialog = false;
            this.$store.dispatch('collection/getCollections')
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.collections)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Cobranzas'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteCollection(){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/collection/delete/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.$store.dispatch('collection/getCollections')
            });
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
            this.sheet2 = false
        },
        deleteItem (item) {
            this.deleteId = item.id
            this.sheet = true
        },
        editItem(id){
            this.collection = this.collectionsList.filter(collection=>collection.id == id)[0]
            this.editDialog = true
        },
        salesman(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.name)[0]
        },
        contact(id){
            return this.$store.state.contact.contacts.filter(contact=>contact.id == id).map(contact => contact.name + ' ' + contact.last)[0]
        },
        companyName(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
        },
    }
}
</script>
<style>
    .bordercolor{
        width: 3px;
        content: ' ';
        height: 47px;
        position: absolute;
        border-radius:5px 0px 0px 5px;
    }
    @media(min-width: 980px){
        .bordercolor{
            margin-top: -13px;
            margin-left: -19px;
        }
    }
    @media(max-width: 980px){
        .bordercolor {
            height: 360px;
            left: 9px;
        }
    }
    .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
        box-shadow: none!important;
        background: #f7f7f7;
    }
</style>