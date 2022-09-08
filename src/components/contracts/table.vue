<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterQuotations v-bind:company="company" @filtersQuotation="filtersQuotation"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table show-expand :headers="headers" :items="quotations" class="elevation-0 px-6 py-4">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Ventas</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon v-show="permissions('download')">
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left v-if="permissions('editQuotations')==true || permissions('deleteQuotations')==true">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.id)"  v-show="permissions('editQuotations')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)"  v-show="permissions('deleteQuotations')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                        <v-list-item @click="sendEmail(item.id)">
                            <v-icon small class="mr-2">
                                mdi-email
                            </v-icon>
                            Enviar Correo
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
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
                No existen registros de cotiaciones aún
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company}}</v-list-item>
            </template>
        </v-data-table>
        <!-- Crear actividad -->
        <v-dialog v-model="createDialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#58c6ef" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:message="[company, statusss]" @closeCreateDialogQuotation="closeCreateDialogQuotation"/>
        </v-dialog>
        <!-- Editar actividad -->
        <v-dialog v-model="editDialog" max-width="900px">
          <edit v-bind:quotation="quotation" @closeDialogEditQuotation="closeDialogEditQuotation"/>
        </v-dialog>
        <!-- Enviar email -->
        <v-dialog v-model="emailDialog" max-width="700px">
          <email v-bind:quotation="quotation" @closeDialogEmailQuotation="closeDialogEmailQuotation"/>
        </v-dialog>
        <!-- Dialogo confirmación de eliminación -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta cotizaión?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteQuotation()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Dialogo confirmación de estatus -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet2" inset>
                <v-sheet class="text-center" height="210px">
                    <v-row class="pt-6" v-if="statusData=='vendido'">
                        <v-col class="pt-0" cols="12" sm="6" md="4">
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6" md="4">
                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                <template v-slot:activator="{ on }">
                                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="programing_date" label="Fecha Programada" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                </template>
                                <v-date-picker color="primary" v-model="programing_date" @input="datePicker = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6" md="4">
                        </v-col>
                    </v-row>
                    <div class="pt-6">
                    ¿Seguro que deseas cambiar el estatus de esta cotización a {{statusData}}?
                    </div>
                    <v-btn class="mt-4" text color="primary" @click="status()">
                    Si
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    No
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Motivo de Rechazo -->
        <v-dialog v-model="rejectionDialog" max-width="400px">
            <div class="px-12 py-6" style="background-color:white;">
                Motivo de Rechazo: 
                <v-autocomplete clearable v-model="rejectionId" :items="rejectionsLists" label="Motivo de Cancelación" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen motivos relacionados.</template>                      
                </v-autocomplete>
                <v-textarea v-model="rejectionData" label="Descripcion"></v-textarea>
                <v-btn color="blue darken-1" text @click="rejectionDialog=false">
                    Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="confirmStatus(statusId, 'cancelado')">
                    Guardar
                </v-btn>
            </div>
        </v-dialog>
    </v-container>
</template>

<script>
import moment from 'moment';
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../contracts/filter"
import Create from "../contracts/create"
import Edit from "../contracts/edit"
import Email from "../contracts/sendQuotation"
export default {
    props:{
        company:String
    },
    components: {
        'filterContracts':Filter,
        'create':Create,
        'edit':Edit,
        'email':Email,
    }, 
    data: () => ({
        datePicker:false,
        programing_date:'',
        statusss:'quotation',
        statusData:'',
        statusId:'',
        quotation:'',
        sheet2: false,
        sheet: false,
        filters: false,
        emailDialog: false,
        editDialog: false,
        createDialog: false,
        detailDialog:false,
        rejectionDialog:false,
        deleteId:'',
        rejectionData:'',
        rejectionId:'',
        quotations: '',
        headers2:[
            { text: 'Cantidad', value: 'quantity',},
            //{ text: 'Peso', value: 'weight',},
            //{ text: 'Peso Total', value: 'totalWeight',},
            { text: 'Producto | Servicio', value: 'item',},
            //{ text: 'Valor', value: 'value',},
            { text: 'Precio Ajustado', value: 'price',},
            { text: 'Total', value: 'total',},
        ]
    }),
    computed: {
        showCompany(){
            if(this.company == null){
                return { text: 'Empresa', value: 'company',}
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
            this.quotations = this.quotationsLists
            return [
            { text: '', value: 'data-table-expand' },
            { text: 'Folio', value: 'id' },
            //{ text: 'Fecha Programada', value: 'date' },
            this.showCompany,
            { text: 'Contacto', value: 'contact' },

            { text: 'Subtotal', value: 'subtotal' },
            { text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
            //{ text: 'Pagos', value: 'payments' },
            //{ text: 'Adeudo', value: 'debt' },
            //{ text: 'Saldo Vencido', value: 'expired_debt'},

            { text: 'Lista de Precios', value: 'priceList' },
            //{ text: 'Estatus', value: 'status' },
            //{ text: 'Estatus de Pago', value: 'paymentStatus' },
            //{ text: 'Fecha Factura', value: 'invoice_date' },
            //{ text: 'Fecha de Vencimiento', value: 'expiration' },
            //{ text: 'Mostrador', value: 'bar' },
            //{ text: 'Peso', value: 'kg' },
            { text: 'Fecha de Entrega', value: 'delivery' },
            //{ text: 'Serie', value: 'type' },
            //{ text: 'Factura', value: 'invoice' },
            //{ text: 'Impresa', value: 'printed' },
            //{ text: 'Días Factura', value: 'invoiceDays' },
            //{ text: 'Días Vencido', value: 'expirationDays' },
            { text: 'Responsable', value: 'salesman' },
            { text: 'Creación', value: 'created_at' },
            { text: 'Creador', value: 'created_by_user_id' },
            { text: 'Edición', value: 'updated_at' },
            { text: 'Editor', value: 'last_updated_by_user_id' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        quotationsLists(){
            var quotations = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'quotation')
            if(this.company!='' && this.company!=undefined && this.company!=null){
                quotations = quotations.filter(quotation=>quotation.company_id == this.company)
            }
            quotations = quotations.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
                    total:id.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    pdf:id.pdf,
                    note:id.note,
                    serie:id.serie,
                    bar:id.bar,
                    //date:id.date.slice(0, 10),
                    type:id.type,
                    items:id.items,
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                    subtotal:id.subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    iva:id.iva.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),                    
                    invoice:id.invoice,
                    printed:id.printed,
                    created_by_user_id:this.salesman(id.created_by_user_id),
                    last_updated_by_user_id:this.salesman(id.last_updated_by_user_id),
                    priceList:this.priceList(id.company_id),
                    kg:this.weight(id.items),
                    delivery:this.delivery(id.id),
                    expiration:this.expiration(id.invoice_date, id.company_id),
                    invoice_date:id.invoice_date,
                    invoiceDays:this.invoiceDays(id.invoice_date),
                    expirationDays:this.expirationDays(id.invoice_date, id.company_id),
                    payments:this.payments(id.id).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    debt:this.debt(id.total, id.id).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    expired_debt:this.expired_debt(id.id, id.total, id.invoice_date, id.company_id).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    paymentStatus:this.paymentStatus(id.id, id.total, id.invoice_date, id.company_id),
                    status:this.statuses(id.id, id.bar, id.total, id.company_id),
                }
            });
            return quotations
        },
        rejectionsLists(){
            return this.$store.state.rejection.rejections;
        },
        quotationsList(){
            return this.$store.state.quotation.quotations
        }
    },
    created () {
        this.quotations = this.quotationsLists   
    },
    methods: {
        quotationDetail(){
            return this.$store.state.quotation_detail.quotations.filter()
        },
        statuses(id, bar, total, companyId){
            /*if(bar==true){
                return 'Mostrador'
            }else*/ if(new Date(this.delivery(id)) > new Date()){
                return 'Por entregar'
            }else if(this.debt(total, id)<1){
                return 'Pagado'
            }else if(this.$store.state.company.companies.filter(company=>company.id == companyId).map(company=>company.credit_days)[0]==0){
                return 'Por cobrar'
            }else{
                return 'En plazo de crédito'
            }
        },
        paymentStatus(id, total, invoice_date, company_id){
            if(this.expirationDays(invoice_date, company_id)){
                return 'Vencida'
            }
            else if(this.debt(total, id)<1){
                return 'Pagada'
            }
            else{
                return 'En credito'
            }
            
        },
        payments(id){
            var collections = this.$store.state.collection.collections.filter(collection=>collection.quotation_id == id).map(collection=>collection.amount)
            if(collections.length>0){
                var respuesta = 0
                for(var i=0; i<collections.length; i++){
                    respuesta = respuesta + collections[i]
                }
                return respuesta
            }else{
                return 0
            }
        },
        debt(total, id){
            return ((total*1) - (this.payments(id)*1))
        },
        expired_debt(id, total, invoice_date, company_id){
            if(this.expirationDays(invoice_date, company_id)){
                return this.debt(total, id)
            }else{
                return 0
            }
        },
        invoiceDays(invoice_date){
            if(invoice_date!=undefined){
                return moment(new Date()).diff(moment(new Date(invoice_date)), 'days')
            }
        },
        expirationDays(invoice_date, company_id){
            var credit_days = this.$store.state.company.companies.filter(company=>company.id == company_id).map(company=>company.credit_days)[0]
            var invoice_days = this.invoiceDays(invoice_date)
            if(invoice_days>credit_days){
                return ((invoice_days*1)-(credit_days*1))
            }
        },
        expiration(date, companyId){
            if(date!=undefined){
                var credit_days = this.$store.state.company.companies.filter(company=>company.id == companyId).map(company=>company.credit_days)[0]
                return moment(date, "YYYY-MM-DD").add(credit_days, 'days').format().slice(0, 10);
            }
        },
        delivery(id){
            var shipping_id = this.$store.state.shipping_detail.shipping_details.filter(detail=>detail.sale_id == id).map(detail=>detail.shipping_id)[0]
            var date = this.$store.state.shipping.shippings.filter(shipping=>shipping.id == shipping_id).map(shipping=>shipping.date)[0]
            if(date!=undefined){
                return date
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
        rejection(id){
            this.statusId = id
            this.rejectionDialog = true
        },
        confirmStatus(id, status){
            this.statusId = id
            this.statusData = status
            this.sheet2 = true
        },
        status(){
            var editedItem = this.quotationsList.filter(quotation=>quotation.id == this.statusId)[0]
            editedItem.date = this.programing_date
            editedItem.status = this.statusData
            editedItem.rejection_id = this.rejectionId
            editedItem.rejection_comment = this.rejectionData
            editedItem.last_updated_by_user_id = this.currentUser.id
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/update",Object.assign(editedItem)).then(response=>{
                this.statusId = ''
                this.statusData = ''
                this.sheet2 = false
                this.rejectionId = ''
                this.rejectionData = ''
                this.rejectionDialog = false
                this.$store.dispatch('quotation/getQuotations')
                this.$store.dispatch('quotation/getSales')
            })
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
        filtersQuotation: function(params) {
            
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
        weight(items){
            var weight = ''
            for(var i=0; i<items.length; i++){
                weight = weight + (items[i].weight*items[i].quantity)
            }
            return weight + ' kg'
        },
        closeDialogEditQuotation: function(params) {
            this.editDialog = false;
            this.$store.dispatch('quotation/getQuotations')
        },
        closeCreateDialogQuotation: function(params) {
            this.createDialog = false;
            this.$store.dispatch('quotation/getQuotations')
        },
        closeDialogEmailQuotation: function(params) {
            this.emailDialog = false;
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.quotations)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Cotizaciones'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteQuotation(){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/delete/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.$store.dispatch('quotation/getQuotations')
            });
        },
        sendEmail (id) {
            this.quotation = this.quotationsList.filter(quotation=>quotation.id == id)[0]
            this.emailDialog = true
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
            this.quotation = this.quotationsList.filter(quotation=>quotation.id == id)[0]
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
        priceList(id){
            var priceList = this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.price_list_id)[0]
            return this.$store.state.price_list.price_lists.filter(price=>price.id == priceList).map(price => price.item)[0]
        },
        items(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.name)[0]
        },
        prices(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.price)[0]
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