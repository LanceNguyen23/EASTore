import { ObjectId } from "mongodb";
import Heading from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";
import SizeForm from "./components/size-form";
import { Separator } from "@/components/ui/separator";


const SizePage = async ({
  params,
}: {
  params: { sizeId: string };
}) => {
  const isCreateSize = params.sizeId === "new";
  const title = isCreateSize ? "Create size" : "Edit size";
  const desc = isCreateSize ? "Add a new size" : "Edit a size";

  const objectId =  !isCreateSize ? new ObjectId(params.sizeId).toString() : ""
  const size = !isCreateSize ? (await prismadb.size.findUnique({
    where: {
      id: objectId,
    },
  })) : (null);

  return (
    <div className="p-8 pt-6 flex flex-col gap-4">
      <Heading title={title} desc={desc} />
      <Separator />
      <SizeForm data={size} />
    </div>
  );
};

export default SizePage;
