import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const body = await req.json();
    const { name, billboardId } = body;
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
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

    const newCategory = await prismadb.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        storeId: params.storeId,
        name,
        billboardId,
      },
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    console.log("CATEGORY_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        storeId: params.storeId,
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("CATEGORY_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; categoryId: string } }
  ) {
    try {
      if (!params.storeId) {
        return new NextResponse("Store ID is required", { status: 400 });
      }
      if (!params.categoryId) {
        return new NextResponse("Category ID is required", { status: 400 });
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
  
      const category = await prismadb.category.delete({
        where: {
          storeId: params.storeId,
          id: params.categoryId,
        },
      });
      return NextResponse.json(category);
    } catch (error) {
      console.log("CATEGORY_DELETE", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
