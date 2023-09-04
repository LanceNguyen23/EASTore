import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const body = await req.json();
    const {
      name,
      price,
      image,
      colorId,
      sizeId,
      categoryId,
      isArchived,
      isFeatured,
    } = body;
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!image) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    if (!isArchived) {
      return new NextResponse("isArchived is required", { status: 400 });
    }

    if (!isFeatured) {
      return new NextResponse("isFeatured is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
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

    const newProduct= await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        storeId: params.storeId,
        image,
        name,
        price,
        colorId,
        sizeId,
        categoryId,
        isArchived,
        isFeatured,
      },
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    console.log("PRODUCT_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        storeId: params.storeId,
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCT_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
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

    const product = await prismadb.product.delete({
      where: {
        storeId: params.storeId,
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCT_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
