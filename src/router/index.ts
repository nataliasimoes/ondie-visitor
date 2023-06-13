import Start from "../views/Start.vue";
import ScheduleActivity from "../views/ScheduleActivity.vue";
import Home from "../views/Home.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import EventList from "../views/EventList.vue";
import MapActivity from "../views/MapActivity.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/start",
    name: "start",
    component: Start,
    meta: {
      layout: "EmptyLayout",
    },
  },
  {
    path: "/schedule-activity/:idevento",
    name: "schedule-activity",
    component: ScheduleActivity,
  },
  {
    path: "/event-list",
    name: "event-list",
    component: EventList,
  },
  {
    path: "/map-activity/:poligonoid",
    name: "map-activity",
    component: MapActivity,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
