import { types, Instance } from "mobx-state-tree";

const TODO_STORE_KEY = "todoStore";

// task model

export const TodoModel = types.model("TodoModel", {
  id: types.identifier,
  name: types.string,
  desc: types.string,
  status: types.optional(types.string, "ToDo"),
});


// task store
export const TodoStore = types
  .model("TodoStore", {
    todos: types.array(TodoModel),
  })
  .actions((store) => ({
    addTodo(newTodo: Instance<typeof TodoModel>) {
      store.todos.push(newTodo);
      saveTodoStore();
    },
    changeStatus(id: string, newStatus: string) {
      const todo = store.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.status = newStatus;
        saveTodoStore();
      }
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


  //if store was not there before then we will assign an empty store and load it
let _todoStore: Instance<typeof TodoStore>;

export const useTodos = () => {
  if (!_todoStore) {
    const storedStore = loadTodoStore();
    _todoStore = storedStore ? storedStore : TodoStore.create({ todos: [] });
  }
  return _todoStore;
};
//storing the data locally
const saveTodoStore = () => {
  try {
    const json = JSON.stringify(_todoStore.todos);
    localStorage.setItem(TODO_STORE_KEY, json);
  } catch (error) {
    console.error("Failed to save TodoStore to localStorage:", error);
  }
};
// loading the data from local storage
const loadTodoStore = (): Instance<typeof TodoStore> | null => {
  try {
    const json = localStorage.getItem(TODO_STORE_KEY);
    return json ? TodoStore.create({ todos: JSON.parse(json) }) : null;
  } catch (error) {
    console.error("Failed to load TodoStore from localStorage:", error);
    return null;
  }
};
