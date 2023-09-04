import { ObjectId } from "mongodb";
import Heading from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";
import { Separator } from "@/components/ui/separator";


const ProductPage = async ({
  params,
}: {
  params: { productId: string, storeId: string };
}) => {
  const isCreateProduct = params.productId === "new";
  const title = isCreateProduct ? "Create product" : "Edit product";
  const desc = isCreateProduct ? "Add a new product" : "Edit a product";

  const objectId =  !isCreateProduct ? new ObjectId(params.productId).toString() : ""
  const product = !isCreateProduct ? (await prismadb.product.findUnique({
    where: {
      id: objectId,
    },
    include: {
      image: true
    }
  })) : (null);
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    }
  })
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    }
  })
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    }
  })

  return (
    <div className="p-8 pt-6 flex flex-col gap-4">
      <Heading title={title} desc={desc} />
      <Separator />
      <ProductForm data={product} categories={categories} sizes={sizes} colors={colors}/>
    </div>
  );
};

export default ProductPage;
