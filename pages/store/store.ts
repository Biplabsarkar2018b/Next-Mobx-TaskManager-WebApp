import { types, Instance } from "mobx-state-tree";

const TODO_STORE_KEY = "todoStore";

export const TodoModel = types.model("TodoModel", {
  id: types.identifier,
  name: types.string,
  desc: types.string,
  status: types.optional(types.string, "ToDo"),
});

export const TodoStore = types
  .model("TodoStore", {
    todos: types.array(TodoModel),
  })
  .actions((store) => ({
    addTodo(newTodo: Instance<typeof TodoModel>) {
      store.todos.push(newTodo);
      saveTodoStore();
    },
    updateTodo(updatedTodo: Instance<typeof TodoModel>) {
      const index = store.todos.findIndex((todo) => todo.id === updatedTodo.id);
      if (index !== -1) {
        store.todos[index] = updatedTodo;
        saveTodoStore();
      }
    },
    deleteTodoById(id: string) {
      const index = store.todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        store.todos.splice(index, 1);
        saveTodoStore();
      }
    },
  }))
  .views((store) => ({
    getLength() {
      return store.todos.length;
    },
    getTodoList() {
      return store.todos.map((todo) => ({
        id: todo.id,
        name: todo.name,
        desc: todo.desc,
        status: todo.status,
      }));
    },
    getTodoById(id: string) {
      return store.todos.find((todo) => todo.id === id);
    },
  }));

let _todoStore: Instance<typeof TodoStore>;

export const useTodos = () => {
  if (!_todoStore) {
    const storedStore = loadTodoStore();
    _todoStore = storedStore ? storedStore : TodoStore.create({ todos: [] });
  }
  return _todoStore;
};

const saveTodoStore = () => {
  try {
    const json = JSON.stringify(_todoStore.todos);
    localStorage.setItem(TODO_STORE_KEY, json);
  } catch (error) {
    console.error("Failed to save TodoStore to localStorage:", error);
  }
};

const loadTodoStore = (): Instance<typeof TodoStore> | null => {
  try {
    const json = localStorage.getItem(TODO_STORE_KEY);
    return json ? TodoStore.create({ todos: JSON.parse(json) }) : null;
  } catch (error) {
    console.error("Failed to load TodoStore from localStorage:", error);
    return null;
  }
};
