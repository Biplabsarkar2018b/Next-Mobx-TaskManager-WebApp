import TaskCard from "./components/TaskCard";
import React, { useEffect, useState } from "react";
import { useTodos } from "./store/store";
import { Instance } from "mobx-state-tree";

interface Todo {
  id: string;
  name: string;
  desc: string;
  status: string;
}

export default function Home() {
  const todoStore = useTodos();

  const [data, setData] = useState<Todo[]>([]);
  const [isShow, setIsShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const handleSave = () => {
    if (name.trim() === "" || description.trim() === "") {
      // Name or description is empty, return without saving
      setError(true);
      return;
    }
    setError(false);
    setIsShow(false);
    if (editingCardId) {
      // Update existing card
      const updatedTodo: Todo = {
        id: editingCardId,
        name: name,
        desc: description,
        status: "ToDo",
      };
      todoStore.updateTodo(updatedTodo);
      setData(todoStore.getTodoList()); // Update data state after editing
      setEditingCardId(null);
    } else {
      // Add new card
      const newTodo: Todo = {
        id: Date.now().toString(),
        name: name,
        desc: description,
        status: "ToDo",
      };
      todoStore.addTodo(newTodo);
    }
    setName("");
    setDescription("");
  };
  const handleEdit = (id: string) => {
    const todo = todoStore.getTodoById(id);
    if (todo) {
      setName(todo.name);
      setDescription(todo.desc);
      setIsShow(true);
      setEditingCardId(id);
    }
  };

  const handleDelete = (id: string) => {
    todoStore.deleteTodoById(id);
    setData(todoStore.getTodoList());
  };
  useEffect(() => {
    setData(todoStore.getTodoList());
  }, [todoStore.getLength()]);

  return (
    <div className="relative">
      {isShow && (
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">
            {editingCardId ? "Edit Task" : "New Task"}
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">
              Please enter both name and description.
            </p>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
            onClick={handleSave}
          >
            {editingCardId ? "Update" : "Save"}
          </button>
        </div>
      )}

      <button
        onClick={() => setIsShow(!isShow)}
        className="fixed bottom-5 right-5 bg-green-600 p-3 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      {data &&
        data.map((item) => (
          <TaskCard
            key={item.id}
            id={item.id}
            title={item.name}
            description={item.desc}
            status={item.status}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
    </div>
  );
}
