"use client";
import { useTodos } from "../../../lib/useTodos";

import { useState } from "react";
import {Button} from "../../components/ui/button"

export default function TodosPage() {
  const { todos, isLoading, addTodo, deleteTodo, updateTodo } = useTodos();
  const [newTitle, setNewTitle] = useState("");

  if (isLoading) return <p>Loading Todos...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">📝 My Todo List</h1>

      {/* Add Todo Form */}
      <div className="flex mb-4">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="New todo..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            if (newTitle.trim()) {
              addTodo.mutate(newTitle);
              setNewTitle("");
            }
          }}
        >
          Add
        </button>
        

      </div>

      {/* Todo List */}
      <ul>
        {todos?.map((todo:any) => (
          <li key={todo.id} className="flex justify-between p-2 border-b">
            <span>{todo.title}</span>
            <div>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded mr-2"
                onClick={() => deleteTodo.mutate(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
