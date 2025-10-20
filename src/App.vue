<script setup>
import TodoApp from "./components/TodoApp.vue";
import ThreeBackground from "./components/ThreeBackground.vue";
</script>

<template>
  <ThreeBackground />
  <TodoApp />
  <a
    href="https://github.com/Mint-Diary/todo_list_by_demid_krom"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white/95 px-4 py-2 font-semibold text-gray-900 shadow-md transition hover:translate-y-[-1px] hover:shadow-lg dark:bg-gray-900/90 dark:text-gray-100"
    aria-label="View this project on GitHub"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
      <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.486 2 12.018c0 4.428 2.865 8.186 6.839 9.504.5.093.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.368-1.342-3.368-1.342-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.07 1.532 1.033 1.532 1.033.893 1.53 2.343 1.088 2.914.833.091-.647.35-1.088.636-1.339-2.221-.253-4.556-1.113-4.556-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.447-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 7.07c.85.004 1.705.115 2.504.338 1.909-1.296 2.747-1.026 2.747-1.026.547 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.36.31.68.92.68 1.855 0 1.339-.012 2.419-.012 2.749 0 .268.18.58.688.481A10.022 10.022 0 0 0 22 12.018C22 6.486 17.523 2 12 2z" clip-rule="evenodd" />
    </svg>
    <span>View this project on GitHub</span>
  </a>
</template>
