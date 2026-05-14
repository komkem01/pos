<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <LayoutSidebar />
    <div class="flex flex-1 flex-col overflow-hidden">
      <LayoutTopbar />
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
    <UiToast />
  </div>
</template>
