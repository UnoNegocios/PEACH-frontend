<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterQuotations v-bind:company="company" @filtersQuotation="filtersQuotation"/>
        </v-navigation-drawer>
        <!-- Contenedor show-expand -->
        <v-data-table v-sortable-table="{onEnd:sortTheHeadersAndUpdateTheKey}"
            :key="anIncreasingNumber" group-by="PROMESA_DE_PAGO" :item-class="itemRowBackground" :headers="showHeaders" :items="quotations" class="elevation-0 px-6 py-4">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Ventas</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-chip v-if="chip1" class="ma-2" close @click:close="chip1 = false">Ventas Pendientes</v-chip>
                    <v-spacer></v-spacer>
                    <v-select style="max-width:350px!important;" class="mr-4" v-model="selectedHeaders" :items="headers" label="Columnas" dense multiple outlined return-object>
                        <template v-slot:prepend-item>
                            <v-list-item ripple @mousedown.prevent @click="toggle">
                            <v-list-item-action>
                                <v-icon :color="selectedHeaders.length > 0 ? 'primary' : ''">
                                {{ icon }}
                                </v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>
                                Seleccionar Todo
                                </v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                            <v-divider class="mt-2"></v-divider>
                        </template>
                        <template v-slot:selection="{ item, index }">
                            <v-chip color="primary" x-small v-if="index < 2">
                                <span style="font-size:11px;">{{ item.text }}</span>
                            </v-chip>
                            <span v-if="index === 2" style="font-size:10px!important;" class="grey--text caption">(+{{ selectedHeaders.length - 2 }} más)</span>
                        </template>
                    </v-select>
                    <v-btn icon v-show="permissions('download')">
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <!-- Footer -->
            <template v-slot:footer>
                <v-container style="margin-bottom:-67px!important; margin-left: 0!important;">
                    <v-select :items="sumavg" v-model="totalType" style="width: 100px; display: inline-block; margin-right:30px; font-size: 14px;"></v-select>
                    <v-select :items="campos" v-model="campo" item-text="text" item-value="value" style="width: 100px; display: inline-block; margin-right:30px; font-size: 14px;"></v-select>
                    <strong v-if="totalType=='sum'">Total = {{ sumField(campo) }}</strong>
                    <strong v-if="totalType=='avg'">Promedio = {{ avgField(campo) }}</strong>
                </v-container>
            </template>
            <template v-slot:[`item.subtotal`]="{ item }">
                {{(item.subtotal*1).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.iva`]="{ item }">
                {{(item.iva*1).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.total`]="{ item }">
                {{(item.total*1).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.amount_peach`]="{ item }">
                {{(item.amount_peach*1).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.influencer_amount`]="{ item }">
                {{(item.influencer_amount*1).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left v-if="permissions('editSales')==true || permissions('deleteSales')==true">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.id)"  v-show="permissions('editSales')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)"  v-show="permissions('deleteSales')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                        <v-list-item @click="influencerPayment(item.id)">
                            <v-icon small class="mr-2">
                                mdi-account-cash
                            </v-icon>
                            Pagar a Influencer
                        </v-list-item>
                        <v-list-item @click="promiseDate(item.id)">
                            <v-icon small class="mr-2">
                                mdi-calendar
                            </v-icon>
                            Fecha Promesa
                        </v-list-item>
                        <v-list-item @click="liquidar(item.id)">
                            <v-icon small class="mr-2">
                                mdi-cash-check
                            </v-icon>
                            Venta Pagada
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- Creación -->
            <template v-slot:[`item.services`]="{ item }">
                <div v-for="(service, index) in item.services" v-bind:key="index">
                    {{service}}<br/>
                </div>
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
            <!-- macro -->
            <template v-slot:[`item.bar`]="{ item }">
                <v-icon v-if="item.bar==true">mdi-check</v-icon>
                <v-icon v-else>mdi-close</v-icon>
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
                <v-sheet class="text-center" height="150px">
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
        <!-- Pago Influencer -->
        <v-dialog v-model="influencerPaymentDialg" max-width="400px">
            <div class="px-12 py-6" style="background-color:white;">
                Pago Influencer: 
                <v-menu v-model="datePicker1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field class="mt-4 mb-2" :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.influencer_payment_date" label="Fecha de Pago" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="quotation.influencer_payment_date" @input="datePicker1 = false"></v-date-picker>
                </v-menu>
                <v-text-field  v-model="quotation.influencer_account" label="Cuenta Banco"></v-text-field>                
                <div class="pb-4" style="color:grey; font-size:13px;" v-if="quotation!=''">{{mapItems(quotation.items, quotation.id)[0].influencer_d}}</div>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="influencerPaymentDialg=false">
                    Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="saveInfluencerPayment()">
                    Guardar
                </v-btn>
            </div>
        </v-dialog>
        <!-- Fecha Promesa -->
        <v-dialog v-model="promiseDateDialog" max-width="400px">
            <div class="px-12 py-6" style="background-color:white;">
                Fecha Promesa: 
                <v-menu v-model="datePicker2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field class="pb-6 mt-4" :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.promise_date" label="Fecha" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="quotation.promise_date" @input="datePicker2 = false"></v-date-picker>
                </v-menu>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="promiseDateDialog=false">
                    Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="savePromiseDate()">
                    Guardar
                </v-btn>
            </div>
        </v-dialog>
        <!-- Venta Pagada -->
        <v-dialog v-model="liquidarDialog" max-width="400px">
            <div class="px-12 py-6" style="background-color:white;">
                Venta Pagada: 
                <v-menu v-model="datePicker3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field class="pb-6 mt-4" :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.pay_date" label="Fecha de Pago" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="quotation.pay_date" @input="datePicker3 = false"></v-date-picker>
                </v-menu>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="promiseDateDialog=false">
                    Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="saveLiquidacion()">
                    Guardar
                </v-btn>
            </div>
        </v-dialog>
    </v-container>
</template>

<script>
function watchClass(targetNode, classToWatch) {
  let lastClassState = targetNode.classList.contains(classToWatch);
  const observer = new MutationObserver((mutationsList) => {
    for (let i = 0; i < mutationsList.length; i++) {
      const mutation = mutationsList[i];
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const currentClassState = mutation.target.classList.contains(classToWatch);
        if (lastClassState !== currentClassState) {
          lastClassState = currentClassState;
          if (!currentClassState) {
            mutation.target.classList.add('sortHandle');
          }
        }
      }
    }
  });
  observer.observe(targetNode, { attributes: true });
}

import Sortable from 'sortablejs';
import moment from 'moment';
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../sales/filter"
import Create from "../quotations/create"
import Edit from "../quotations/edit"
import Email from "../quotations/sendQuotation"
export default {
    props:{
        company:String,
        influencer:String
    },
    components: {
        'filterQuotations':Filter,
        'create':Create,
        'edit':Edit,
        'email':Email,
    }, 
    data: () => ({
        anIncreasingNumber: 1,
        totalType:'sum',
        sumavg:['sum', 'avg'],
        campo:'total',
        campos:[
            { text: 'Subtotal', value: 'subtotal' },
            { text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
            { text: 'Ganancia Peach', value: 'amount_peach' },
            { text: 'Ganancia Influencer(s)', value: 'influencer_amount' },
        ],
        chip1:true,
        datePicker1:false,
        datePicker2:false,
        datePicker3:false,
        influencerPaymentDialg:false,
        promiseDateDialog:false,
        statusss:'vendido',
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
        liquidarDialog:false,
        deleteId:'',
        rejectionData:'',
        rejectionId:'',
        quotations: '',
        headers2:[
            { text: 'Cantidad', value: 'quantity',},
            { text: 'Servicio', value: 'item',},
            { text: 'Precio Ajustado', value: 'price',},
            { text: 'Total', value: 'total',},
            { text: 'Influencer', value: 'influencer_id',},
            { text: 'Pagado', value: 'pay',},
        ],
        headers:[],
        selectedHeaders: [],
        /*
        influencer_payment:{
            id:'',
            date:''
        },
        promise_date:{
            id:'',
            date:''
        },
        */
    }),
    computed: {
        showHeaders () {
            this.quotations = this.quotationsLists
            return this.headers.filter(s => this.selectedHeaders.includes(s));
        },
        showAgency(){
            if(this.agency == null){
                return { text: 'Agencia', value: 'agency',}
            }else{
                return false
            }
        },
        showBrand(){
            if(this.brand == null){
                return { text: 'Marca', value: 'brand',}
            }else{
                return false
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headersMap(){ 
            return [
            { text: 'Folio', value: 'id' },
            { text: 'Departamento', value: 'booking' },
            { text: 'Influencer', value: 'influencer' },
            this.showAgency,
            this.showBrand,
            { text: 'Contacto', value: 'contact' },
            { text: 'Servicio(s)', value: 'services' },
            { text: 'Fecha de Servicio', value: 'service_date' },
            { text: 'Subtotal', value: 'subtotal' },
            { text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
            { text: '% Peach', value: 'percent_peach' },
            { text: '% Influencer', value: 'percent_influencer' },
            { text: '$ Peach', value: 'amount_peach' },
            { text: '$ Influencer', value: 'influencer_amount' },
            //{ text: 'Factura Influencer', value: 'influencer_invoice' },
            { text: 'Fecha Pago Influencer', value: 'influencer_payment_date' },
            { text: 'Factura', value: 'invoice' },
            { text: 'Fecha Factura', value: 'invoice_date' },
            { text: 'Promesa de Pago', value: 'promise_date' },
            { text: 'Fecha de Pago', value: 'pay_date' },
            { text: 'Responsable', value: 'salesman' },
            { value: 'actions', sortable: false, align: 'end', },
            { value: 'PROMESA_DE_PAGO', sortable: false, align: 'end', }
        ]},
        quotationsLists(){
            var quotations = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido')
            if(this.chip1==true){
                quotations = quotations.filter(quotation=>quotation.pay_date==null || quotation.influencer_payment_date==null)
            }
            if(this.company!='' && this.company!=undefined && this.company!=null){
                var a_or_b = this.$store.state.company.companies.filter(company=>company.id == this.company).map(company=>company.client_type)[0]
                if(a_or_b == 'agency'){
                    quotations = quotations.filter(quotation=>quotation.agency_id == this.company)
                }else if(a_or_b == 'brand'){
                    quotations = quotations.filter(quotation=>quotation.brand_id == this.company)
                }
            }
            if(this.influencer!=undefined && this.influencer!='' & this.influencer!=null){
                quotations = quotations.filter(quotation=>this.influencerId(quotation.items))
            }
            return quotations = quotations.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    agency:this.companyName(id.agency_id),
                    brand:this.companyName(id.brand_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
                    total:id.total,
                    pdf:id.pdf,
                    note:id.note,
                    //date:id.date,//.slice(0, 10),
                    influencer:this.salesman(this.mapItems(id.items, id.id)[0].influencer_id),
                    services:this.servicess(id.items, id.id),
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                    subtotal:id.subtotal,
                    iva:id.iva,                    
                    invoice:id.invoice,
                    created_by_user_id:this.salesman(id.created_by_user_id),
                    last_updated_by_user_id:this.salesman(id.last_updated_by_user_id),
                    invoice_date:id.invoice_date,
                    service_date:id.service_date,
                    promise_date:id.promise_date,
                    influencer_payment_date:id.influencer_payment_date,

                    percent_influencer:((100/id.subtotal)*id.influencer_amount).toFixed(0) + '%',
                    percent_peach:((100/id.subtotal)*((id.subtotal*1)-(id.influencer_amount*1))).toFixed(0) + '%',
                    amount_peach:((id.subtotal*1)-(id.influencer_amount*1)),
                    influencer_amount:(id.influencer_amount*1),

                    booking:this.booking(this.mapItems(id.items, id.id)[0].influencer_id),
                    payment_date:id.payment_date,
                    pay_date:id.pay_date,
                    influencer_invoice:id.influencer_invoice,
                    payment_date:id.payment_date,

                    PROMESA_DE_PAGO: this.promesadepago(id.promise_date, id.created_at)
                }
            });
        },
        rejectionsLists(){
            return this.$store.state.rejection.rejections;
        },
        quotationsList(){
            return this.$store.state.quotation.sales
        },

        likesAllFruit () {
            return this.selectedHeaders.length === this.headersMap.length
        },
        likesSomeFruit () {
            return this.selectedHeaders.length > 0 && !this.likesAllFruit
        },
        icon () {
            if (this.likesAllFruit) return 'mdi-close-box'
            if (this.likesSomeFruit) return 'mdi-minus-box'
            return 'mdi-checkbox-blank-outline'
        },
    },
    created () {
        this.quotations = this.quotationsLists
        this.headers = Object.values(this.headersMap);
        this.selectedHeaders = this.headers;
    },
    directives: {
        'sortable-table': {
            inserted: (el, binding) => {
                el.querySelectorAll('th').forEach((draggableEl) => {
                    // Need a class watcher because sorting v-data-table rows asc/desc removes the sortHandle class
                    watchClass(draggableEl, 'sortHandle');
                    draggableEl.classList.add('sortHandle');
                });
                Sortable.create(el.querySelector('tr'), binding.value ? { ...binding.value, handle: '.sortHandle' } : {});
            },
        },
    },
    methods: {
        promesadepago(promise_date, created_at){
            if(promise_date!=null){
                return this.month(promise_date.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(5,7)) + ' ' + promise_date.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,4)
            }else{
                return this.month(created_at.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(5,7)) + ' ' + created_at.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,4)
            }
        },
        sortTheHeadersAndUpdateTheKey(evt) {
            const headersTmp = this.showHeaders;
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;
            if (newIndex >= headersTmp.length) {
                let k = newIndex - headersTmp.length + 1;
                while (k--) {
                    headersTmp.push(undefined);
                }
            }
            headersTmp.splice(newIndex, 0, headersTmp.splice(oldIndex, 1)[0]);
            this.table = headersTmp;
            this.anIncreasingNumber += 1;
        },
        toggle () {
            this.$nextTick(() => {
                if (this.likesAllFruit) {
                    this.selectedHeaders = []
                } else {
                    this.selectedHeaders = this.headersMap.slice()
                }
            })
        },
        month(date){
            var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
            return meses[(date*1)-1]
        },
        sumField(key) {//suma
            var suma=this.quotations.reduce((a, b) => a + (b[key] || 0), 0)
            return suma.toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})
        },
        avgField(key){//primedio
            var suma=this.quotations.reduce((a, b) => a + (b[key] || 0), 0)
            return (suma/this.quotations.length).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})
        },
        itemRowBackground: function (item) {
            if(item.pay_date!=null){
                if(item.influencer_payment_date!=null){
                    return 'style-3'
                }else{
                    return 'style-1'
                }
            }
            else if(item.influencer_payment_date!=null){
                return 'style-2'
            }
        },
        booking(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(influencer=>influencer.booking)[0]
        },
        influencerPayment(id){
            this.quotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.id == id)[0]
            this.influencerPaymentDialg = true
        },
        promiseDate(id){
            this.quotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.id == id)[0]
            this.promiseDateDialog = true
        },
        liquidar(id){
            this.quotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.id == id)[0]
            this.liquidarDialog = true
        },
        saveInfluencerPayment(){
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/update",Object.assign(this.quotation)).then(response=>{
                this.influencerPaymentDialg = false
                this.$store.dispatch('quotation/getQuotations')
            })
        },
        savePromiseDate(){
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/update",Object.assign(this.quotation)).then(response=>{
                this.promiseDateDialog = false
                this.$store.dispatch('quotation/getQuotations')
            })
        },
        saveLiquidacion(){
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/update",Object.assign(this.quotation)).then(response=>{
                this.liquidarDialog = false
                this.$store.dispatch('quotation/getQuotations')
            })
        },
        servicess(items){
            var newItems = []
            for(var i=0; i<items[0].items.length; i++){
                newItems = newItems.concat(items[0].items[i].item)
            }
            return newItems
        },
        mapItems(items, id){
            var newItems = []
            if(this.influencer!=undefined && this.influencer!='' & this.influencer!=null){
                for(var i=0; i<items.length; i++){
                    if(items[i].influencer_id==this.influencer){
                        for(var j=0; j<items[i].items.length; j++){
                            items[i].items[j].influencer_id = items[i].influencer_id
                            items[i].items[j].sale_id = id
                            newItems = newItems.concat(items[i].items[j])
                        }
                    }
                }
                return newItems
            }else{ 
                for(var i=0; i<items.length; i++){
                    for(var j=0; j<items[i].items.length; j++){
                        items[i].items[j].influencer_id = items[i].influencer_id
                        items[i].items[j].sale_id = id
                        newItems = newItems.concat(items[i].items[j])
                    }
                }
                return newItems
            }
        },
        influencerId(items){
            for(var i=0; i<items.length; i++){
                if(items[i].influencer_id == this.influencer){
                    return true
                }
            }
        },
        statuses(id, bar, total, companyId){
            if(new Date(this.delivery(id)) > new Date()){
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
                this.$store.dispatch('quotation/getSales')
                this.$store.dispatch('quotation/getCancellations')
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
            this.quotations = ''
            var filterQuotation = this.$store.state.quotation.quotations
            
            if(this.company!='' && this.company!=undefined && this.company!=null){
                var a_or_b = this.$store.state.company.companies.filter(company=>company.id == this.company).map(company=>company.client_type)[0]
                if(a_or_b == 'agency'){
                    filterQuotation = filterQuotation.filter(quotation=>quotation.agency_id == this.company)
                }else if(a_or_b == 'brand'){
                    filterQuotation = filterQuotation.filter(quotation=>quotation.brand_id == this.company)
                }
            }

            if(this.influencer!=undefined && this.influencer!='' & this.influencer!=null){
                filterQuotation = filterQuotation.filter(quotation=>this.influencerId(quotation.items))
            }
            
            if(params.id!='' && params.id!=null && params.id!=undefined){
                filterQuotation=filterQuotation.filter(quotation=>quotation.id==params.id)
            } 
            if(params.invoice!='' && params.invoice!=null && params.invoice!=undefined){
                filterQuotation=filterQuotation.filter(quotation=>this.lowerCase(quotation.invoice).includes(params.invoice.toLowerCase()))
            } 
            if(params.status!='' && params.status!=null && params.status!=undefined){
                this.chip1 = false
                if(params.status=='Pagadas'){
                    filterQuotation=filterQuotation.filter(quotation=>quotation.pay_date!=null)
                }
                else if(params.status=='Pagadas a Influencer'){
                    filterQuotation=filterQuotation.filter(quotation=>quotation.influencer_payment_date!=null)
                }
                else if(params.status=='Completadas'){
                    filterQuotation=filterQuotation.filter(quotation=>quotation.pay_date!=null && quotation.influencer_payment_date!=null)
                }
                else if(params.status=='Pendientes'){
                    filterQuotation = filterQuotation.filter(quotation=>quotation.pay_date==null || quotation.influencer_payment_date==null)
                }
            }else{
                filterQuotation = filterQuotation.filter(quotation=>quotation.pay_date==null || quotation.influencer_payment_date==null)
            }
            if(params.agency!='' && params.agency!=null && params.agency!=undefined){
                var uno = filterQuotation.filter(quotation=>quotation.agency_id == params.agency[0])
                for(var i=1; i<params.agency.length; i++){
                    uno=uno.concat(filterQuotation.filter(quotation=>quotation.agency_idd == params.agency[i]))   
                }
                filterQuotation = this.removeDuplicates(uno, "id");
            } 
            if(params.brand!='' && params.brand!=null && params.brand!=undefined){
                var dos = filterQuotation.filter(quotation=>quotation.brand_id == params.brand[0])
                for(var i=1; i<params.brand.length; i++){
                    dos=dos.concat(filterQuotation.filter(quotation=>quotation.brand_id == params.brand[i]))   
                }
                filterQuotation = this.removeDuplicates(dos, "id");
            } 
            if(params.contact!='' && params.contact!=null && params.contact!=undefined){
                var tres = filterQuotation.filter(quotation=>quotation.contact_id == params.contact[0])
                for(var i=1; i<params.contact.length; i++){
                    tres=tres.concat(filterQuotation.filter(quotation=>quotation.contact_id == params.contact[i]))   
                }
                filterQuotation = this.removeDuplicates(tres, "id");
            } 
            if(params.user_id!='' && params.user_id!=null && params.user_id!=undefined){
                var cuatro = filterQuotation.filter(quotation=>quotation.user_id == params.user_id[0])
                for(var i=1; i<params.user_id.length; i++){
                    cuatro=cuatro.concat(filterQuotation.filter(quotation=>quotation.user_id == params.user_id[i]))   
                }
                filterQuotation = this.removeDuplicates(cuatro, "id");
            } 
            if(params.influencer_payment_date!=null && params.influencer_payment_date.length==2){
                filterQuotation=filterQuotation.filter(quotation=>
                    quotation.influencer_payment_date>=params.influencer_payment_date[0] &&
                    quotation.influencer_payment_date<=params.influencer_payment_date[1]
                )
            } 
            if(params.invoice_date!=null && params.invoice_date.length==2){
                filterQuotation=filterQuotation.filter(quotation=>
                    quotation.invoice_date>=params.invoice_date[0] &&
                    quotation.invoice_date<=params.invoice_date[1]
                )
            } 
            if(params.promise_date!=null && params.promise_date.length==2){
                filterQuotation=filterQuotation.filter(quotation=>
                    quotation.promise_date>=params.promise_date[0] &&
                    quotation.promise_date<=params.promise_date[1]
                )
            } 
            if(params.pay_date!=null && params.pay_date.length==2){
                filterQuotation=filterQuotation.filter(quotation=>
                    quotation.pay_date>=params.pay_date[0] &&
                    quotation.pay_date<=params.pay_date[1]
                )
            } 

            filterQuotation = filterQuotation.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    agency:this.companyName(id.agency_id),
                    brand:this.companyName(id.brand_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
                    total:id.total,
                    pdf:id.pdf,
                    note:id.note,
                    //date:id.date,//.slice(0, 10),
                    influencer:this.salesman(this.mapItems(id.items, id.id)[0].influencer_id),
                    services:this.servicess(id.items, id.id),
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                    subtotal:id.subtotal,
                    iva:id.iva,                    
                    invoice:id.invoice,
                    created_by_user_id:this.salesman(id.created_by_user_id),
                    last_updated_by_user_id:this.salesman(id.last_updated_by_user_id),
                    invoice_date:id.invoice_date,
                    service_date:id.service_date,
                    promise_date:id.promise_date,
                    influencer_payment_date:id.influencer_payment_date,

                    percent_influencer:((100/id.subtotal)*id.influencer_amount).toFixed(0) + '%',
                    percent_peach:((100/id.subtotal)*((id.subtotal*1)-(id.influencer_amount*1))).toFixed(0) + '%',
                    amount_peach:((id.subtotal*1)-(id.influencer_amount*1)),
                    influencer_amount:(id.influencer_amount*1),

                    booking:this.booking(this.mapItems(id.items, id.id)[0].influencer_id),
                    payment_date:id.payment_date,
                    pay_date:id.pay_date,
                    influencer_invoice:id.influencer_invoice,
                    payment_date:id.payment_date,

                    PROMESA_DE_PAGO: this.promesadepago(id.promise_date, id.created_at)
                }
            });

            if(params.booking!='' && params.booking!=null && params.booking!=undefined){
                filterQuotation = filterQuotation.filter(quotation=>quotation.booking == params.booking)
            } 

            this.quotations = filterQuotation
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
            this.$store.dispatch('quotation/getSales')
        },
        closeCreateDialogQuotation: function(params) {
            this.createDialog = false;
            this.$store.dispatch('quotation/getSales')
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
                this.$store.dispatch('quotation/getSales')
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
            this.quotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.id == id)[0]
            this.editDialog = true
        },
        salesman(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.name)[0]
        },
        influencerAccount(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.bank_account_details.account)[0]
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
        esta(item){
            var payments = this.$store.state.influencer_payment.influencer_payments.filter(payment=>payment.influencer_id == item.influencer_id)
            if(payments.length>0){
                var paymentsDetails = payments[0].salesID
                for(var a=1; a<payments.length; a++){
                    paymentsDetails = paymentsDetails.concat(payments[a].salesID)
                }
                //solo los pagos relacionados a la venta
                paymentsDetails = paymentsDetails.filter(payment=>payment.sale_id == item.sale_id)
                if(paymentsDetails.length>0){
                    //detalles de pago por servicio relacionados a la venta
                    var paymentsDetailsNew = paymentsDetails[0].details
                    for(var b=1; b<paymentsDetails.length; b++){
                        paymentsDetailsNew = paymentsDetailsNew.concat(paymentsDetails[b].details)
                    }
                    for(var d=0; d<paymentsDetailsNew.length; d++){
                        if(paymentsDetailsNew[d].index == item.index){
                            return true
                        }else{
                            return false
                        }
                    }
                }else{
                    return false
                }
            }else{
                return false
            }
        },
    }
}
</script>
<style>
    .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
        box-shadow: none!important;
        background: #f7f7f7;
    }
    .style-1 {
        background-color: #fff2ca;
    }
    .style-2 {
        background-color: #d9ebff;
    }
    .style-3 {
        background-color: #0080002b;
    }
    .v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > th{
        padding: 0 8px!important;
    }
    .v-data-table > .v-data-table__wrapper > table > tbody > tr > td{
        font-size:13px!important;
    }
    .v-row-group__header .ma-0.v-btn.v-btn--icon.v-btn--round.theme--light.v-size--small:nth-child(2){
        display:none!important;
    }
    .v-data-table-header th {
        white-space: nowrap;
    }
    .theme--light.v-data-table .v-row-group__header, .theme--light.v-data-table .v-row-group__summary {
        background: #f4f5fa;
    }
    .v-text-field--outlined fieldset {
        border-color: #e0e0e0;
    }
    .v-list-item__action {
        margin: 0px 20px 0px 0px!important;
    }
    .v-menu__content.theme--light.menuable__content__active{
        max-height: 85vh!important;
    }
</style>