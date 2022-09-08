<template>
    <div>
        <!-- PC slider reporte por mes/semana -->
        <!--div class="ml-6 hidden-sm-and-down">
            <v-carousel height="110" cycle hide-delimiter-background show-arrows-on-hover >
                <v-carousel-item style="background:#c57de4; border-radius: 10px 0px 0px 10px;">
                    <div class="px-5 pt-3 mb-2" transition="scroll-x-reverse-transition" style="color:white; font-size:16px!important;"><strong>Reporte del mes</strong></div>
                    <v-row class="pa-0">
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto pl-12 px-2 elevation-0 fondo" color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="40"><v-icon x-large color="#fac83c">  mdi-trending-neutral</v-icon></v-list-item-avatar>
                                    <v-list-item-content style="height: 70px!important;">
                                        <v-list-item-title style="color:white; font-size:18px!important; font-weight:300;" class="headline mb-0">
                                        Clientes <strong style="font-weight:900;">{{companiesMonth}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                            {{fecha('mes')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                        </v-col>
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto px-2 elevation-0 fondo"  color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="40"><v-icon x-large color="#85da60"> mdi-trending-up</v-icon></v-list-item-avatar>
                                    <v-list-item-content style="    height: 70px!important;">
                                        <v-list-item-title style="color:white; font-size:18px!important;" class="headline mb-0">
                                        Ventas <strong style="font-weight:900;">{{quotationsMonth.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                            {{fecha('mes')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                        </v-col>
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto px-2 elevation-0 fondo" max-width="344" color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="40"><v-icon x-large color="rgb(244 67 54 / 80%) !important">  mdi-trending-down</v-icon></v-list-item-avatar>
                                    <v-list-item-content style="    height: 70px!important;">
                                        <v-list-item-title style="color:white; font-size:18px!important;" class="headline mb-0">
                                        Actividades <strong style="font-weight:900;"></strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                        {{fecha('mes')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-carousel-item>
                <v-carousel-item style="background:#59c5ef; border-radius: 10px 0px 0px 10px;">
                    <div class="px-5 pt-3 mb-2" transition="scroll-x-reverse-transition" style="color:white; font-size:16px!important;"><strong>Reporte de la semana</strong></div>
                    <v-row class="pa-0">
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto pl-12 px-2 elevation-0 fondo" color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="40"><v-icon x-large color="#fac83c">  mdi-trending-neutral</v-icon></v-list-item-avatar>
                                    <v-list-item-content style="    height: 70px!important;">
                                        <v-list-item-title style="color:white; font-size:18px!important;" class="headline mb-0">
                                        Clientes <strong style="font-weight:900;">{{companiesWeek}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                            {{fecha('semana')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                        </v-col>
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto px-2 elevation-0 fondo"  color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="40"><v-icon x-large color="#85da60"> mdi-trending-up</v-icon></v-list-item-avatar>
                                    <v-list-item-content style="    height: 70px!important;">
                                        <v-list-item-title style="color:white; font-size:18px!important;" class="headline mb-0">
                                        Ventas <strong style="font-weight:900;">{{quotationsWeek.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                            {{fecha('semana')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                        </v-col>
                        <v-col cols="4" class="pa-0">
                            <v-card class="mx-auto px-2 elevation-0 fondo" max-width="344" color="transparent" >
                                <v-list-item three-line>
                                    <v-list-item-avatar tile size="40"><v-icon x-large color="red">  mdi-trending-down</v-icon></v-list-item-avatar>
                                    <v-list-item-content style="    height: 70px!important;">
                                        <v-list-item-title style="color:white; font-size:18px!important;" class="headline mb-0">
                                        Actividades <strong style="font-weight:900;"></strong>
                                        </v-list-item-title>
                                        <v-list-item-subtitle style="color:white;">
                                        {{fecha('semana')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-carousel-item>
            </v-carousel>
        </div-->
        <!-- MOVIL slider ventas por mes >
        <div class="mx-3 hidden-md-and-up mt-2" style="background:#c57de4; border-radius: 10px;">
            <v-carousel height="140" cycle hide-delimiter-background show-arrows-on-hover >
                <div class="pa-2 pb-0" transition="scroll-x-reverse-transition" style="color:white; font-size:16px!important;"><strong>Reporte del mes</strong></div>
                <v-carousel-item>
                    <v-card class="mx-auto px-2 elevation-0 fondo" color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="#fac83c">  mdi-trending-neutral</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Clientes <strong style="font-weight:900;">{{companiesMonth}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                    {{fecha('mes')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
                <v-carousel-item>    
                    <v-card class="mx-auto px-2 elevation-0 fondo"  color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="#85da60"> mdi-trending-up</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Ventas <strong style="font-weight:900;">{{quotationsMonth.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                    {{fecha('mes')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
                <v-carousel-item>
                    <v-card class="mx-auto px-2 elevation-0 fondo" color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="red">  mdi-trending-down</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Actividades <strong style="font-weight:900;"></strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                {{fecha('mes')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
            </v-carousel>
        </div-->
        <!-- MOVIL slider ventas por semana -->
        <div class="mx-3 mt-3 hidden-md-and-up" style="background:#59c5ef; border-radius: 10px;">
            <!-- cards -->
            <v-carousel height="140" cycle hide-delimiter-background show-arrows-on-hover >
                <div class="pa-5 pb-0" transition="scroll-x-reverse-transition" style="color:white; font-size:16px!important;"><strong>Reporte de la semana</strong></div>
                <!-- clientes -->
                <v-carousel-item>
                    <v-card class="mx-auto px-2 elevation-0 fondo" color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="#fac83c">  mdi-trending-neutral</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Clientes <strong style="font-weight:900;">{{companiesWeek}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                    {{fecha('semana')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
                <!-- ventas -->
                <v-carousel-item>    
                    <v-card class="mx-auto px-2 elevation-0 fondo"  color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="#85da60"> mdi-trending-up</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Ventas <strong style="font-weight:900;">{{quotationsWeek.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                    {{fecha('semana')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
                <!-- actividades -->
                <v-carousel-item>
                    <v-card class="mx-auto px-2 elevation-0 fondo" color="transparent" >
                        <v-list-item three-line>
                            <v-list-item-avatar class="my-0" tile size="80"><v-icon x-large color="rgb(244 67 54 / 80%) !important">  mdi-trending-down</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="color:white; font-size:21px!important;" class="headline mb-0">
                                Actividades <strong style="font-weight:900;"></strong>
                                </v-list-item-title>
                                <v-list-item-subtitle style="color:white;">
                                {{fecha('semana')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-carousel-item>
            </v-carousel>
        </div>
        <!--Contenido -->
        <div class="pa-6 pb-0">
            
                <!--v-col cols="12" sm="6" md="6">
                    <v-card elevation="0" class="pa-4" style="border-radius:0px;">
                        <iframe width="100%" height="400" src="https://www.youtube.com/embed/21IfehvNXDM" frameborder="0" autoplay="1" allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="6"-->
                <v-card elevation="0" class="py-4 px-8" style="border-radius:0px; overflow-y:scroll!important; max-height:436px!important; -overflow-scrolling:touch!important; -webkit-overflow-scrolling:touch!important;">
                    
                    <div style="color:black; margin-top:20px; font-size:21px; line-height:28px;"> <strong>PEACH AGENCY</strong></div>
                    <div style="background-color:#c57de4; height:4px; width:100px; margin-top:15px;"></div>
                    <v-row class="ma-0">
                        <v-col cols="12" sm="6" md="6" class="pr-8">
                            <v-row class="elevation-0 my-4 pa-4" style="border-bottom:solid 1px #c8cdd0;">
                                <div class="mr-4">
                                    <img style="height:30px;" src="https://www.gstatic.com/images/branding/product/2x/forms_2020q4_48dp.png">
                                </div>
                                <div class="pt-1" style="font-weight:500;">
                                    Documentos Institucionales
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn small href="https://drive.google.com/drive/u/0/folders/1__-ToA5VnMxiyG-k3dYG5GTUhl4R232N" color="#58c6ef" dark target="_blank" class="elevation-0">VER MÁS</v-btn>
                            </v-row>

                            <v-row class="elevation-0 my-4 pa-4" style="border-bottom:solid 1px #c8cdd0;">
                                <div class="mr-4">
                                    <img style="height:30px;" src="https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png">
                                </div>
                                <div class="pt-1" style="font-weight:500;">
                                    Management: Estructura Organizacional y de Talentos
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn small href="https://docs.google.com/presentation/d/19iOv8mQ5wZ7B8TiCblfAS13YXNKubZgKt5DZvre078s/edit#slide=id.p" color="#58c6ef" dark target="_blank" class="elevation-0">VER MÁS</v-btn>
                            </v-row>
                            
                            <v-row class="elevation-0 my-4 pa-4" style="border-bottom:solid 1px #c8cdd0;">
                                <div class="mr-4">
                                    <img style="height:30px;" src="https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png">
                                </div>
                                <div class="pt-1" style="font-weight:500;">
                                    KAMS & SM: Estructura Organizacional y de Agencias
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn small href="https://docs.google.com/presentation/d/1oMlyMk794yea2ldEu_UZ8mDIp4fqQ1mi8ILVmqeQPRI/edit#slide=id.p" color="#58c6ef" dark target="_blank" class="elevation-0">VER MÁS</v-btn>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" class="pl-8">

                            <v-row class="elevation-0 my-4 pa-4" style="border-bottom:solid 1px #c8cdd0;">
                                <div class="mr-4">
                                    <img style="height:30px;" src="https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png">
                                </div>
                                <div class="pt-1" style="font-weight:500;">
                                    Reglamento 2022
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn small href="https://docs.google.com/document/d/1HM6MeSahtH-dh9hE-96BEddtonsLah02TQqs9O6Hf_s/edit" color="#58c6ef" dark target="_blank" class="elevation-0">VER MÁS</v-btn>
                            </v-row>

                            <v-row class="elevation-0 my-4 pa-4" style="border-bottom:solid 1px #c8cdd0;">
                                <div class="mr-4">
                                    <img style="height:30px;" src="https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png">
                                </div>
                                <div class="pt-1" style="font-weight:500;">
                                    Influencer Marketing: Información Talentos
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn small href="https://docs.google.com/spreadsheets/d/1I_yjsmI9Ya-UVEiBjJ4jug0omKLxqgk1jiEV8_xdS_A/edit#gid=1516625504" color="#58c6ef" dark target="_blank" class="elevation-0">VER MÁS</v-btn>
                            </v-row>

                            <v-row class="elevation-0 my-4 pa-4" style="border-bottom:solid 1px #c8cdd0;">
                                <div class="mr-4">
                                    <img style="height:30px;" src="https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png">
                                </div>
                                <div class="pt-1" style="font-weight:500;">
                                    Facturas
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn small href="https://docs.google.com/spreadsheets/d/1ON1siuCuQNSvgYAesMwd0l2EahbQDE-gfzcDUys9uQw/edit?usp=drive_web&ouid=107754171771911588406" color="#58c6ef" dark target="_blank" class="elevation-0">VER MÁS</v-btn>
                            </v-row>
                        </v-col>
                    </v-row>
                    
                </v-card>
                <!--/v-col-->
        </div>
    </div>
</template>

<script>
import axios from "axios"

  export default {
    data: () => ({
        video:false,
        posts: []
    }),
    created() {
        axios
        .get("https://unocrm.mx/wp-json/wp/v2/posts?_embed")
        .then(response => {this.posts = response.data;})
        .catch( error => {
            window.alert( error );
        });
        this.fecha()


        
        
    },
    methods:{
        fecha(rango){
            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            const date = new Date()
            if(rango=='mes'){
                const mes = date.getMonth()
                const anio = date.getFullYear()
                return meses[mes] + ' ' + anio
            }
            if(rango=='semana'){
                const dia = date.getDate()
                var first = dia - date.getDay();
                var last = first + 6;
                var firstday = new Date(date.setDate(first));
                var lastday = new Date(date.setDate(last));
                return 'del ' + firstday.getDate() + ' de ' + meses[firstday.getMonth()] + ' al ' + lastday.getDate() + ' de ' + meses[lastday.getMonth()]
            }
        },
    },
    computed:{
        currentWeek(){
            var date = new Date()
            const dia = date.getDate()
            var first = dia - date.getDay();
            var last = first + 6;
            var week = {start:'', end:''} 
            week.start = new Date(date.setDate(first));
            week.end = new Date(date.setDate(last));
            return week
        },
        companiesMonth(){
            return this.$store.state.company.companies.filter(company=>new Date(company.created_at).getMonth() == new Date().getMonth()).length
        },
        quotationsMonth(){
            var response = this.$store.state.quotation.sales.filter(quotation=>new Date(quotation.updated_at).getMonth() == new Date().getMonth())
            var responseTotal = response.reduce(function(prev, cur) {
                return prev + cur.amount;
            }, 0);
            return responseTotal
        },
        companiesWeek(){
            return this.$store.state.company.companies.filter(company=>new Date(company.created_at) <= this.currentWeek.end && new Date(company.created_at) >= this.currentWeek.start).length
        },
        quotationsWeek(){
            var response = this.$store.state.quotation.sales.filter(quotation=>new Date(quotation.updated_at) <= this.currentWeek.end && new Date(quotation.updated_at) >= this.currentWeek.start)
            var responseTotal = response.reduce(function(prev, cur) {
                return prev + cur.amount;
            }, 0);
            return responseTotal
        }
    },
    mounted() {
    },
  }
</script>

<style scoped>
.fondo:hover{
    background-color: rgba(255, 255, 255, 0.11)!important;
    cursor: pointer;
}
</style>