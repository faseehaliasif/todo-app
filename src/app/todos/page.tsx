"use client";
import { useTodos } from "../../../lib/useTodos";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Model from "@/components/Model";
import { Checkbox } from "@/components/ui/checkbox";

// ✅ Define Todo Type
type Todo = {
  id: string;
  title: string;
  createdAt?: string;
  completed: boolean;
};

export default function TodosPage() {
  const { todos, isLoading, addTodo, deleteTodo, updateTodo } = useTodos();
  const [newTitle, setNewTitle] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [todosPerPage, setTodosPerPage] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"title" | "createdAt" | "completed">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");

  if (isLoading) return <p className="text-center text-gray-500">Loading Todos...</p>;

  // 🔍 Filter Todos Based on Search Query & Status
  const filteredTodos = todos
    .filter((todo:Todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((todo:Todo) => {
      if (filterStatus === "completed") return todo.completed;
      if (filterStatus === "pending") return !todo.completed;
      return true;
    });

  // 🔄 Sorting Function
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    } else if (sortBy === "createdAt") {
      return sortOrder === "asc"
        ? new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime()
        : new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
    } else {
      return sortOrder === "asc" ? Number(a.completed) - Number(b.completed) : Number(b.completed) - Number(a.completed);
    }
  });

  // 📌 Pagination Logic
  const totalPages = Math.ceil(sortedTodos.length / todosPerPage);
  const paginatedTodos = sortedTodos.slice((currentPage - 1) * todosPerPage, currentPage * todosPerPage);

  // 🔄 Handle Sorting
  const handleSort = (field: "title" | "createdAt" | "completed") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // ✅ Handle Select Todo for Bulk Actions
  const toggleTodoSelection = (id: string) => {
    setSelectedTodos((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // ✅ Handle Bulk Delete
  const handleBulkDelete = () => {
    selectedTodos.forEach((id) => deleteTodo.mutate(id));
    setSelectedTodos(new Set());
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 My Todo List</h1>

      {/* Add Todo & Search */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Input className="flex-1" placeholder="New todo..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <Button onClick={() => newTitle.trim() && addTodo.mutate(newTitle) && setNewTitle("")}>Add</Button>
        <Input className="w-64 border px-3 py-2 rounded-md" placeholder="🔍 Search Todos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* Filter & Bulk Delete */}
      <div className="flex justify-between items-center mb-4">
        {/* Filter by Status */}
        <div>
          <select
            className="border rounded-md px-2 py-1 text-gray-700"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "completed" | "pending")}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Bulk Delete Button */}
        {selectedTodos.size > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            Delete {selectedTodos.size} Todos
          </Button>
        )}
      </div>

      {/* Dashboard Table */}
      <div className="rounded-lg border bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-10 text-center">
                <Checkbox onCheckedChange={(checked) => setSelectedTodos(checked ? new Set(filteredTodos.map((t:Todo) => t.id)) : new Set())} />
              </TableHead>
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                Task {sortBy === "title" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                Created At {sortBy === "createdAt" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("completed")}>
                Completed {sortBy === "completed" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTodos.length > 0 ? (
              paginatedTodos.map((todo, index) => (
                <TableRow key={todo.id}>
                  <TableCell className="text-center">
                    <Checkbox checked={selectedTodos.has(todo.id)} onCheckedChange={() => toggleTodoSelection(todo.id)} />
                  </TableCell>
                  <TableCell className="text-center">{(currentPage - 1) * todosPerPage + index + 1}</TableCell>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>{todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{todo.completed ? "✅" : "❌"}</TableCell>
                  <TableCell className="flex justify-center gap-3">
                    <Button variant="destructive" onClick={() => deleteTodo.mutate(todo.id)}>Delete</Button>
                    <Button variant="outline" onClick={() => { setEditTodo(todo); setOpen(true); }}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-4">No Todos Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {open && editTodo && <Model setOpen={setOpen} editTodo={editTodo} updateTodo={updateTodo} />}
    </div>
  );
}
