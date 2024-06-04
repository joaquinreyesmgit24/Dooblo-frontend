const home = ()=>import('./views/Home.vue')
const listUsers = ()=>import('./views/ListUsers.vue')

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
    {
        path: '/users',
        component: listUsers,
        name: 'list-users',
        meta: {
        title: 'list-users',
        menu: 'list-users',
        }
    },
]