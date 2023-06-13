import { defineStore } from "pinia";
import { Event, EventCreate } from "../utils/types";
import axios from "axios";
import routes from "../router/index";

export const useEventStore = defineStore("event", {
  state: () => {
    return {
      events: [],
      loading: 0,
      token: localStorage.getItem("token"),
    };
  },
  getters: {},
  actions: {
    addLoader() {
      this.loading++;
    },
    removeLoader() {
      this.loading--;
    },
    async getEvents() {
      this.addLoader();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/eventos/eventos-publico`
      );
      this.events = response.data;
      this.removeLoader();
    },
    async getOneEvent(id: number) {
      this.addLoader();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/eventos/${id}`
      );
      const event = response.data;
      this.removeLoader();
      return event;
    },
  },
});
