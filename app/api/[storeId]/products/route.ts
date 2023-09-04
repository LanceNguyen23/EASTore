import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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

    if (!image || !image.length) {
      return new NextResponse("Image is required", { status: 400 });
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

    if (!isFeatured) {
      return new NextResponse("isFeatured is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
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

    const newProduct = await prismadb.product.create({
      data: {
        storeId: params.storeId,
        image: {
          createMany: {
            data: [
              ...image.map((image: {url: string}) => image)
            ]
          }
        },
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
    console.log("PRODUCT_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log("PRODUCTS_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
