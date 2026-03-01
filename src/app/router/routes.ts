import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('pages/portfolio/index'),
            },
        ],
    },
    {
        path: '/:catchAll(.*)',
        component: () => import('pages/errors/ui/ErrorPage404.vue'),
    },
]

export default routes