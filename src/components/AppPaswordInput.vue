<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="id" class="block text-md mb-1">{{ label }}</label>

    <div class="relative">
      <input :id="id" :name="name" :type="show ? 'text' : 'password'"
        class="w-full border border-line rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
        :placeholder="placeholder" :autocomplete="autocomplete" :disabled="disabled" :required="required"
        :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        :aria-invalid="!!error || undefined" :aria-describedby="error ? `${id}-error` : undefined" />
      <button type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center p-1 text-gray-500 hover:text-gray-700"
        @click="show = !show" :aria-label="show ? 'Ocultar senha' : 'Mostrar senha'">
        <!-- Ícones simples em SVG, coloridos via text-brand -->
        <Eye class="text-brand" v-if="!show" />
        <EyeClosed class="text-brand" v-else />
      </button>
    </div>

    <p v-if="hint && !error" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { Eye, EyeClosed } from "lucide-vue-next";
import { ref } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "Senha" },
  placeholder: { type: String, default: "Digite a senha" },
  name: { type: String, default: "password" },
  id: { type: String, default: "password" },
  autocomplete: { type: String, default: "current-password" }, // use 'new-password' em cadastros
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  error: { type: String, default: "" },
  hint: { type: String, default: "" },
  wrapperClass: { type: String, default: "" }, // p/ espaçamentos externos (ex: 'mt-4')
});
defineEmits(["update:modelValue"]);

const show = ref(false);
</script>
