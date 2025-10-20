import { ref, computed, watch } from "vue";

const STORAGE_KEY = "todos:v1";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((t) => ({
      id: String(t.id ?? crypto.randomUUID?.() ?? Date.now() + Math.random()),
      text: String(t.text ?? "").trim(),
      completed: Boolean(t.completed),
      createdAt: t.createdAt ?? Date.now(),
    }));
  } catch {
    return [];
  }
}

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
  const filter = ref("all"); // all | active | completed

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

  function addTodo() {
    const text = newTodo.value.trim();
    if (!text) return;
    todos.value.unshift({
      id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()),
      text,
      completed: false,
      createdAt: Date.now(),
    });
    newTodo.value = "";
  }

  function toggleTodo(id) {
    const t = todos.value.find((x) => x.id === id);
    if (t) t.completed = !t.completed;
  }

  function removeTodo(id) {
    todos.value = todos.value.filter((t) => t.id !== id);
  }

  function clearCompleted() {
    todos.value = todos.value.filter((t) => !t.completed);
  }

  function setFilter(next) {
    if (["all", "active", "completed"].includes(next)) {
      filter.value = next;
    }
  }

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

  function indexOfId(id) {
    return todos.value.findIndex((t) => t.id === id);
  }

  function moveById(fromId, toId) {
    const from = indexOfId(fromId);
    const to = indexOfId(toId);
    moveByIndex(from, to);
  }

  // persist automatically
  watch(
    todos,
    (val) => {
      saveToStorage(val);
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
