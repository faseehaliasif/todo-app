"use client";
import { useTodos } from "../../../lib/useTodos";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";
import { toast } from "sonner";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
};

export default function TodosPage() {
  const { todos, isLoading, addTodo, deleteTodo, updateTodo } = useTodos();
  const [newTitle, setNewTitle] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);

  if (isLoading) return <p className="text-center text-gray-500">Loading Todos...</p>;

  // ✅ Handle Theme Toggle Fix
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // ✅ Handle Bulk Complete
  const handleMarkAllCompleted = () => {
    todos.forEach((todo: Todo) => {
      if (!todo.completed) updateTodo.mutate({ ...todo, completed: true });
    });
  };

  // ✅ Handle Bulk Delete Fix
  const handleBulkDelete = () => {
    selectedTodos.forEach((id) => {
      const todoToDelete = todos.find((t: Todo) => t.id === id);
      if (todoToDelete) setDeletedTodo(todoToDelete);
      deleteTodo.mutate(id);
    });

    setSelectedTodos(new Set());

    toast("Todos deleted!", {
      action: {
        label: "Undo",
        onClick: handleUndoDelete,
      },
    });
  };

  // ✅ Handle Undo Delete
  const handleUndoDelete = () => {
    if (deletedTodo) {
      addTodo.mutate(deletedTodo.title);
      setDeletedTodo(null);
    }
  };

  // ✅ Handle Inline Editing
  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      updateTodo.mutate({ id, title: editTitle, completed: todos.completed });
      setEditTodoId(null);
      setEditTitle("");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 My Todo List</h1>

      {/* ✅ Fixed Theme Toggle */}
      <div className="flex justify-end mb-3">
        <Button onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </Button>
      </div>

      {/* ✅ Add Todo & Search */}
      <div className="flex gap-3 mb-4">
        <Input placeholder="New todo..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <Button onClick={() => newTitle.trim() && addTodo.mutate(newTitle) && setNewTitle("")}>Add</Button>
        <Input placeholder="🔍 Search Todos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* ✅ Bulk Actions Fix */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handleMarkAllCompleted}>
          ✅ Mark All Completed
        </Button>
        {selectedTodos.size > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            Delete {selectedTodos.size} Todos
          </Button>
        )}
      </div>

      {/* ✅ Todos Table */}
      <div className="rounded-lg border bg-white shadow dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-700">
              <TableHead className="w-10 text-center">
                <Checkbox
                  onCheckedChange={(checked) => setSelectedTodos(checked ? new Set(todos.map((t:Todo) => t.id)) : new Set())}
                />
              </TableHead>
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead>Task</TableHead>
              <TableHead className="text-center">Completed</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo:Todo, index:string) => (
              <TableRow key={todo.id}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedTodos.has(todo.id)}
                    onCheckedChange={() => {
                      setSelectedTodos((prev) => {
                        const newSet = new Set(prev);
                        if (newSet.has(todo.id)) newSet.delete(todo.id);
                        else newSet.add(todo.id);
                        return newSet;
                      });
                    }}
                  />
                </TableCell>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  {editTodoId === todo.id ? (
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={() => handleSaveEdit(todo.id)} />
                  ) : (
                    <span onDoubleClick={() => { setEditTodoId(todo.id); setEditTitle(todo.title); }}>{todo.title}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox checked={todo.completed} onCheckedChange={() => updateTodo.mutate({ ...todo, completed: !todo.completed })} />
                </TableCell>
                <TableCell className="flex justify-center gap-3">
                  <Button variant="destructive" onClick={() => deleteTodo.mutate(todo.id)}>Delete</Button>
                  <Button variant="outline" onClick={() => { setEditTodoId(todo.id); setEditTitle(todo.title); }}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
