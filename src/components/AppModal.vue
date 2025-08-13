<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" class="relative z-[1000]" @close="$emit('close')">
      <!-- Overlay -->
      <TransitionChild as="template"
        enter="ease-out duration-150" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-100"  leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/40" />
      </TransitionChild>

      <!-- Wrapper -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template"
            enter="ease-out duration-150" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
            leave="ease-in duration-100"  leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-md border border-line bg-white text-left align-middle shadow-[var(--shadow-card)] transition-all"
            >
              <div class="px-4 py-3 border-b border-line">
                <DialogTitle class="text-lg font-semibold">{{ title }}</DialogTitle>
              </div>

              <div class="px-4 py-4">
                <p class="text-md text-gray-700">
                  <slot>{{ description }}</slot>
                </p>
              </div>

              <div class="px-4 py-3 border-t border-line flex items-center justify-end gap-2">
                <button
                  class="px-3 py-2 rounded-md border border-line hover:bg-gray-50"
                  @click="$emit('close')"
                  :disabled="confirmLoading"
                >
                  {{ cancelText }}
                </button>
                <button
                  class="px-3 py-2 rounded-md bg-brand text-white hover:bg-brand-600 disabled:opacity-60"
                  @click="$emit('confirm')"
                  :disabled="confirmLoading"
                >
                  <span v-if="!confirmLoading">{{ confirmText }}</span>
                  <span v-else class="inline-flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
                      <path d="M4 12a8 8 0 018-8v4" fill="currentColor" class="opacity-75" />
                    </svg>
                    Processando...
                  </span>
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "Confirmar ação" },
  description: { type: String, default: "" },
  cancelText: { type: String, default: "Cancelar" },
  confirmText: { type: String, default: "Confirmar" },
  confirmLoading: { type: Boolean, default: false },
});
defineEmits(["close", "confirm"]);
</script>
