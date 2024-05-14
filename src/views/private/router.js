const home = ()=>import('./views/Home.vue')

export const PrivateRoutes = [
    {
        path:'',
        redirect:'/home',
    },
    {
        path: '/home',
        component: home,
        name: 'home',
        meta: {
        title: 'home',
        menu: 'home',
        }
    },
]