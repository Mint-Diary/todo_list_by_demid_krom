<script setup>
import { ref } from "vue";
import { useTodos } from "../composables/useTodos";

// State & actions from the todos composable
const {
  todos,
  newTodo,
  filter,
  filteredTodos,
  remaining,
  hasTodos,
  addTodo,
  toggleTodo,
  removeTodo,
  clearCompleted,
  setFilter,
  moveById,
} = useTodos();

// Keep id of the item currently being dragged (by handle)
const draggingId = ref(null);

function onSubmit(e) {
  e.preventDefault();
  addTodo();
}

function onDragStart(id) {
  draggingId.value = id;
}

function onDragEnd() {
  draggingId.value = null;
}

function onDrop(targetId) {
  if (draggingId.value && draggingId.value !== targetId) {
    moveById(draggingId.value, targetId);
  }
  draggingId.value = null;
}
</script>

<template>
  <div class="min-h-screen text-gray-900 dark:text-gray-100">
    <div class="container mx-auto max-w-2xl px-4 py-10">
      <header class="mb-6 text-center">
        <h1 class="text-3xl font-black tracking-tight">To‑Do Liste</h1>
        <p class="text-gray-600 dark:text-gray-300">Verwalten Sie Ihre Aufgaben einfach und schnell.</p>

        <!-- Filters: indicate pressed state for a11y -->
        <nav class="mt-4 inline-flex overflow-hidden rounded-lg border-2 border-black bg-white/95 text-sm dark:border-black dark:bg-gray-900/80" aria-label="Filter">
          <button
            class="px-3 py-1.5 font-medium transition focus:outline-hidden focus:ring-2 focus:ring-[#183857]/40"
            :class="filter === 'all' ? 'bg-[#183857] text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
            :aria-pressed="filter === 'all'"
            @click="setFilter('all')"
          >Alle</button>
          <button
            class="px-3 py-1.5 font-medium transition focus:outline-hidden focus:ring-2 focus:ring-[#183857]/40"
            :class="filter === 'active' ? 'bg-[#183857] text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
            :aria-pressed="filter === 'active'"
            @click="setFilter('active')"
          >Offen</button>
          <button
            class="px-3 py-1.5 font-medium transition focus:outline-hidden focus:ring-2 focus:ring-[#183857]/40"
            :class="filter === 'completed' ? 'bg-[#183857] text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
            :aria-pressed="filter === 'completed'"
            @click="setFilter('completed')"
          >Erledigt</button>
        </nav>
      </header>

      <!-- Input: add aria-label and a reasonable maxlength -->
      <form @submit="onSubmit" class="mb-6 flex gap-2">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Neue Aufgabe hinzufügen..."
          aria-label="Neue Aufgabe"
          maxlength="200"
          class="flex-1 rounded-lg border-2 border-black bg-white/95 px-4 py-3 text-base shadow-xs outline-none placeholder:text-gray-500 focus:border-[#183857] focus:ring-2 focus:ring-[#183857]/30 dark:border-black dark:bg-gray-900/80"
          autocomplete="off"
        />
        <button
          type="submit"
          class="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[#183857] px-4 py-3 font-semibold text-white transition hover:bg-[#142c44] hover:border-black focus:ring-2 focus:ring-[#183857]/50 focus:outline-hidden disabled:opacity-50"
          :disabled="!newTodo.trim()"
        >
          Hinzufügen
        </button>
      </form>

      <!-- List -->
      <section v-if="hasTodos" class="rounded-xl border-2 border-black bg-white/95 shadow-xs dark:border-black dark:bg-gray-900/80">
        <TransitionGroup name="list" tag="ul" class="divide-y-2 divide-black dark:divide-black">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="flex items-center gap-3 px-4 py-3 select-none"
            @dragover.prevent
            @drop="onDrop(todo.id)"
          >
            <input
              :id="`todo-${todo.id}`"
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo.id)"
              class="h-5 w-5 rounded border-2 border-black text-[#183857] focus:ring-[#183857] dark:border-black"
            />
            <label
              :for="`todo-${todo.id}`"
              class="flex-1 text-left"
            >
              <span :class="[todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : '']">{{ todo.text }}</span>
            </label>
            <!-- Drag handle only is draggable to prevent accidental drags when clicking -->
            <span
              class="cursor-grab text-gray-400"
              title="Ziehen, um neu anzuordnen"
              role="button"
              tabindex="0"
              aria-label="Zum Neuanordnen ziehen"
              :draggable="true"
              @dragstart="onDragStart(todo.id)"
              @dragend="onDragEnd"
              aria-hidden="false"
            >≡</span>
            <button
              @click="removeTodo(todo.id)"
              class="rounded-md px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
              aria-label="Aufgabe löschen"
              title="Löschen"
            >
              Löschen
            </button>
          </li>
        </TransitionGroup>
        <!-- Persistent divider under the last item to separate from footer -->
        <div class="border-t-2 border-black"></div>
        <footer class="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
          <span>{{ remaining }} offen</span>
          <button
            class="rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            @click="clearCompleted"
          >
            Erledigte löschen
          </button>
        </footer>
      </section>

      <div v-else class="text-center text-gray-500 dark:text-gray-400">
        Keine Aufgaben vorhanden. Fügen Sie oben eine neue hinzu.
      </div>
    </div>
  </div>
</template>

<style scoped>
/***** TransitionGroup animations *****/
/* Enter + move remain subtle */
.list-enter-active {
  transition: all 200ms ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
.list-move {
  transition: transform 200ms ease;
}

/* Reliable CSS-only remove effect (fade + slight slide, scale and blur) */
.list-leave-active {
  transition: opacity 260ms ease, transform 260ms ease, filter 260ms ease;
}
.list-leave-from {
  opacity: 1;
  transform: translateX(0) translateY(0) scale(1) rotate(0deg);
  filter: none;
}
.list-leave-to {
  opacity: 0;
  transform: translateX(16px) translateY(-4px) scale(0.96) rotate(-2deg);
  filter: blur(2px);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .list-enter-active,
  .list-move,
  .list-leave-active {
    transition: none !important;
    animation: fade-out 150ms linear forwards;
  }
}

@keyframes fade-out {
  to { opacity: 0; }
}
</style>
