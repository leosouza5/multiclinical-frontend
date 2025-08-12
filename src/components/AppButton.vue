<template>
  <button
    :disabled="loading || disabled"
    class="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
    :class="[
      variant === 'primary'
        ? 'bg-brand text-white hover:bg-brand-600'
        : 'border border-line bg-white hover:bg-gray-50',
      loading ? 'opacity-70 cursor-not-allowed' : ''
    ]"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3.536-3.536A8 8 0 014 12z"
      />
    </svg>
    <span><slot /></span>
  </button>
</template>

<script setup>
defineProps({
  loading: Boolean,
  disabled: Boolean,
  variant: {
    type: String,
    default: 'primary', 
  },
});
</script>
