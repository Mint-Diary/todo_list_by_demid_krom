import { ref, computed, watch } from "vue";

/**
 * Simple localStorage-backed To-Do state with filter and reordering helpers.
 * - Keeps API minimal and framework-agnostic beyond Vue refs.
 * - Persists in localStorage and restores safely.
 */
const STORAGE_KEY = "todos:v1"; // bump this to invalidate stored data in future
const FILTERS = /** @type {const} */ (["all", "active", "completed"]);

/**
 * Load todos array from localStorage safely.
 * @returns {{id:string,text:string,completed:boolean,createdAt:number}[]}
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((t) => ({
      id: String(t.id ?? (globalThis.crypto?.randomUUID?.() ?? Date.now() + Math.random())),
      text: String(t.text ?? "").trim(),
      completed: Boolean(t.completed),
      createdAt: Number.isFinite(t.createdAt) ? t.createdAt : Date.now(),
    }));
  } catch {
    return [];
  }
}

/**
 * Write todos to localStorage (best-effort).
 */
function saveToStorage(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore write errors
  }
}

export function useTodos() {
  const todos = ref(loadFromStorage());
  const newTodo = ref("");
  const filter = ref(/** @type {typeof FILTERS[number]} */ ("all"));

  const remaining = computed(() => todos.value.filter((t) => !t.completed).length);
  const hasTodos = computed(() => todos.value.length > 0);
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case "active":
        return todos.value.filter((t) => !t.completed);
      case "completed":
        return todos.value.filter((t) => t.completed);
      default:
        return todos.value;
    }
  });

  /** Add a new todo from current input; empty values are ignored. */
  function addTodo() {
    const text = newTodo.value.trim();
    if (!text) return;
    todos.value.unshift({
      id: globalThis.crypto?.randomUUID?.() ?? String(Date.now() + Math.random()),
      text,
      completed: false,
      createdAt: Date.now(),
    });
    newTodo.value = "";
  }

  /** Toggle completion by id (no-op if not found). */
  function toggleTodo(id) {
    const t = todos.value.find((x) => x.id === id);
    if (t) t.completed = !t.completed;
  }

  /** Remove a todo by id. */
  function removeTodo(id) {
    todos.value = todos.value.filter((t) => t.id !== id);
  }

  /** Remove all completed todos. */
  function clearCompleted() {
    todos.value = todos.value.filter((t) => !t.completed);
  }

  /** Set active filter to one of allowed options. */
  function setFilter(next) {
    if (FILTERS.includes(next)) {
      filter.value = next;
    }
  }

  /** Move an item from index A to index B in-place, guarding bounds. */
  function moveByIndex(fromIndex, toIndex) {
    const list = todos.value;
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= list.length ||
      toIndex >= list.length
    )
      return;
    const [item] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, item);
  }

  /** Find the index of a todo id (or -1 if absent). */
  function indexOfId(id) {
    return todos.value.findIndex((t) => t.id === id);
  }

  /** Move an item by ids (no-op if either id missing). */
  function moveById(fromId, toId) {
    const from = indexOfId(fromId);
    const to = indexOfId(toId);
    moveByIndex(from, to);
  }

  // Persist automatically with a light debounce to avoid spamming writes
  let saveTimer = /** @type {number|undefined} */ (undefined);
  watch(
    todos,
    (val) => {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => saveToStorage(val), 250);
    },
    { deep: true }
  );

  return {
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
    moveByIndex,
    moveById,
  };
}
