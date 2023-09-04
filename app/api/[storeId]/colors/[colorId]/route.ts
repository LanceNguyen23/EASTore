import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const body = await req.json();
    const { name, value } = body;
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const newColor = await prismadb.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        storeId: params.storeId,
        name,
        value,
      },
    });
    return NextResponse.json(newColor);
  } catch (error) {
    console.log("COLOR_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        storeId: params.storeId,
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("COLOR_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; colorId: string } }
  ) {
    try {
      if (!params.storeId) {
        return new NextResponse("Store ID is required", { status: 400 });
      }
      if (!params.colorId) {
        return new NextResponse("Color ID is required", { status: 400 });
      }
      const session = await getServerSession(authOptions);
  
      if (!session || !session?.user) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }

      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
          userId: session.user.id,
        },
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      const color = await prismadb.color.delete({
        where: {
          storeId: params.storeId,
          id: params.colorId,
        },
      });
      return NextResponse.json(color);
    } catch (error) {
      console.log("COLOR", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
