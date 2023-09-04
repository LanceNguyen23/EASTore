import { Category } from "./components/columns";
import prismadb from "@/lib/prismadb";
import {format} from "date-fns"
import CategoryClient from "./components/client";

const CategoryColumns = async({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedCategories: Category[] = categories.map(item => ({id: item.id, name: item.name, billboardLabel: item.billboard.label, createdAt: format(item.createdAt, "MMMM do, yyyy")}))
  return (
    <div className="p-8 pt-6">
      <CategoryClient data={formattedCategories}/>
    </div>
  );
};

export default CategoryColumns;
