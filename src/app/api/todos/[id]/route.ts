import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
 // Ensure prisma is correctly imported

const prisma = new PrismaClient()


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Check if the todo exists
    const existingTodo = await prisma.todo.findUnique({ where: { id } });
    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Delete the todo
    await prisma.todo.delete({ where: { id } });

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}



//update a list


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } =await params; // Extract ID from URL
    const { title } = await request.json(); // Extract updated title from request body

    // Update the todo in the database
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}


