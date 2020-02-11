import Pathfinding from '../components/Pathfinding'
import Sorting from '../components/Sorting'

export const routes = [
    {
        path: '/',
        redirect: '/pathfinding',
    },
    {
        path: '/pathfinding',
        component: Pathfinding,
        name: 'pathfinding'
    },
    {
        path: '/sorting',
        component: Sorting,
        name: 'sorting'
    },

    {
        path: '*',
        redirect: '/pathfinding',
    }
];