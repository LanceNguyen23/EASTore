import { ObjectId } from "mongodb";
import Heading from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form";
import { Separator } from "@/components/ui/separator";


const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const isCreateBillboard = params.billboardId === "new";
  const title = isCreateBillboard ? "Create billboard" : "Edit billboard";
  const desc = isCreateBillboard ? "Add a new billboard" : "Edit a billboard";

  const objectId =  !isCreateBillboard ? new ObjectId(params.billboardId).toString() : ""
  const billboard = !isCreateBillboard ? (await prismadb.billBoard.findUnique({
    where: {
      id: objectId,
    },
  })) : (null);

  return (
    <div className="p-8 pt-6 flex flex-col gap-4">
      <Heading title={title} desc={desc} />
      <Separator />
      <BillboardForm data={billboard} />
    </div>
  );
};

export default BillboardPage;
