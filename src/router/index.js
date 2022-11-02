import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/influencers',
    name: 'Influencers',
    component: () => import('../components/influencers/container.vue')
  },
  {
    path: '/contracts',
    name: 'Contratos',
    component: () => import('../components/contracts/table.vue')
  },
  {
    path: '/influencers-payments',
    name: 'Influencers Payments',
    component: () => import('../components/influencers_payments/table.vue')
  },
  {
    path: '/influencers/influencer/:influencer_id',
    name: 'influencerDetail',
    component: () => import('../components/influencers/influencerDetail.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../components/dashboard/container.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../components/reports/old/container.vue')
  },
  {
    path: '/quotations',
    name: 'Quotations',
    component: () => import('../components/quotations/table.vue')
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../components/sales/table.vue')
  },
  {
    path: '/canceled',
    name: 'Canceled', 
    component: () => import('../components/canceled/table.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../components/settings/container.vue')
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../components/clients/table.vue')
  },
  {
    path: '/activity-log',
    name: 'Activity Log',
    component: () => import('../components/activitylog/container.vue')
  },
  {
    path: '/clients/agency/:agency_id',
    name: 'agencyDetail',
    component: () => import('../components/clients/companies/agencies/detail.vue')
  },
  {
    path: '/clients/brand/:brand_id',
    name: 'brandDetail',
    component: () => import('../components/clients/companies/brands/detail.vue')
  },
  {
    path: '/clients/agency/:id',
    name: 'agencyDetail',
    component: () => import('../components/clients/companies/agencies/detail.vue')
  },
  {
    path: '/clients/brand/:id',
    name: 'brandDetail',
    component: () => import('../components/clients/companies/brands/detail.vue')
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('../components/notes/container.vue')
  },
  {
    path: '/adjustments',
    name: 'Adjustments',
    component: () => import('../components/adjustments.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
