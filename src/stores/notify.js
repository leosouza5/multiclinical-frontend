import { defineStore } from "pinia";

let _id = 1;
export const useNotify = defineStore("notify", {
  state: () => ({ items: [] }),
  actions: {
    push({ type = "info", title = "", message = "", timeout = 3500 } = {}) {
      const id = _id++;
      this.items.push({ id, type, title, message });
      if (timeout) setTimeout(() => this.remove(id), timeout);
      return id;
    },
    success(p){ return this.push({ type: "success", ...p }); },
    error(p){ return this.push({ type: "error", ...p }); },
    warning(p){ return this.push({ type: "warning", ...p }); },
    info(p){ return this.push({ type: "info", ...p }); },
    remove(id){ this.items = this.items.filter(t => t.id !== id); },
    clear(){ this.items = []; }
  }
});
