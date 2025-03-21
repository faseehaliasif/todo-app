"use client";
import { useTodos } from "../../../lib/useTodos";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Model from "@/components/Model";

export default function TodosPage() {
  const { todos, isLoading, addTodo, deleteTodo, updateTodo } = useTodos();
  const [newTitle, setNewTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<{ id: string; title: string; createdAt?: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(5);

  if (isLoading) return <p className="text-center text-gray-500">Loading Todos...</p>;

  // Pagination Logic
  const totalPages = Math.ceil(todos.length / todosPerPage);
  const paginatedTodos = todos.slice((currentPage - 1) * todosPerPage, currentPage * todosPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 My Todo List</h1>

      {/* Add Todo Input */}
      <div className="flex gap-3 mb-6">
        <Input
          className="flex-1"
          placeholder="New todo..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Button
          onClick={() => {
            if (newTitle.trim()) {
              addTodo.mutate(newTitle);
              setNewTitle("");
            }
          }}
        >
          Add
        </Button>
      </div>

      {/* Dashboard Table */}
      <div className="rounded-lg border bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-10 text-center font-semibold">#</TableHead>
              <TableHead className="text-left font-semibold">Task</TableHead>
              <TableHead className="text-left font-semibold">Created At</TableHead>
              <TableHead className="text-left font-semibold">Completed</TableHead>
              <TableHead className="text-center font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTodos.map((todo, index) => (
              <TableRow key={todo.id} className="border-b hover:bg-gray-50">
                <TableCell className="text-center">{(currentPage - 1) * todosPerPage + index + 1}</TableCell>
                <TableCell>{todo.title}</TableCell>
                <TableCell>{todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>{todo.completed ? "Completed" : "Pending"}</TableCell>
                <TableCell className="flex justify-center gap-3">
                  <Button variant="destructive" onClick={() => deleteTodo.mutate(todo.id)}>
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditTodo(todo);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Rows per page:</span>
          <select
            className="border rounded-md px-2 py-1 text-gray-700"
            value={todosPerPage}
            onChange={(e) => {
              setTodosPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing rows per page
            }}
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Jump to Page Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Page</span>
          <select
            className="border rounded-md px-2 py-1 text-gray-700"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <span className="text-gray-700">of {totalPages}</span>
        </div>

        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          ⬅️ Previous
        </Button>

        <Button
          variant="outline"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next ➡️
        </Button>
      </div>

      {/* Edit Modal */}
      {open && editTodo && (
        <Model setOpen={setOpen} editTodo={editTodo} updateTodo={updateTodo} />
      )}
    </div>
  );
}
