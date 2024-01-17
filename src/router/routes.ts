import type {RouteRecordRaw} from "vue-router";
import {useViews} from "@/views";

const {HomeView} = useViews();

export const routes: Array<RouteRecordRaw> = [{
    path: '/',
    name: 'home',
    component: HomeView,
}];