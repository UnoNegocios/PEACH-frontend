<template>
    <v-container style="max-width:100vw;">
        <totals v-bind:totalsFilters="{'selectedStatus':selectedStatus,'prop_brand_id':prop_brand_id,'prop_agency_id':prop_agency_id}"/>
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterQuotations v-bind:company="[prop_brand_id, prop_agency_id]" @filtersQuotation="filtersQuotation"/>
        </v-navigation-drawer>
        <!-- Contenedor show-expand -->
        <v-data-table 
        :item-class="itemRowBackground" 
        :headers="showHeaders" 
        :items="quotations" 
        class="elevation-0 px-6 py-4"
        group-by="month" 
        height="600"
        fixed-header
        :footer-props="{'items-per-page-options':[15, 30, 50, quotationsLength]}"
        v-if="showTable"
        :options.sync="options"
        v-sortable-table="{onEnd:sortTheHeadersAndUpdateTheKey}"
        :key="anIncreasingNumber" 
        :server-items-length="totalQuotations"
        :loading="loading">
            <!-- Header -->
            <template v-slot:group.header="{ items }">

                <td><strong>{{items[0].month}}</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><strong>{{sumItems(items).subtotal.toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}</strong></td>
                <td><strong>{{sumItems(items).iva.toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}</strong></td>
                <td><strong>{{sumItems(items).total.toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}</strong></td>
                <td></td>
                <td></td>
                <td><strong>{{sumItems(items).peach.toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}</strong></td>
                <td><strong>{{sumItems(items).influencer.toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </template>
            <template v-slot:top>
                <v-toolbar flat class="mb-2">
                    <v-toolbar-title>Cancelaciones</v-toolbar-title>

                    <v-btn icon v-if="filterStorageLength==0" @click="openFilter()">
                        <v-icon>mdi-filter</v-icon>
                    </v-btn>

                    <v-btn icon v-else @click="openFilter()">
                        <v-badge overlap color="primary">
                            <template v-slot:badge>
                                {{filterStorageLength}}
                            </template>
                            <v-icon>mdi-filter</v-icon>
                        </v-badge>
                    </v-btn>

                    <v-select style="max-width:300px!important;" class="ml-4 mt-6" v-model="selectedStatus" :items="statuses" label="Status de Venta" item-text="text" item-value="value" dense chips outlined small-chips></v-select>

                    <v-spacer></v-spacer>
                    <v-select style="max-width:350px!important;" class="mr-4 mt-6" v-model="selectedHeaders" :items="headers" label="Columnas" dense multiple outlined return-object>
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
                <v-row class="ma-0 pb-4 pt-2">
                    <v-icon color="#0080002b" class="mr-1">mdi-label</v-icon> 
                    <span style="font-size:12px; line-height:24px!important;">Ya se cobro al Cliente y se pago a Influencer</span>
                    <v-spacer/>
                    <v-icon color="#fff2ca" class="mr-1">mdi-label</v-icon> 
                    <span style="font-size:12px; line-height:24px!important;">Ya se cobro al Cliente y no se ha pagado a Influencer</span>
                    <v-spacer/>
                    <v-icon color="#d9ebff" class="mr-1">mdi-label</v-icon> 
                    <span style="font-size:12px; line-height:24px!important;">No se ha cobrado al Cliente y ya se pago a Influencer</span>
                    <v-spacer/>
                </v-row>
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
            <template v-slot:[`item.peach_amount`]="{ item }">
                {{(item.peach_amount*1).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.influencer_amount`]="{ item }">
                {{(item.influencer_amount*1).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.peach_percentage`]="{ item }">
                {{item.peach_percentage}}%
            </template>
            <template v-slot:[`item.influencer_percentage`]="{ item }">
                {{item.influencer_percentage}}%
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
                        <v-list-item @click="cancellItem(item.id)">
                            <v-icon small class="mr-2">
                                mdi-close
                            </v-icon>
                            Retomar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item.id)"  v-show="permissions('deleteSales')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
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
                No existen registros de cancelaciones aún
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
    import axios from "axios";
    import XLSX from 'xlsx';
    import Filter from "../canceled/filter";
    import Totals from "../canceled/totals";
    export default {
        props:{
            prop_brand_id:Number,
            prop_agency_id:Number,
            influencer:String
        },
        components: {
            'filterQuotations':Filter,
            'totals':Totals
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
            selectedStatus: 'pending_sales',
            statuses:[
                {text:'Todo', value:'all'},
                {text:'Ventas Pendientes', value:'pending_sales'},
                {text:'Ventas Completadas', value:'completed_sales'},
                {text:'Ventas Pagadas a Influencers', value:'paid_to_influencers'},
            ],
            options: {},
            showTable:true,
            totalQuotations:0,
            loading:false,
            filterStorageLength:0,
            quotationsLength:0,
        }),
        computed: {
            filterStorageLength(){
                return localStorage.getItem("filtersSalesLength")*1
            },
            showHeaders () {
                if(this.quotations!=''){
                    return this.headers.filter(s => this.selectedHeaders.includes(s));
                }else{
                    this.quotations = this.quotationsLists
                    return this.headers.filter(s => this.selectedHeaders.includes(s));
                }
            },
            showAgency(){
                if(this.prop_agency_id == null){
                    return { text: 'Agencia', value: 'agency', sortable: false}
                }else{
                    return false
                }
            },
            showBrand(){
                if(this.prop_brand_id == null){
                    return { text: 'Marca', value: 'brand', sortable: false}
                }else{
                    return false
                }
            },
            currentUser(){
                return this.$store.state.currentUser.user;
            },
            headersMap(){ 
                return [
                { text: 'Folio', value: 'id' },
                { text: 'Departamento', value: 'booking' },
                { text: 'Influencer', value: 'influencer', sortable: false},
                this.showAgency,
                this.showBrand,
                { text: 'Campaña', value: 'campaign' },
                //{ text: 'Contacto', value: 'contact' },
                { text: 'Servicio(s)', value: 'service' },
                { text: 'Fecha de Servicio', value: 'service_date' },
                { text: 'Subtotal', value: 'subtotal' },
                { text: 'IVA', value: 'iva' },
                { text: 'Total', value: 'total' },
                { text: '% Peach', value: 'peach_percentage' },
                { text: '% Influencer', value: 'influencer_percentage' },
                { text: '$ Peach', value: 'peach_amount' },
                { text: '$ Influencer', value: 'influencer_amount' },
                //{ text: 'Factura Influencer', value: 'influencer_invoice' },
                { text: 'Fecha Pago Influencer', value: 'influencer_payment_date' },
                { text: 'Factura', value: 'invoice' },
                { text: 'Fecha Factura', value: 'invoice_date' },
                { text: 'Promesa de Pago', value: 'payment_promise_date', sortable: false },
                { text: 'Fecha de Pago', value: 'pay_day' },
                { text: 'Responsable', value: 'salesman' },
                { value: 'actions', sortable: false, align: 'end', },
                { value: 'month', sortable: false, align: 'end', }
            ]},
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
        watch: {
            options: {
                handler () {
                    if(JSON.stringify(this.currentUser).length>10){
                        this.getDataFromApi()
                    }
                },
                deep: true,
            },
            selectedStatus: {
                handler () {
                    this.getDataFromApi()
                },
                deep: true,
            },
            currentUser: {
                handler () {
                    this.getDataFromApi()
                },
                deep: true,
            },
        },
        methods: {
            sumItems(items){
                var totals = {
                    subtotal:0,
                    iva:0,
                    total:0,
                    peach:0,
                    influencer:0
                }
                for(var i=0; i<items.length; i++){
                    totals.subtotal = totals.subtotal + (items[i].subtotal*1)
                    totals.iva = totals.iva + (items[i].iva*1)
                    totals.total = totals.total + (items[i].total*1)
                    totals.peach = totals.peach + (items[i].amount_peach*1)
                    totals.influencer = totals.influencer + (items[i].influencer_amount*1)

                }
                return totals
            },
            getDataFromApi () {
                this.loading = true
                this.apiCall().then(data => {
                    this.quotations = data.items
                    this.totalQuotations = data.total
                    this.loading = false
                })
            },
            apiCall () {
                return new Promise((resolve, reject) => {
                    this.filterStorageLength = localStorage.getItem('filtersSalesLength')
                    const { sortBy, sortDesc, page, itemsPerPage } = this.options
                    var items = []
                    var total = 0
                    var link = this.$store.state.currentUser.sale_filter
                    if(localStorage.getItem('filtersSales')!=null){
                        link = link + JSON.parse(localStorage.getItem('filtersSales'))+'&'
                    }
                    if(this.prop_brand_id!=undefined){
                        link = link + 'filter[brand_id]=' + this.prop_brand_id + '&'
                    }
                    if(this.prop_agency_id!=undefined){
                        link = link + 'filter[agency_id]=' + this.prop_agency_id + '&'
                    }
                    if(this.influencer!=undefined){
                        link = link + 'filter[influencer_id]=' + this.influencer + '&'
                    }
                    if(this.selectedStatus!='all'){
                        link = link + 'filter[' + this.selectedStatus + ']=1&'
                    }
                    if(sortBy.length === 1){
                        if(sortDesc[0]){
                            link = link + "sort=-" + sortBy[0] + '&'
                        }else{
                            link = link + "sort=" + sortBy[0] + '&'
                        }
                    }
                    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/sales?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage + '&status=cancelado').then(response => {
                        this.quotationsLength = response.data.meta.total
                        items = this.mapQuotations(response.data.data)
                        total = response.data.meta.total
                        resolve({
                            items,
                            total,
                        })
                    })
                })
            },
            agency(agency){
                if(agency!=undefined){
                    return agency.name
                }else{
                    return ''
                }
            },
            department(is_boooking){
                if(is_boooking){
                    return 'BOOKING'
                }else{
                    return 'MGMT'
                }
            },
            mapQuotations(quotations){
                quotations =  quotations.map(id=>{
                    return{
                        editedItem: id,
                        id: id.id,
                        booking: this.department(id.influencer.is_booking),
                        influencer: id.influencer.social_networks.instagram,
                        agency: this.agency(id.agency),
                        brand: this.agency(id.brand),
                        //contact: id.contact.name,
                        service: id.service,
                        service_date: id.service_date,
                        subtotal: id.subtotal,
                        iva: id.iva,
                        total: id.total,
                        percent_peach: ((100/id.subtotal)*((id.subtotal*1)-(id.influencer_amount*1))).toFixed(2) + '%',
                        percent_influencer: ((100/id.subtotal)*(id.influencer_amount*1)).toFixed(2) + '%',
                        amount_peach: (id.subtotal*1)-(id.influencer_amount*1),
                        influencer_amount: id.influencer_amount,
                        influencer_payment_date: id.influencer_payment_date,
                        invoice: id.invoice,
                        invoice_date: id.invoice_date,
                        payment_promise_date: id.payment_promise_date,
                        pay_day: id.pay_day,
                        salesman: id.agent.name + ' ' + id.agent.last,
                        promesa_de_pago: this.cualFecha(id.payment_promise_date, id.created_at.slice(0, 10)),
                        campaign:id.campaign,
                        influencer_percentage:id.influencer_percentage,
                        peach_percentage:id.peach_percentage,
                        peach_amount:id.peach_amount,
                        influencer_amount:id.influencer_amount
                    }
                }).sort((a, b) => {
                    return a.promesa_de_pago - b.promesa_de_pago;
                }).map(id=>{
                    return{
                        id: id.id,
                        booking: id.booking,
                        influencer: id.influencer,
                        agency: id.agency,
                        brand: id.brand,
                        service: id.service,
                        service_date: id.service_date,
                        subtotal: id.subtotal,
                        iva: id.iva,
                        total: id.total,
                        percent_peach: id.percent_peach,
                        percent_influencer: id.percent_influencer,
                        amount_peach: id.amount_peach,
                        influencer_amount: id.influencer_amount,
                        influencer_payment_date: id.influencer_payment_date,
                        invoice: id.invoice,
                        invoice_date: id.invoice_date,
                        payment_promise_date: id.payment_promise_date,
                        pay_day: id.pay_day,
                        salesman: id.salesman,
                        editedItem: id.editedItem,
                        month: this.promesadepago(id.promesa_de_pago),
                        campaign:id.campaign,
                        influencer_percentage:id.influencer_percentage,
                        peach_percentage:id.peach_percentage,
                        peach_amount:id.peach_amount,
                        influencer_amount:id.influencer_amount
                    }
                })
                return quotations
            },
            cualFecha(payment_promise_date, created_at){
                
                if(payment_promise_date!=null){
                    return new Date(payment_promise_date)
                }else{
                    return new Date(created_at)
                }
            },
            promesadepago(date){
                return this.month(date.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(5,7)) + ' ' + date.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,4)
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
            itemRowBackground: function (item) {
                if(item.pay_day!=null){
                    if(item.influencer_payment_date!=null){
                        return 'style-3'//verde
                    }else{
                        return 'style-1'//amarillo
                    }
                }
                else if(item.influencer_payment_date!=null){
                    return 'style-2'//celeste
                }
            },
            booking(id){
                return this.$store.state.user.users.filter(user=>user.id == id).map(influencer=>influencer.booking)[0]
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
            filtersQuotation: function(params) {
                this.getDataFromApi()
            },
            exportExcel: function () {
                let data = XLSX.utils.json_to_sheet(this.quotations)
                const workbook = XLSX.utils.book_new()
                const filename = 'Lista de Cotizaciones'
                XLSX.utils.book_append_sheet(workbook, data, filename)
                XLSX.writeFile(workbook, `${filename}.xlsx`)
            },
            haveAgency(agency){
                if(agency!=undefined){
                    return agency.id
                }else{
                    return ''
                }
            },
            deleteQuotation(){
                axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/sales/"+this.deleteId).then(response => {
                    this.deleteId = ''
                    this.sheet = false
                    this.getDataFromApi()
                });
            },
            cancellItem(sale_id){
                var editedItem = {
                    id:sale_id,
                    sale_status: 'vendido'
                }
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/sales" + sale_id, editedItem).then(response => {
                    this.getDataFromApi()
                });
            },
            cancel(){
                this.deleteId = ''
                this.sheet = false
                this.sheet2 = false
            },
            deleteItem (id) {
                this.deleteId = id
                this.sheet = true
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