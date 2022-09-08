<template>
    <v-container class="ma-0 pa-0 pb-8">
        <v-row class="pt-10 px-8 pb-12">
            <strong>Filtros</strong>
            <v-spacer></v-spacer>
            <v-btn @click="removeFilter()" small class="elevation-0" style="border:solid 1px #dddddd;">
                <v-icon small class="mr-1">mdi-filter-off</v-icon>Limpiar
            </v-btn>

            <v-autocomplete v-model="quotation.agency" :items="agencyList" hide-no-data item-value="id" item-text="name" label="Agencia(s)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>

            <v-autocomplete v-model="quotation.brand" :items="brandList" hide-no-data item-value="id" item-text="name" label="Marca(s)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>
            
            <v-autocomplete v-model="quotation.contact" :items="contactList" hide-no-data item-value="id" item-text="name" label="Contacto(s)" placeholder="Escribe para buscar" attach chips multiple></v-autocomplete>
            
            <v-menu offset-y :close-on-content-click="closeDatePicker(quotation.influencer_payment_date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field clearable v-model="quotation.influencer_payment_date" label="Fecha Pago" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="quotation.influencer_payment_date" range></v-date-picker>
            </v-menu>

        </v-row>
        <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary">
            <v-list-item link @click="filter()" dark>
                <v-list-item-content>
                    <strong>Filtrar (0)</strong>
                </v-list-item-content>
            </v-list-item>    
        </v-card>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        quotation:{
            agency:'',
            brand:'',
            contact:'',
            influencer_payment_date:[],
        },
    }),
    computed:{
        agencyList(){
            return this.$store.state.company.companies.filter(company=>company.client_type == 'agency').map(id => {
                return{
                    id:id.id,
                    name:id.name,
                }
            })
        },
        brandList(){
            return this.$store.state.company.companies.filter(company=>company.client_type == 'brand').map(id => {
                return{
                    id:id.id,
                    name:id.name,
                }
            })
        },
        contactList(){
            var contacts = this.$store.state.contact.contacts
            if(this.quotation.brand!=null && this.quotation.brand!='' && this.quotation.brand!=undefined){
                var brand_contacts = contacts.filter(contact=>contact.company_id == this.quotation.brand_id);
                if(this.quotation.agency!=null && this.quotation.agency!='' && this.quotation.agency!=undefined){
                    return brand_contacts.concat(agency_contacts).map(id => {
                        return{
                            id:id.id,
                            name:id.name + ' ' + id.last,
                        }
                    })
                }else{
                    return brand_contacts.map(id => {
                        return{
                            id:id.id,
                            name:id.name + ' ' + id.last,
                        }
                    })
                }
            }
            else if(this.quotation.agency!=null && this.quotation.agency!='' && this.quotation.agency!=undefined){
                var agency_contacts =  contacts.filter(contact=>contact.company_id == this.quotation.agency_id);
                return agency_contacts.map(id => {
                    return{
                        id:id.id,
                        name:id.name + ' ' + id.last,
                    }
                })
            }else{
                return contacts.map(id => {
                    return{
                        id:id.id,
                        name:id.name + ' ' + id.last,
                    }
                })
            }
        }, 
    },
    methods:{
        closeDatePicker(dates){
            if(dates!=null && dates.length==2){
                return true
            }else{
                return false
            }
        },
        filter(){
            this.$emit("filtersQuotation", this.quotation);
        },
        removeFilter(){
            this.quotation = {
                agency:'',
                brand:'',
                contact:'',
                influencer_payment_date:[],
            },
            this.$nextTick(() => {
                this.$emit("filtersQuotation", this.quotation);
            })
        }
    }
}
</script>

<style>
.v-text-field {
    padding-top: 10px;
    margin-top: 0px;
}
</style>