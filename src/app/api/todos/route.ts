import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}



//add a todo

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const newTodo = await prisma.todo.create({
      data: { title },
    });

    return NextResponse.json(newTodo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}


//delete a todo


export async function DELETE(req: Request) {
  try{
const {id} = await req.json();
const result =  await prisma.todo.findMany(id) 
console.log(result)
  }
  catch(error){
return NextResponse.json({error:"id not found"},{status:500})
  }
}





