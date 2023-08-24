import prismadb from "@/lib/prismadb";
import * as bcrypt from "bcrypt";

export async function POST(req: Request) {
    const body = await req.json();

    const user = await prismadb.user.findFirst({
        where: {
            name: body.username
        }
    })

    if(user?.email) {
        return new Response(JSON.stringify("Email already exists! 😟"))
    }
    if(user?.name) {
        return new Response(JSON.stringify("Username already exists! 😟"))
    }

    const newUser = await prismadb.user.create({
        data: {
            name: body.username,
            email: body.email,
            password: await bcrypt.hash(body.password, 10)
            
        }
    })

    const {password, ...result} = newUser
    
    return new Response(JSON.stringify(result))
}