import prismadb from "@/lib/prismadb";
import * as bcrypt from "bcrypt";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const body = await req.json();

    const {username, password} = body;

    const user = await prismadb.user.findFirst({
        where: {
            email: username
        }
    })

    if(!user) {
        return new NextResponse(JSON.stringify("Username is invalid!😟"), {status: 404})
    }

    if(!await bcrypt.compare(password, user.password)) {
        return new NextResponse(JSON.stringify("Incorrect password!😟"), {status: 404})
    }

    if(user && await bcrypt.compare(password, user.password)) {
        const { password, ...userWithoutPass } = user;
        return new NextResponse(JSON.stringify(userWithoutPass))
    }
}