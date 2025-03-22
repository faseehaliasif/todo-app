"use client";
import { useTodos } from "../../../lib/useTodos";
import { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (isLoading) return <p className="text-center text-gray-500">Loading Todos...</p>;

  // Filter todos based on search query
  const filteredTodos = todos.filter((todo: Todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const indexOfLastTodo = currentPage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleMarkAllCompleted = () => {
    filteredTodos.forEach((todo: Todo) => {
      if (!todo.completed) updateTodo.mutate({ ...todo, completed: true });
    });
  };

  const handleBulkDelete = () => {
    selectedTodos.forEach((id) => {
      const todoToDelete = todos.find((t: Todo) => t.id === id);
      if (todoToDelete) setDeletedTodo(todoToDelete);
      deleteTodo.mutate(id);
    });
    setSelectedTodos(new Set());
    toast("Todos deleted!", {
      action: { label: "Undo", onClick: handleUndoDelete },
    });
  };

  const handleUndoDelete = () => {
    if (deletedTodo) {
      addTodo.mutate(deletedTodo.title);
      setDeletedTodo(null);
    }
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      const todoToUpdate = todos.find((t: Todo) => t.id === id);
      if (todoToUpdate) {
        updateTodo.mutate({ id, title: editTitle, completed: todoToUpdate.completed });
        setEditTodoId(null);
        setEditTitle("");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 My Todo List</h1>

      <div className="flex justify-end mb-3">
        <Button onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <Input placeholder="New todo..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <Button onClick={() => newTitle.trim() && addTodo.mutate(newTitle) && setNewTitle("")}>Add</Button>
        <Input placeholder="🔍 Search Todos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

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

      <div className="rounded-lg border bg-white shadow dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-700">
              <TableHead className="w-10 text-center">
                <Checkbox
                  onCheckedChange={(checked) => setSelectedTodos(checked ? new Set(todos.map((t: Todo) => t.id)) : new Set())}
                />
              </TableHead>
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead>Task</TableHead>
              <TableHead className="text-center">Completed</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTodos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No todos found.
                </TableCell>
              </TableRow>
            ) : (
              currentTodos.map((todo: Todo, index: number) => (
                <TableRow key={todo.id}>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedTodos.has(todo.id)}
                      onCheckedChange={() => {
                        setSelectedTodos((prev) => {
                          const newSet = new Set(prev);
                          newSet.has(todo.id) ? newSet.delete(todo.id) : newSet.add(todo.id);
                          return newSet;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    {editTodoId === todo.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveEdit(todo.id)}
                        autoFocus
                      />
                    ) : (
                      <span onDoubleClick={() => { setEditTodoId(todo.id); setEditTitle(todo.title); }}>
                        {todo.title}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => updateTodo.mutate({ ...todo, completed: !todo.completed })}
                    />
                  </TableCell>
                  <TableCell className="flex justify-center gap-3">
                    <Button variant="destructive" onClick={() => deleteTodo.mutate(todo.id)}>Delete</Button>
                    <Button variant="outline" onClick={() => { setEditTodoId(todo.id); setEditTitle(todo.title); }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded-md px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || totalPages === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}