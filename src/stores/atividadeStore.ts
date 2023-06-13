import { defineStore } from "pinia";
import { ActivityCreate } from "../utils/types";
import axios from "axios";
import routes from "../router/index";

export const useActivityStore = defineStore("activity", {
  state: () => {
    return {
      activitys: [],
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
    async getActivitys(id: number) {
      this.addLoader();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/atividades/poligono/${id}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      this.activitys = response.data;
      this.removeLoader();
    },
    async getOneActivity(id: number) {
      this.addLoader();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/atividades/${id}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      const activity = response.data;
      this.removeLoader();
      return activity;
    },
    async getActivitysByEvent(id: number) {
      this.addLoader();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/atividades/evento/${id}/public`
      );
      this.activitys = response.data;
      this.removeLoader();
    },
  },
});
