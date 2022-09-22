<template>
    <v-container style="max-width:100vw;">
        <!--totals/-->
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterQuotations v-bind:company="[prop_brand_id, prop_agency_id]" @filtersQuotation="filtersQuotation"/>
        </v-navigation-drawer>
        <!-- Contenedor show-expand -->
        <v-data-table 
        group-by="FECHA_DE_PAGO" 
        :item-class="itemRowBackground" 
        :headers="showHeaders" 
        :items="quotations" 
        class="elevation-0 px-6 py-4"

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
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Pagos Influencers</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
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
            <template v-slot:[`item.total`]="{ item }">
                {{(item.total*1).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.influencer_amount`]="{ item }">
                {{(item.influencer_amount*1).toLocaleString('es-MX', { style: 'currency', minimumFractionDigits: 0, currency: 'MXN',})}}
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
    import Filter from "../sales/filter"
    import Create from "../quotations/create"
    import Edit from "../quotations/edit"
    import Email from "../quotations/sendQuotation"
    import Totals from "../sales/totals"
    export default {
        props:{
            prop_brand_id:Number,
            prop_agency_id:Number,
            influencer:String
        },
        components: {
            'filterQuotations':Filter,
            'create':Create,
            'edit':Edit,
            'email':Email,
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

            options: {},
            showTable:true,
            totalQuotations:0,
            loading:false,
            filterStorageLength:0,
            quotationsLength:0,
        }),
        computed: {
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
                    return { text: 'Agencia', value: 'agency',}
                }else{
                    return false
                }
            },
            showBrand(){
                if(this.prop_brand_id == null){
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
                this.showAgency,
                this.showBrand,
                //{ text: 'Contacto', value: 'contact' },
                { text: 'Servicio(s)', value: 'services' },
                { text: 'Fecha de Servicio', value: 'service_date' },
                { text: 'Total', value: 'total' },
                { text: 'Porcentaje', value: 'percent_influencer' },
                { text: 'Pago', value: 'influencer_amount' },

                { text: 'Factura', value: 'influencer_invoice' },
                { text: 'Fecha de Pago', value: 'influencer_payment_date' },
                { value: 'FECHA_DE_PAGO', sortable: false, align: 'end', }
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
                    this.getDataFromApi()
                },
                deep: true,
            }
        },
        methods: {
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
                    this.filterStorageLength = localStorage.getItem('filtersQuotationsLength')
                    const { sortBy, sortDesc, page, itemsPerPage } = this.options
                    var items = []
                    var total = 0
                    var link = this.$store.state.currentUser.sale_filter + '&'
                    if(localStorage.getItem('filtersQuotations')!=null){
                        link = JSON.parse(localStorage.getItem('filtersQuotations'))+'&'
                    }
                    if(this.prop_brand_id!=undefined){
                        link = 'filter[brand_id]=' + this.prop_brand_id + '&'
                    }
                    if(this.prop_agency_id!=undefined){
                        link = 'filter[agency_id]=' + this.prop_agency_id + '&'
                    }
                    if(this.influencer!=undefined){
                        link = 'filter[influencer_id]=' + this.influencer + '&'
                    }
                    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencer/payments?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                        this.companiesLength = response.data.meta.total
                        items = this.mapQuotations(response.data.data)
                        total = response.data.meta.total
                        if (sortBy.length === 1 && sortDesc.length === 1) {
                            if(sortDesc[0]){
                                axios
                                .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencer/payments?" + link + "page=" + page + "&sort=-" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                                .then(response=>{
                                    items = this.mapQuotations(response.data.data)
                                    total = response.data.meta.total
                                    resolve({
                                        items,
                                        total,
                                    })
                                })
                            }else{
                                axios
                                .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencer/payments?" + link + "page=" + page + "&sort=" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                                .then(response=>{
                                    items = this.mapQuotations(response.data.data)
                                    total = response.data.meta.total
                                    resolve({
                                        items,
                                        total,
                                    })
                                })
                            }
                        }else{
                            resolve({
                                items,
                                total,
                            })
                        }
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
            mapQuotations(quotations){
                quotations =  quotations.map(id=>{
                    return{
                        agency: this.agency(id.agency),
                        brand: id.brand.name,
                        services: id.service,
                        service_date: id.service_date,
                        total: id.total,
                        percent_influencer: ((100/id.subtotal)*(id.influencer_amount*1)).toFixed(2) + '%',
                        influencer_amount: id.influencer_amount,
                        influencer_payment_date: id.influencer_payment_date,
                        FECHA_DE_PAGO: this.promesadepago(id.influencer_payment_date, id.created_at)
                    }
                });
                return quotations
            },
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
            itemRowBackground: function (item) {
                if(item.pay_day!=null){
                    if(item.influencer_payment_date!=null){
                        return 'style-3'
                    }else{
                        return 'style-1'
                    }
                }
                else if(item.influencer_payment_date!=null){
                    return 'style-3'
                }
            },
            booking(id){
                return this.$store.state.user.users.filter(user=>user.id == id).map(influencer=>influencer.booking)[0]
            },
            influencerPayment(item){
                this.quotation = item
                this.influencerPaymentDialg = true
            },
            promiseDate(item){
                this.quotation = item
                this.promiseDateDialog = true
            },
            liquidar(item){
                this.quotation = item
                this.liquidarDialog = true
            },
            saveInfluencerPayment(){
                var editedItem = {
                    id:this.quotation.id,
                    bank_account: this.quotation.bank_account,
                    influencer_payment_date: this.quotation.influencer_payment_date
                }
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/sales/" + editedItem.id, editedItem).then(response=>{
                    this.influencerPaymentDialg = false
                    this.getDataFromApi()
                })
            },
            savePromiseDate(){
                var editedItem = {
                    id:this.quotation.id,
                    payment_promise_date:this.quotation.promise_date
                }
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/sales/" + editedItem.id, editedItem).then(response=>{
                    this.promiseDateDialog = false
                    this.getDataFromApi()
                })
            },
            saveLiquidacion(){
                var editedItem = {
                    id:this.quotation.id,
                    pay_day:this.quotation.pay_day
                }
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/sales/" + editedItem.id, editedItem).then(response=>{
                    this.liquidarDialog = false
                    this.getDataFromApi()
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

            },
            closeDialogEditQuotation: function(params) {
                this.editDialog = false;
                this.$store.dispatch('quotation/getSales')
            },
            closeCreateDialogQuotation: function(params) {
                this.createDialog = false;
                this.getDataFromApi()
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
            cancellItem(sale_id){
                var editedItem = {
                    id:sale_id,
                    sale_status: 'cancelado'
                }
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/sales" + editedItem).then(response => {
                    this.getDataFromApi()
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
            deleteItem (id) {
                this.deleteId = id
                this.sheet = true
            },
            editItem(item){
                this.quotation = [item].map(id=>{
                    return{
                        id:id.id,
                        agency_id:id.agency.id,
                        brand_id:id.brand.id,
                        user_id:id.agent.id,
                        pdf:id.pdf,
                        note:id.note,
                        sale_type:id.sale_type,
                        invoice:id.invoice,
                        influencer_id:id.influencer.id,
                        service_date:id.service_date,
                        service:id.service,
                        total:id.total,
                        agency:id.agency,
                        brand:id.brand,
                        influencer:id.influencer
                    }
                })[0]
                this.editDialog = true
            },
        }
    }
</script>
<style>