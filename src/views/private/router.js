const home = ()=>import('./views/Home.vue')
const listUsers = ()=>import('./views/ListUsers.vue')
const listStudies = ()=>import('./views/ListStudies.vue')
const reports = ()=>import('./views/Reports.vue')
const reportRegion = ()=>import('./views/ReportRegion.vue')
const generalSummary = ()=>import('./views/GeneralSummary.vue')




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
    {
        path: '/studies',
        component: listStudies,
        name: 'list-studies',
        meta: {
        title: 'list-studies',
        menu: 'list-studies',
        }
    },
    {
        path: '/reports',
        component: reports,
        name: 'reports',
        meta: {
            title: 'reports',
            menu: 'reports',
        },
        children: [
            {
                path: 'region',  // Path relativo a '/reports'
                component: reportRegion,
                name: 'report-region',
                meta: {
                    title: 'report-region',
                    menu: 'report-region',
                },
            },
            {
                path: 'general',  // Path relativo a '/reports'
                component: generalSummary,
                name: 'general-summary',
                meta: {
                    title: 'general-summary',
                    menu: 'general-summary',
                },
            },
        ]
    }
]