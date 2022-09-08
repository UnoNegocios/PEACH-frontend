<template>
    <v-card>
        <v-card-title>
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span>Nueva Pago</span>
            <v-spacer></v-spacer>
        </v-card-title>
        <v-divider></v-divider>
         <v-stepper v-model="e1" class="elevation-0">
            <v-stepper-header class="elevation-0">
                <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 1" step="1"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step style="font-weight:bolder!important;" step="2"></v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <v-container class="pt-0">
                            <v-row >
                                <v-col cols="12" sm="6" md="6" class="pt-0">
                                    <v-autocomplete clearable v-model="editedItem.influencer_id" :items="usersLists" label="Influencer" item-text="name" item-value="id">
                                        <template slot="no-data"><div class="px-4 py-1">No existen influencers relacionados.</div></template>                      
                                    </v-autocomplete>
                                    <v-text-field type=number v-model="editedItem.amount" label="Monto"></v-text-field>
                                    <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="editedItem.date" label="Fecha de Pago" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker color="primary" v-model="editedItem.date" @input="datePicker = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="6" md="6" class="pt-0">
                                    <v-container fluid>
                                        <v-textarea v-model="editedItem.note" label="Referencia"></v-textarea>
                                    </v-container>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
                <v-stepper-content step="2" class="pt-0">
                    <v-card-text class="pb-0 pt-0" v-if="editedItem.influencer_id!=''&&editedItem.influencer_id!=null&&editedItem.influencer_id!=undefined&&editedItem.amount!=''&&editedItem.amount!=null&&editedItem.amount!=undefined">
                        <v-container class="pt-0">
                            <v-data-table show-expand v-if="renderComponent" :headers="headers" :items="salesLists" item-key="id" class="elevation-1">
                                
                                <!-- Detalle -->
                                <template v-slot:expanded-item="{ headers, item }">
                                    <td :colspan="headers.length">
                                        <v-data-table :headers="headers2" :items="item.items" class="elevation-0 my-4">
                                            
                                            <template v-slot:[`item.select`]="{ item }">
                                                <v-btn class="elevation-0" fab dark 
                                                :outlined="paja(item)" color="primary" @click="checkbox(item)"
                                                style="height: 21px!important; width: 21px!important;">
                                                    <v-icon dark small>
                                                        mdi-check
                                                    </v-icon>
                                                </v-btn>
                                            </template>

                                        </v-data-table>
                                    </td>
                                </template>

                                <template v-slot:[`item.payment`]="{ item }">
                                    {{(item.total - item.newDue).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                </template>
                                <template v-slot:[`item.total`]="{ item }">
                                    {{item.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                </template>
                                <template v-slot:[`item.newDue`]="{ item }">
                                    {{item.newDue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                </template>
                            </v-data-table>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
        <v-row class="ma-0 pa-0">
            <v-col cols="12" sm="12" md="6">
                <v-menu top offset-x>
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
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" text  v-if="e1>1" @click="e1 = e1-1">
                        <v-icon v-if="!isMobile()">mdi-chevron-left</v-icon>
                        Regresar
                    </v-btn>
                    <v-btn color="blue darken-1" text  v-if="e1!=2" @click="e1 = e1+1" :disabled="grey">
                        Siguiente
                        <v-icon v-if="!isMobile()">mdi-chevron-right</v-icon>
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save" :loading="gris" :disabled="gris || grey">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import vue2Dropzone from "vue2-dropzone";
    import "vue2-dropzone/dist/vue2Dropzone.min.css";
    import axios from "axios";
    export default {
        props:{
            influencer:String
        },
        components: {
            vueDropzone: vue2Dropzone,
        },   
        data: () => ({
            gris:false,
            renderComponent: true,
            selected: [],
            index:[],
            headers: [
                { text: '', value: 'data-table-expand' },
                { text: 'Id', value: 'id'},
                { text: 'Factura', value: 'invoice' },
                { text: 'Monto', value: 'total' },
            ],
            headers2:[
                { text: '', value: 'select', sortable: false, align: 'start', },
                { text: 'Id', value: 'index'},
                //{ text: 'Pagado', value: 'pay'},
                { text: 'Cantidad', value: 'quantity'},
                { text: 'Servicio', value: 'item'},
                { text: 'Precio', value: 'price'},
            ],
            e1: 1,
            datePicker:'',
            dropzoneOptions: {
                url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/collection/files",
                addRemoveLinks: true,
                maxFiles: 1
            },
            editedItem:{
                influencer_id:'',
                salesID:[],
                date:'',
                amount:'',
                note:'',
                pdf:'',
                created_by_user_id:'',
                last_updated_by_user_id:'',
            },
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
        }),
        computed: {
            grey(){
                if(this.editedItem.influencer_id==''||this.editedItem.influencer_id==null||this.editedItem.influencer_id==undefined ||
                    this.editedItem.amount==''||this.editedItem.amount==null||this.editedItem.amount==undefined){
                        return true
                }else{
                    return false
                }
            },
            usersLists(){
                return this.$store.state.user.users.filter(user=>user.job_position == 'Influencer');
            }, 
            salesLists(){
                if(this.renderComponent == true){
                    var respuesta = this.$store.state.quotation.quotations
                    .filter(quotation=>quotation.status == 'vendido')
                    .filter(quotation=>this.influencerId(quotation.items))
                    .map(id=>{
                        return{
                            id:id.id,
                            total:id.total,//.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                            invoice:id.invoice,
                            due:this.due(id.id, id.total),//.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                            newDue:this.newDue(id.id, id.total),
                            invoice_date:id.invoice_date,
                            payment: (id.total-this.due(id.id, id.total)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                            items:this.detailSalesLists(id.id)
                        }
                    }).filter(quotation=>quotation.items.length>0)

                    for(var i=0; i<respuesta.length; i++){
                        this.selected.push({sale_id:'',details:[],index:0})
                        this.index.push({index:''})
                        this.selected[i].sale_id = respuesta[i].id
                        this.selected[i].details = []
                        this.selected[i].index = i
                        this.index[i].index = 0
                    }
                    return respuesta
                }
            },
            currentUser:{
                get(){
                    return this.$store.state.currentUser.user
                }
            },
        },
        created(){
            if(this.company!=undefined){
                this.editedItem.influencer_id=Number(this.influencer)
            }  
        },
        methods: {
            influencerId(items){
                for(var i=0; i<items.length; i++){
                    if(items[i].influencer_id == this.editedItem.influencer_id){
                        return true
                    }
                }
            },
            addIdQuotation(items, quotationId){
                return items.map(id=>{
                    return{
                        influencer_id: id.influencer_id,
                        items: id.items,
                        sale_id: quotationId
                    }
                });
            },
            detailSalesLists(id){
                var perrillo = id
                var perro = this.$store.state.quotation.quotations
                .filter(quotation=>quotation.id == id)
                .map(quotation=>this.addIdQuotation(quotation.items, quotation.id))[0]
                .filter(item=>item.influencer_id == this.editedItem.influencer_id)

                .map(item=>this.esta(item))

                if(perro.length>0){
                    var quotationDetail = []
                    for(var j=0; j<perro.length; j++){
                        for(var i=0; i<perro[j].items.length; i++){
                            quotationDetail = quotationDetail.concat(perro[j].items[i])
                        }
                    }
                    return quotationDetail.map(id=>{
                        return{
                            sale_id:perrillo,
                            index:id.index,
                            pay:id.pay,
                            quantity:id.quantity,
                            item:id.item,
                            price:(id.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                        }
                    });
                }
            },
            esta(item){
                //lista de pagos a la influencer de la venta
                var payments = this.$store.state.influencer_payment.influencer_payments.filter(payment=>payment.influencer_id == item.influencer_id)
                //id de la venta
                var sale_id = item.sale_id
                //ventas relacionadas a los pagos a la influencer
                if(payments.length>0){
                    var paymentsDetails = payments[0].salesID
                    for(var a=1; a<payments.length; a++){
                        paymentsDetails = paymentsDetails.concat(payments[a].salesID)
                    }
                    //solo los pagos relacionados a la venta
                    paymentsDetails = paymentsDetails.filter(payment=>payment.sale_id == sale_id)
                    if(paymentsDetails.length>0){
                        //detalles de pago por servicio relacionados a la venta
                        var paymentsDetailsNew = paymentsDetails[0].details
                        for(var b=1; b<paymentsDetails.length; b++){
                            paymentsDetailsNew = paymentsDetailsNew.concat(paymentsDetails[b].details)
                        }
                        //nuevo detalle de venta
                        var newItem = {
                            influencer_id:item.influencer_id,
                            items:[],
                            sale_id:item.sale_id,
                        }
                        //rellenar detalle de venta
                        for(var c=0; c<item.items.length; c++){
                            var si = 2
                            for(var d=0; d<paymentsDetailsNew.length; d++){
                                if(item.items[c].index == paymentsDetailsNew[d].index){
                                    si = si+2
                                }
                            }
                            if(si==2){
                                newItem.items = newItem.items.concat(item.items[c])
                            }
                        }
                        return newItem
                    }else{
                        return item
                    }
                }else{
                    return item
                }
            },
            isMobile() {
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    return true
                } else {
                    return false
                }
            },
            render(){
                this.renderComponent = false;
                this.$nextTick(() => {
                    this.renderComponent = true;
                });
            },
            checkbox(sale){
                var perro = ''
                var index = this.selected.filter(selec=>selec.sale_id == sale.sale_id).map(selec=>selec.index)[0]
                for(var i=0; i<this.selected[index].details.length; i++){
                    if(this.selected[index].details[i].index==sale.index){
                        perro = i+3
                    }
                }
                var id = sale.sale_id
                if(perro>2){
                    this.remove(id, (perro-3))
                }else{
                    this.add(id, sale)
                }
            },
            paja(sale){
                var perro = true
                var details = this.selected.filter(selec=>selec.sale_id == sale.sale_id)
                if(details != undefined){
                    var sind = details.map(selec=>selec.index)[0]
                    var seleccion = this.selected[sind].details
                    for(var i=0; i<seleccion.length; i++){
                        if(JSON.stringify(seleccion[i]) == JSON.stringify(sale)){
                            perro = false
                        }
                    }
                    return perro
                }
            },
            add(id, sale){
                var index = this.selected.filter(selec=>selec.sale_id == id).map(selec=>selec.index)
                this.selected[index].details.push(sale)
                this.index[index].index = this.index[index].index + 1
                /*
                var sum = 0
                var oldSum = 0
                for(var i=0; i<this.selected.length; i++){
                    if(i>0){
                        oldSum = oldSum + this.selected[i-1].due
                    }
                    sum = sum + this.selected[i].due
                    if(this.editedItem.amount-sum < 0){
                        this.selected[i].amount = this.selected[i].due + (this.editedItem.amount-sum )
                    }else{
                        this.selected[i].amount = this.selected[i].due
                    }      
                }
                if(this.editedItem.amount-oldSum < 0){
                    this.remove(this.index)
                }else{
                    this.index=this.index+1
                }
                this.$nextTick(() => {
                    this.render()
                })
                */
            },
            remove(id, index){
                var ndx = this.selected.filter(selec=>selec.sale_id == id).map(selec=>selec.index)

                this.selected[ndx].details.splice(index, 1);
                this.index[ndx].index = this.index[ndx].index - 1
                /*
                this.$nextTick(() => {
                    this.render()
                })
                */
            },
            due(id, total){
                var collections = this.$store.state.collection.collections.filter(collection=>collection.influencer_id == this.editedItem.influencer_id).map(collection=>collection.salesID)
                var sum = 0
                var collections2 = []
                for(var j=0; j<collections.length; j++){
                    var collections2 = collections[j]
                    for(var i=0; i<collections2.length; i++){
                        if(collections2[i].id == id){
                            sum = (sum*1) + (collections2[i].amount*1)
                        }
                    }
                }
                return ((total*1) - (sum*1))
            },
            newDue(id, total){
                var collections = this.$store.state.collection.collections.filter(collection=>collection.influencer_id == this.editedItem.influencer_id).map(collection=>collection.salesID)        
                var sum = 0
                for(var j=0; j<collections.length; j++){
                    var collections2 = collections[j]
                    for(var i=0; i<collections2.length; i++){
                        if(collections2[i].id == id){
                            sum = (sum*1) + (collections2[i].amount*1)
                        }
                    }
                }
                for(var i=0; i<this.selected.length; i++){
                    if(this.selected[i].id==id){
                        sum = (sum*1) + (this.selected[i].amount*1)
                    }
                }
                return ((total*1) - (sum*1))
            },
            companyName(id){
                if(id!=null && id!=undefined && id!=''){
                    return ' | ' + this.$store.state.company.companies.filter(company=>company.id == id).map(company=>company.name)[0]
                }
            },
            contact(id){
                if(id!=null && id!=undefined && id!=''){
                    return ' | ' + this.$store.state.contact.contacts.filter(contact=>contact.id == id).map(contact=>contact.name)[0]
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
            uploadSuccess(file, response) {
                console.log('File Successfully Uploaded with file name: ' + response.file);
                this.fileName = response.file;
                this.editedItem.pdf = this.fileName;
            },
            uploadError(file, message) {
                console.log('An Error Occurred');
            },
            fileRemoved() {
                
            },
            close () {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.selected = []
                this.gris = false
                this.e1 = 1
                if(this.company!=undefined){
                    this.editedItem.influencer_id=Number(this.influencer)
                }
                this.$nextTick(() => {
                    this.$emit("closeCreateDialogCollection", false);
                })
            },
            save(){
                this.editedItem.created_by_user_id = this.currentUser.id
                this.editedItem.last_updated_by_user_id = this.currentUser.id
                if(this.editedItem.user_id==''){
                    this.editedItem.user_id = this.currentUser.id
                }
                this.gris = true
                for(var i=0; i<this.selected.length; i++){
                    if(this.selected[i].details.length>0){
                        this.editedItem.salesID.push(this.selected[i])
                    }
                }
                this.$nextTick(() => {
                    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencer_payment/create",Object.assign(this.editedItem)).then(response=>{
                        this.close()
                    })
                    
                })
            },
        },
    }
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
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

