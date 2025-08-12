<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
    <div v-for="t in items" :key="t.id"
         class="pointer-events-auto w-96 max-w-[calc(100vw-2rem)] rounded-md border px-3 py-2 shadow-md flex gap-2"
         :class="styles[t.type]">
      <!-- ícone -->
      <div class="mt-0.5">
        <span v-if="t.type==='success'"><Check class="text-green-800" /></span>
        <span v-else-if="t.type==='error'"><X /></span>
        <span v-else-if="t.type==='warning'"><CircleAlert /></span>
        <span v-else><Info /></span>
      </div>
      <!-- texto -->
      <div class="flex-1">
        <div class="text-sm font-semibold" v-if="t.title">{{ t.title }}</div>
        <div class="text-sm opacity-90" v-if="t.message">{{ t.message }}</div>
      </div>
      <!-- fechar -->
      <button class="ml-2 text-sm opacity-70 hover:opacity-100" @click="remove(t.id)">✕</button>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { Check, CircleAlert, Info, X } from "lucide-vue-next";
import { useNotify } from "../stores/notify";

const notify = useNotify();
const { items } = storeToRefs(notify);

const styles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error:   "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info:    "bg-blue-50 border-blue-200 text-blue-800",
};
function remove(id){ notify.remove(id); }
</script>
