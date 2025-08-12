<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <span class="text-md text-gray-500">Bem vindo ao MultiClinical</span>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="bg-white rounded-md p-4 shadow-[var(--shadow-card)]">Atendimentos</div>
      <div class="bg-white rounded-md p-4 shadow-[var(--shadow-card)]">Faturamento</div>
      <div class="bg-white rounded-md p-4 shadow-[var(--shadow-card)]">Ticket Médio</div>
    </div>

    <div class="bg-white rounded-md p-4 shadow-[var(--shadow-card)] mt-4">
      <div class="font-medium mb-3">Atendimentos Recentes</div>
      <div class="border border-line rounded-lg px-4 py-3 text-md text-gray-700">Sem dados (placeholder)</div>
      <button class="mt-3 text-md text-brand hover:underline">Ver Todos os Atendimentos</button>
    </div>
  </div>
</template>
