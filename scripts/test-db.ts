import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

const fetchData = async() =>{
const data = await prisma.todo.findMany();
console.log("todo-app",data)
}


fetchData()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });