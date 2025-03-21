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

  if (isLoading) return <p className="text-center text-gray-500">Loading Todos...</p>;

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
              <TableHead className="text-left font-semibold">Created At</TableHead> {/* New Column */}
              <TableHead className="text-left font-semibold">Completed</TableHead>
              <TableHead className="text-center font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos?.map((todo: { id: string; title: string; completed:boolean; createdAt?: string }, index: number) => (
              <TableRow key={todo.id} className="border-b hover:bg-gray-50">
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{todo.title}</TableCell>
                <TableCell>{todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : "N/A"}</TableCell> {/* New Column Data */}
                <TableCell>{todo.completed ? todo.completed : "Pending"}</TableCell> {/* New Column Data */}
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

      {/* Edit Modal */}
      {open && editTodo && (
        <Model setOpen={setOpen} editTodo={editTodo} updateTodo={updateTodo} />
      )}
    </div>
  );
}
