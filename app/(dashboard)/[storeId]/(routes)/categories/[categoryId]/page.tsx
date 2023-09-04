import { ObjectId } from "mongodb";
import Heading from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";
import { Separator } from "@/components/ui/separator";


const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string, storeId: string};
}) => {
  const isCreateCategory = params.categoryId === "new";
  const title = isCreateCategory ? "Create category" : "Edit category";
  const desc = isCreateCategory ? "Add a new category" : "Edit a category";

  const objectId =  !isCreateCategory ? new ObjectId(params.categoryId).toString() : ""
  const categories = !isCreateCategory ? (await prismadb.category.findUnique({
    where: {
      id: objectId,
    },
  })) : (null);

  const billboards = await prismadb.billBoard.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className="p-8 pt-6 flex flex-col gap-4">
      <Heading title={title} desc={desc} />
      <Separator />
      <CategoryForm categories={categories} billboards={billboards} />
    </div>
  );
};

export default CategoryPage;
