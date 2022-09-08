<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterQuotations @filtersQuotation="filtersQuotation"/>
        </v-navigation-drawer>
        <!-- Contenedor show-expand -->
        <v-data-table :headers="headers" :items="quotations" class="elevation-0 px-6 py-4">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Pagos Influencers</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="filters=!filters">mdi-filter</v-icon>
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
            
            <template v-slot:[`item.total`]="{ item }">
                {{(item.total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <template v-slot:[`item.influencer_amount`]="{ item }">
                {{(item.influencer_amount*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
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
                No existen registros de pagos aún
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import Filter from "../influencers_payments/filter"
import moment from 'moment';
export default {
    props:{
        company:Number,
        influencer:String
    },
    components: {
        'filterQuotations':Filter,
    }, 
    data: () => ({
        filters: false,
        totalType:'sum',
        sumavg:['sum', 'avg'],
        campo:'total',
        campos:[
            { text: 'Total', value: 'total' },
            { text: 'Pago(s)', value: 'influencer_amount' },
        ],
    }),
    computed: {
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
        headers(){ 
            this.quotations = this.quotationsLists
            return [
            this.showAgency,
            this.showBrand,
            { text: 'Servicio(s)', value: 'services' },
            { text: 'Fecha de Servicio', value: 'service_date' },
            { text: 'Total', value: 'total' },
            { text: 'Porcentaje', value: 'percent_influencer' },
            { text: 'Pago', value: 'influencer_amount' },
            { text: 'Cuenta', value: 'influencer_account' },
            { text: 'Factura', value: 'influencer_invoice' },
            { text: 'Fecha Pago', value: 'influencer_payment_date' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        quotationsLists(){
            var quotations = this.$store.state.quotation.quotations.filter(quotation=>quotation.influencer_payment_date != null)
            if(this.company!='' && this.company!=undefined && this.company!=null){
                quotations = quotations.filter(quotation=>quotation.company_id == this.company)
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

                    percent_influencer:((100/id.subtotal)*id.influencer_amount).toFixed(2) + '%',
                    percent_peach:((100/id.subtotal)*((id.subtotal*1)-(id.influencer_amount*1))).toFixed(2) + '%',
                    amount_peach:((id.subtotal*1)-(id.influencer_amount*1)),
                    influencer_amount:(id.influencer_amount*1),

                    booking:this.booking(this.mapItems(id.items, id.id)[0].influencer_id),
                    payment_date:id.payment_date,
                    pay_date:id.pay_date,
                    influencer_invoice:id.influencer_invoice,
                    payment_date:id.payment_date

                }
            });
        },
    },
    created () {
        this.quotations = this.quotationsLists
    },
    methods: {
        sumField(key) {//suma
            var suma=this.quotations.reduce((a, b) => a + (b[key] || 0), 0)
            return suma.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
        },
        avgField(key){//primedio
            var suma=this.quotations.reduce((a, b) => a + (b[key] || 0), 0)
            return (suma/this.quotations.length).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
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
        filtersQuotation: function(params) {
            this.quotations = ''
            var filterQuotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.influencer_payment_date != null).filter(quotation=>this.influencerId(quotation.items))

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

            if(params.influencer_payment_date!=null && params.influencer_payment_date.length==2){
                filterQuotation=filterQuotation.filter(quotation=>
                    quotation.influencer_payment_date>=params.influencer_payment_date[0] &&
                    quotation.influencer_payment_date<=params.influencer_payment_date[1]
                )
            }
            this.quotations = filterQuotation.map(id=>{
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

                    percent_influencer:((100/id.subtotal)*id.influencer_amount).toFixed(2) + '%',
                    percent_peach:((100/id.subtotal)*((id.subtotal*1)-(id.influencer_amount*1))).toFixed(2) + '%',
                    amount_peach:((id.subtotal*1)-(id.influencer_amount*1)),
                    influencer_amount:(id.influencer_amount*1),

                    booking:this.booking(this.mapItems(id.items, id.id)[0].influencer_id),
                    payment_date:id.payment_date,
                    pay_date:id.pay_date,
                    influencer_invoice:id.influencer_invoice,
                    payment_date:id.payment_date

                }
            });
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