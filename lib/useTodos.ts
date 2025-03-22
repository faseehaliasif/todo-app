import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useTodos = () => {
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axios.get("/api/todos");
      return res.data;
    },
  });

  // Add new todo
  const addTodo = useMutation({
    mutationFn: async (title: string) => {
      await axios.post("/api/todos", { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] }); // Refresh after add
    },
  });

  // Delete todo
  const deleteTodo = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Update todo
  const updateTodo = useMutation({
    mutationFn: async ({ id, title,completed }: { id: string; title: string,completed:boolean }) => {
      await axios.put(`/api/todos/${id}`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return { todos, isLoading, addTodo, deleteTodo, updateTodo };
};
