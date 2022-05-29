import Vue from "vue";
import VueRouter from "vue-router";
import LaunchesView from "../views/LaunchesView.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "launches",
        component: LaunchesView
    },
    {
        path: "/launchpads",
        name: "launchpads",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/LaunchpadsView.vue")
    },
    {
        path: "/companyinfo",
        name: "companyinfo",
        component: () => import("../views/CompanyInfoView.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
