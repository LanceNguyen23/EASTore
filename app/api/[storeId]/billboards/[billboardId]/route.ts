import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const body = await req.json();
    const { label, imageUrl } = body;
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
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

    const newBillboard = await prismadb.billBoard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        storeId: params.storeId,
        label,
        imageUrl,
      },
    });
    return NextResponse.json(newBillboard);
  } catch (error) {
    console.log("BILLBOARD_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const billboard = await prismadb.billBoard.findUnique({
      where: {
        storeId: params.storeId,
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("BILLBOARD_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; billboardId: string } }
  ) {
    try {
      if (!params.storeId) {
        return new NextResponse("Store ID is required", { status: 400 });
      }
      if (!params.billboardId) {
        return new NextResponse("Billboard ID is required", { status: 400 });
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
  
      const billboard = await prismadb.billBoard.delete({
        where: {
          storeId: params.storeId,
          id: params.billboardId,
        },
      });
      return NextResponse.json(billboard);
    } catch (error) {
      console.log("BILLBOARD_DELETE", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
