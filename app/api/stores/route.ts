import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { storeName } = body;
        const session = await getServerSession(authOptions);

        if(!session?.user.id) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        if(!storeName) {
            return new NextResponse("Store name is required!", {status: 400})
        }

        const newStore = await prismadb.store.create({
            data: {
                name: storeName,
                userId: session?.user.id
            }
        })

        return NextResponse.json(newStore)

    } catch (error) {
        console.log("[STORES_POST]");
        return new NextResponse('Fail to create new store', {status: 500})
    }
}