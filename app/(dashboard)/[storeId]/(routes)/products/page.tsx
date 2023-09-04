import { Product } from "./components/columns";
import prismadb from "@/lib/prismadb";
import {format} from "date-fns"
import ProductClient from "./components/client";

const ProductsPage = async({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include:{
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedProducts: Product[] = products.map(item => ({id: item.id, name: item.name, category: item.category.name, size: item.size.name, color: item.color.name, price: item.price, isArchived: item.isArchived, isFeatured: item.isFeatured, createdAt: format(item.createdAt, "MMMM do, yyyy")}))
  return (
    <div className="p-8 pt-6">
      <ProductClient data={formattedProducts}/>
    </div>
  );
};

export default ProductsPage;
