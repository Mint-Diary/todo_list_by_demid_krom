<script setup>
import { ref } from "vue";
import { useTodos } from "../composables/useTodos";

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

        <!-- Filters -->
        <nav class="mt-4 inline-flex overflow-hidden rounded-lg border-2 border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800" aria-label="Filter">
          <button
            class="px-3 py-1.5 font-medium transition focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            :class="filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
            @click="setFilter('all')"
          >Alle</button>
          <button
            class="px-3 py-1.5 font-medium transition focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            :class="filter === 'active' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
            @click="setFilter('active')"
          >Offen</button>
          <button
            class="px-3 py-1.5 font-medium transition focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            :class="filter === 'completed' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
            @click="setFilter('completed')"
          >Erledigt</button>
        </nav>
      </header>

      <!-- Input -->
      <form @submit="onSubmit" class="mb-6 flex gap-2">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Neue Aufgabe hinzufügen..."
          class="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-base shadow-xs outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-800"
          autocomplete="off"
        />
        <button
          type="submit"
          class="inline-flex items-center gap-2 rounded-lg border-2 border-blue-700 bg-blue-700 px-4 py-3 font-semibold text-white transition hover:border-blue-800 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500/50 focus:outline-hidden disabled:opacity-50"
          :disabled="!newTodo.trim()"
        >
          Hinzufügen
        </button>
      </form>

      <!-- List -->
      <section v-if="hasTodos" class="rounded-xl border-2 border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-800">
        <TransitionGroup name="list" tag="ul" class="divide-y-2 divide-gray-200 dark:divide-gray-700">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="flex items-center gap-3 px-4 py-3 select-none"
            :draggable="true"
            @dragstart="onDragStart(todo.id)"
            @dragend="onDragEnd"
            @dragover.prevent
            @drop="onDrop(todo.id)"
          >
            <input
              :id="`todo-${todo.id}`"
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo.id)"
              class="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <label
              :for="`todo-${todo.id}`"
              class="flex-1 text-left"
            >
              <span :class="[todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : '']">{{ todo.text }}</span>
            </label>
            <span class="cursor-grab text-gray-400" title="Ziehen, um neu anzuordnen" aria-hidden="true">≡</span>
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
.list-enter-active,
.list-leave-active {
  transition: all 200ms ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
.list-move {
  transition: transform 200ms ease;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .list-enter-active,
  .list-leave-active,
  .list-move {
    transition: none !important;
  }
}
</style>
