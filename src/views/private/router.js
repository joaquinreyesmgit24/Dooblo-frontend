const statistics = ()=>import('./views/Statistics.vue')
const listUsers = ()=>import('./views/ListUsers.vue')
const listStudies = ()=>import('./views/ListStudies.vue')
const reports = ()=>import('./views/Reports.vue')
const reportRegion = ()=>import('./views/ReportRegion.vue')
const generalSummary = ()=>import('./views/GeneralSummary.vue')
const flagsReport = ()=>import('./views/FlagsReport.vue')
const gpsReport = ()=>import('./views/GPSReport.vue')
const supervision = ()=>import('./views/Supervision.vue')
const selectStudy = ()=>import('./views/SelectStudy.vue')



export const PrivateRoutes = [
    {
        path: '',
        redirect: '/statistics',
    },
    {
        path: '/statistics',
        component: statistics,
        name: 'statistics',
        meta: {
            title: 'statistics',
            menu: 'statistics',
            requiredRole: ['Administrador']
        }
    },
    {
        path: '/users',
        component: listUsers,
        name: 'list-users',
        meta: {
            title: 'list-users',
            menu: 'list-users',
            requiredRole: ['Administrador']
        }
    },
    {
        path: '/studies',
        component: listStudies,
        name: 'list-studies',
        meta: {
            title: 'list-studies',
            menu: 'list-studies',
            requiredRole: ['Administrador']
        }
    },
    {
        path: '/reports',
        component: reports,
        name: 'reports',
        meta: {
            title: 'reports',
            menu: 'reports',
            requiredRole: ['Administrador', 'Analista']
        },
        children: [
            {
                path: 'region',
                component: reportRegion,
                name: 'report-region',
                meta: {
                    title: 'report-region',
                    menu: 'report-region',
                    requiredRole: ['Administrador', 'Analista']
                },
            },
            {
                path: 'general',
                component: generalSummary,
                name: 'general-summary',
                meta: {
                    title: 'general-summary',
                    menu: 'general-summary',
                    requiredRole: ['Administrador', 'Analista']
                },
            },
            {
                path: 'flags',
                component: flagsReport,
                name: 'flags-report',
                meta: {
                    title: 'flags-report',
                    menu: 'flags-report',
                    requiredRole: ['Administrador', 'Analista']
                },
            },
            {
                path: 'gps',
                component: gpsReport,
                name: 'gps-report',
                meta: {
                    title: 'gps-report',
                    menu: 'gps-report',
                    requiredRole: ['Administrador', 'Analista']
                },
            },
        ]
    },
    {
        path: '/supervision',
        component: supervision,
        name: 'supervision',
        meta: {
            title: 'supervision',
            menu: 'supervision',
            requiredRole: ['Administrador', 'Analista']
        }
    },
    {
        path: '/select',
        component: selectStudy,
        name: 'select-study',
        meta: {
            title: 'select-study',
            menu: 'select-study',
            requiredRole: ['Administrador', 'Analista']
        }
    },
]